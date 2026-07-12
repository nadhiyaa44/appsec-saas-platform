export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface Finding {
  id: number;
  sev: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  desc: string;
  cve: string;
  fix: string;
}

export interface AppInfo {
  name: string;
  platform: string;
  logo: string | null;
  bg: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  date: string;
  flag?: string;
}

export interface FraudIndicator {
  type: string;
  risk: string;
  desc: string;
}

export interface ReviewSentimentData {
  totalReviews: number;
  positivePercent: number;
  negativePercent: number;
  neutralPercent: number;
  fakeReviewPercent: number;
  fraudRiskScore: number;
  sentimentScore: number;
  recentReviews: Review[];
  fraudIndicators: FraudIndicator[];
}

export interface ScanReport {
  id: string;
  url: string;
  appInfo: AppInfo;
  timestamp: string;
  overallScore: number;
  categories: {
    permissions: { score: number; label: string; findings: Finding[] };
    network: { score: number; label: string; findings: Finding[] };
    privacy: { score: number; label: string; findings: Finding[] };
    obfuscation: { score: number; label: string; findings: Finding[] };
  };
  aiSummary: string;
  recommendations: string[];
  sentiment: ReviewSentimentData | null;
}

export interface DashboardStats {
  totalScans: number;
  highRiskScans: number;
  avgScore: number;
  history: Array<{
    id: string;
    name: string;
    score: number;
    date: string;
  }>;
}
