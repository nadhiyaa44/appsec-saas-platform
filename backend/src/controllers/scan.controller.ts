import { Response } from "express";
import prisma from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";
import { executeScan } from "../services/scanner.service";

export async function runScan(req: AuthenticatedRequest, res: Response) {
  try {
    const { url } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Access Denied: Missing User Claims" });
    }

    // Execute scan (either AI-driven or emulated fallback)
    const { appInfo, report } = await executeScan(url);

    // Save or update App record
    let app = await prisma.app.findUnique({
      where: { url },
    });

    if (!app) {
      app = await prisma.app.create({
        data: {
          name: appInfo.name,
          platform: appInfo.platform,
          url,
          logo: appInfo.logo,
          bg: appInfo.bg,
        },
      });
    }

    // Save Scan record
    const scan = await prisma.scan.create({
      data: {
        appId: app.id,
        userId,
        overallScore: report.overallScore,
        riskLevel: report.riskLevel,
      },
    });

    // Save Report findings
    await prisma.report.create({
      data: {
        scanId: scan.id,
        aiSummary: report.aiSummary,
        recommendations: JSON.stringify(report.recommendations),
        permissionFindings: JSON.stringify(report.permissions),
        networkFindings: JSON.stringify(report.network),
        privacyFindings: JSON.stringify(report.privacy),
        codeFindings: JSON.stringify(report.codeSecurity),
      },
    });

    // Save/Update Sentiment stats
    const existingSentiment = await prisma.reviewSentiment.findUnique({
      where: { appId: app.id },
    });

    if (existingSentiment) {
      await prisma.reviewSentiment.update({
        where: { appId: app.id },
        data: {
          totalReviews: report.sentiment.totalReviews,
          positivePercent: report.sentiment.positivePercent,
          negativePercent: report.sentiment.negativePercent,
          neutralPercent: report.sentiment.neutralPercent,
          fakeReviewPercent: report.sentiment.fakeReviewPercent,
          fraudRiskScore: report.sentiment.fraudRiskScore,
          sentimentScore: report.sentiment.sentimentScore,
          recentReviews: JSON.stringify(report.sentiment.recentReviews),
          fraudIndicators: JSON.stringify(report.sentiment.fraudIndicators),
        },
      });
    } else {
      await prisma.reviewSentiment.create({
        data: {
          appId: app.id,
          totalReviews: report.sentiment.totalReviews,
          positivePercent: report.sentiment.positivePercent,
          negativePercent: report.sentiment.negativePercent,
          neutralPercent: report.sentiment.neutralPercent,
          fakeReviewPercent: report.sentiment.fakeReviewPercent,
          fraudRiskScore: report.sentiment.fraudRiskScore,
          sentimentScore: report.sentiment.sentimentScore,
          recentReviews: JSON.stringify(report.sentiment.recentReviews),
          fraudIndicators: JSON.stringify(report.sentiment.fraudIndicators),
        },
      });
    }

    // Return compiled result
    res.status(201).json({
      id: scan.id,
      url,
      appInfo: {
        name: app.name,
        platform: app.platform,
        logo: app.logo,
        bg: app.bg,
      },
      timestamp: scan.createdAt.toISOString(),
      overallScore: scan.overallScore,
      categories: {
        permissions: { score: report.overallScore + 2 > 100 ? 100 : report.overallScore + 2, label: "Permissions", findings: report.permissions },
        network: { score: report.overallScore - 5 < 0 ? 0 : report.overallScore - 5, label: "Network/API", findings: report.network },
        privacy: { score: report.overallScore + 5 > 100 ? 100 : report.overallScore + 5, label: "Privacy", findings: report.privacy },
        obfuscation: { score: report.overallScore - 1 < 0 ? 0 : report.overallScore - 1, label: "Code Security", findings: report.codeSecurity },
      },
      sentiment: report.sentiment,
      aiSummary: report.aiSummary,
      recommendations: report.recommendations,
    });
  } catch (error) {
    console.error("runScan controller error:", error);
    res.status(500).json({ error: "Failed to compile security threat report" });
  }
}

export async function getScanHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const scans = await prisma.scan.findMany({
      where: { userId },
      include: {
        app: true,
        report: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedHistory = await Promise.all(
      scans.map(async (scan) => {
        // Fetch review sentiment for the app
        const sentiment = await prisma.reviewSentiment.findUnique({
          where: { appId: scan.appId },
        });

        const recs = scan.report ? JSON.parse(scan.report.recommendations) : [];
        const permissions = scan.report ? JSON.parse(scan.report.permissionFindings) : [];
        const network = scan.report ? JSON.parse(scan.report.networkFindings) : [];
        const privacy = scan.report ? JSON.parse(scan.report.privacyFindings) : [];
        const codeSecurity = scan.report ? JSON.parse(scan.report.codeFindings) : [];

        return {
          id: scan.id,
          url: scan.app.url,
          appInfo: {
            name: scan.app.name,
            platform: scan.app.platform,
            logo: scan.app.logo,
            bg: scan.app.bg,
          },
          timestamp: scan.createdAt.toISOString(),
          overallScore: scan.overallScore,
          categories: {
            permissions: { score: scan.overallScore + 2 > 100 ? 100 : scan.overallScore + 2, label: "Permissions", findings: permissions },
            network: { score: scan.overallScore - 5 < 0 ? 0 : scan.overallScore - 5, label: "Network/API", findings: network },
            privacy: { score: scan.overallScore + 5 > 100 ? 100 : scan.overallScore + 5, label: "Privacy", findings: privacy },
            obfuscation: { score: scan.overallScore - 1 < 0 ? 0 : scan.overallScore - 1, label: "Code Security", findings: codeSecurity },
          },
          aiSummary: scan.report ? scan.report.aiSummary : "",
          recommendations: recs,
          sentiment: sentiment
            ? {
                totalReviews: sentiment.totalReviews,
                positivePercent: sentiment.positivePercent,
                negativePercent: sentiment.negativePercent,
                neutralPercent: sentiment.neutralPercent,
                fakeReviewPercent: sentiment.fakeReviewPercent,
                fraudRiskScore: sentiment.fraudRiskScore,
                sentimentScore: sentiment.sentimentScore,
                recentReviews: JSON.parse(sentiment.recentReviews),
                fraudIndicators: JSON.parse(sentiment.fraudIndicators),
              }
            : null,
        };
      })
    );

    res.json(formattedHistory);
  } catch (error) {
    console.error("getScanHistory error:", error);
    res.status(500).json({ error: "Failed to retrieve scan history" });
  }
}

export async function deleteScan(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const scan = await prisma.scan.findUnique({
      where: { id },
    });

    if (!scan) {
      return res.status(404).json({ error: "Scan not found" });
    }

    if (scan.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not own this scan report" });
    }

    await prisma.scan.delete({
      where: { id },
    });

    res.json({ message: "Scan deleted successfully" });
  } catch (error) {
    console.error("deleteScan error:", error);
    res.status(500).json({ error: "Failed to delete scan report" });
  }
}
