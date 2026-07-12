import { GoogleGenAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export interface Finding {
  id: number;
  sev: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  desc: string;
  cve: string;
  fix: string;
}

export interface SecurityReport {
  overallScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  aiSummary: string;
  recommendations: string[];
  permissions: Finding[];
  network: Finding[];
  privacy: Finding[];
  codeSecurity: Finding[];
  sentiment: {
    totalReviews: number;
    positivePercent: number;
    negativePercent: number;
    neutralPercent: number;
    fakeReviewPercent: number;
    fraudRiskScore: number;
    sentimentScore: number;
    recentReviews: Array<{
      id: number;
      user: string;
      rating: number;
      text: string;
      sentiment: string;
      date: string;
      flag?: string;
    }>;
    fraudIndicators: Array<{
      type: string;
      risk: string;
      desc: string;
    }>;
  };
}

// Check if Gemini is configured
export const isGeminiConfigured = (): boolean => {
  return GEMINI_API_KEY.trim().length > 0;
};

// Main analyze function
export async function analyzeTargetWithAI(
  url: string,
  appName: string,
  platform: string
): Promise<SecurityReport> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini API key is not configured. Fallback to Emulator required.");
  }

  try {
    // Note: The new @google/generative-ai SDK from version 0.21.0 uses GoogleGenAI constructor or simple imports.
    // For standard Gemini API access:
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are a senior full-stack cybersecurity engineer, malware analyst, and AI trust specialist.
      Perform a deep simulated security scan of the following target application:
      Target URL: "${url}"
      App Name: "${appName}"
      Platform: "${platform}"

      Generate a comprehensive threat intelligence and security report. The output MUST be a valid JSON object matching the TypeScript structure below.
      Be realistic, technical, and refer to real CWE standards (like CWE-319, CWE-250, CWE-359) and typical CVEs if applicable.
      Provide realistic recommendations and findings.

      JSON structure to return:
      {
        "overallScore": number (0 to 100, where 100 is secure, 0 is highly insecure),
        "riskLevel": "LOW" | "MEDIUM" | "HIGH",
        "aiSummary": "A detailed 3-4 sentence paragraph summarizing the security posture, privacy policy alignment, review patterns, and key vulnerabilities found.",
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
        "permissions": [
          { "id": 1, "sev": "critical"|"high"|"medium"|"low"|"info", "title": "...", "desc": "...", "cve": "...", "fix": "..." }
        ],
        "network": [
          { "id": 6, "sev": "critical"|"high"|"medium"|"low"|"info", "title": "...", "desc": "...", "cve": "...", "fix": "..." }
        ],
        "privacy": [
          { "id": 10, "sev": "critical"|"high"|"medium"|"low"|"info", "title": "...", "desc": "...", "cve": "...", "fix": "..." }
        ],
        "codeSecurity": [
          { "id": 14, "sev": "critical"|"high"|"medium"|"low"|"info", "title": "...", "desc": "...", "cve": "...", "fix": "..." }
        ],
        "sentiment": {
          "totalReviews": number (e.g. 1000 - 50000),
          "positivePercent": number,
          "negativePercent": number,
          "neutralPercent": number,
          "fakeReviewPercent": number (0-100 indicating percentage of bot reviews),
          "fraudRiskScore": number (0-100 indicating risk of review manipulation/fraud),
          "sentimentScore": number (overall 0-100 rating),
          "recentReviews": [
            { "id": 1, "user": "string", "rating": number, "text": "string", "sentiment": "positive"|"negative"|"neutral", "date": "YYYY-MM-DD", "flag": "optional string (e.g. ⚠️ Fraud Indicator)" }
          ],
          "fraudIndicators": [
            { "type": "string", "risk": "low"|"medium"|"high"|"critical", "desc": "string" }
          ]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as SecurityReport;
  } catch (error) {
    console.error("Gemini AI API execution failed, will need fallback:", error);
    throw error;
  }
}
