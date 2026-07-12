import { Response } from "express";
import prisma from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const totalScans = await prisma.scan.count({
      where: { userId },
    });

    const highRiskScans = await prisma.scan.count({
      where: {
        userId,
        riskLevel: "HIGH",
      },
    });

    const scans = await prisma.scan.findMany({
      where: { userId },
      select: { overallScore: true },
    });

    const avgScore = scans.length
      ? Math.round(scans.reduce((acc, curr) => acc + curr.overallScore, 0) / scans.length)
      : 0;

    const recentScans = await prisma.scan.findMany({
      where: { userId },
      include: { app: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // Format recent scans history for dashboard chart (recharts)
    const history = recentScans.map((scan) => ({
      id: scan.id,
      name: scan.app.name,
      score: scan.overallScore,
      date: scan.createdAt.toLocaleDateString(),
    }));

    res.json({
      totalScans,
      highRiskScans,
      avgScore,
      history,
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ error: "Failed to gather dashboard threat telemetry" });
  }
}
