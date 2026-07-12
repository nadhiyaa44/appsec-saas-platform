import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateEmulatedReport } from "../src/services/emulator.service";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed database run...");

  // Clean database
  await prisma.report.deleteMany({});
  await prisma.reviewSentiment.deleteMany({});
  await prisma.scan.deleteMany({});
  await prisma.app.deleteMany({});
  await prisma.user.deleteMany({});

  // Create demo user
  const passwordHash = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.create({
    data: {
      name: "Security Analyst",
      email: "demo@appsec.io",
      passwordHash,
      role: "Premium",
    },
  });

  console.log(`👤 Created Demo User: ${demoUser.email} (Password: demo123)`);

  // Target app entries to seed
  const appTargets = [
    { name: "Instagram", url: "https://play.google.com/store/apps/details?id=com.instagram.android", platform: "Google Play", bg: "#E1306C" },
    { name: "X (Twitter)", url: "https://x.com", platform: "Web Application", bg: "#000000" },
    { name: "Zoom", url: "https://apps.apple.com/us/app/zoom-workplace/id546505307", platform: "iOS App Store", bg: "#2D8CFF" },
    { name: "Public Ledger API", url: "https://api.ledger.example.com/v1", platform: "REST API", bg: "#0f172a" },
  ];

  for (const target of appTargets) {
    const app = await prisma.app.create({
      data: {
        name: target.name,
        url: target.url,
        platform: target.platform,
        logo: `https://www.google.com/s2/favicons?sz=64&domain=${new URL(target.url.startsWith("http") ? target.url : `https://${target.url}`).hostname}`,
        bg: target.bg,
      },
    });

    // Generate simulated report findings
    const reportData = generateEmulatedReport(target.url, target.name, target.platform);

    // Save Scan
    const scan = await prisma.scan.create({
      data: {
        appId: app.id,
        userId: demoUser.id,
        overallScore: reportData.overallScore,
        riskLevel: reportData.riskLevel,
        createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Random timestamp in past 10 days
      },
    });

    // Save Report Findings
    await prisma.report.create({
      data: {
        scanId: scan.id,
        aiSummary: reportData.aiSummary,
        recommendations: JSON.stringify(reportData.recommendations),
        permissionFindings: JSON.stringify(reportData.permissions),
        networkFindings: JSON.stringify(reportData.network),
        privacyFindings: JSON.stringify(reportData.privacy),
        codeFindings: JSON.stringify(reportData.codeSecurity),
      },
    });

    // Save Review Sentiment Analysis
    await prisma.reviewSentiment.create({
      data: {
        appId: app.id,
        totalReviews: reportData.sentiment.totalReviews,
        positivePercent: reportData.sentiment.positivePercent,
        negativePercent: reportData.sentiment.negativePercent,
        neutralPercent: reportData.sentiment.neutralPercent,
        fakeReviewPercent: reportData.sentiment.fakeReviewPercent,
        fraudRiskScore: reportData.sentiment.fraudRiskScore,
        sentimentScore: reportData.sentiment.sentimentScore,
        recentReviews: JSON.stringify(reportData.sentiment.recentReviews),
        fraudIndicators: JSON.stringify(reportData.sentiment.fraudIndicators),
      },
    });

    console.log(`🛡️ Seeded Scan Report for ${target.name} (Score: ${reportData.overallScore})`);
  }

  console.log("✅ Seed execution completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed database script crashed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
