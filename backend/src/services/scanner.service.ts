import { analyzeTargetWithAI, isGeminiConfigured, SecurityReport } from "./gemini.service";
import { generateEmulatedReport } from "./emulator.service";

export interface AppInfo {
  name: string;
  platform: string;
  logo: string | null;
  bg: string;
}

const brands: { [key: string]: { name: string; logo: string; bg: string } } = {
  "instagram": { name: "Instagram", logo: "https://www.instagram.com/favicon.ico", bg: "#E1306C" },
  "tiktok": { name: "TikTok", logo: "https://www.tiktok.com/favicon.ico", bg: "#010101" },
  "twitter": { name: "X (Twitter)", logo: "https://abs.twimg.com/favicons/twitter.3.ico", bg: "#000000" },
  "x.com": { name: "X (Twitter)", logo: "https://abs.twimg.com/favicons/twitter.3.ico", bg: "#000000" },
  "facebook": { name: "Facebook", logo: "https://www.facebook.com/favicon.ico", bg: "#1877F2" },
  "youtube": { name: "YouTube", logo: "https://www.youtube.com/favicon.ico", bg: "#FF0000" },
  "spotify": { name: "Spotify", logo: "https://www.spotify.com/favicon.ico", bg: "#1DB954" },
  "linkedin": { name: "LinkedIn", logo: "https://www.linkedin.com/favicon.ico", bg: "#0A66C2" },
  "github": { name: "GitHub", logo: "https://github.com/favicon.ico", bg: "#24292E" },
  "google": { name: "Google", logo: "https://www.google.com/favicon.ico", bg: "#4285F4" },
  "zoom": { name: "Zoom", logo: "https://www.zoom.us/favicon.ico", bg: "#2D8CFF" },
  "discord": { name: "Discord", logo: "https://discord.com/favicon.ico", bg: "#5865F2" },
  "telegram": { name: "Telegram", logo: "https://telegram.org/favicon.ico", bg: "#2AABEE" },
  "netflix": { name: "Netflix", logo: "https://www.netflix.com/favicon.ico", bg: "#E50914" },
  "whatsapp": { name: "WhatsApp", logo: "https://www.whatsapp.com/favicon.ico", bg: "#25D366" },
  "amazon": { name: "Amazon", logo: "https://www.amazon.com/favicon.ico", bg: "#FF9900" },
  "slack": { name: "Slack", logo: "https://slack.com/favicon.ico", bg: "#4A154B" },
  "notion": { name: "Notion", logo: "https://www.notion.so/favicon.ico", bg: "#000000" },
  "figma": { name: "Figma", logo: "https://www.figma.com/favicon.ico", bg: "#F24E1E" },
  "canva": { name: "Canva", logo: "https://www.canva.com/favicon.ico", bg: "#00C4CC" }
};

export function extractAppInfo(url: string): AppInfo {
  const u = url.trim().toLowerCase();

  // Extract hostname safely
  let hostname = "";
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    hostname = new URL(fullUrl).hostname.replace(/^www\./, "");
  } catch {
    hostname = u;
  }

  // Determine Platform
  let platform = "Web Application";
  if (u.includes("play.google.com")) {
    platform = "Google Play";
  } else if (u.includes("apps.apple.com")) {
    platform = "iOS App Store";
  } else if (u.includes("/api/") || u.includes("api.") || u.endsWith("/graphql")) {
    platform = "REST API";
  }

  // Extract package ID for Google Play
  let packageId = "";
  if (platform === "Google Play") {
    const playIdMatch = url.match(/[?&]id=([^&]+)/i);
    if (playIdMatch) packageId = playIdMatch[1].toLowerCase();
  }

  // Check if it matches a known brand keyword depending on the platform
  let matchedBrandKey = "";
  for (const key of Object.keys(brands)) {
    if (platform === "Google Play") {
      // Check package ID (e.g. com.instagram.android)
      if (packageId && packageId.includes(key)) {
        // Skip "google" if package ID has another more specific brand preset
        if (key === "google") {
          const hasOtherBrand = Object.keys(brands).some(otherKey => otherKey !== "google" && packageId.includes(otherKey));
          if (hasOtherBrand) continue;
        }
        matchedBrandKey = key;
        break;
      }
    } else if (platform === "iOS App Store") {
      // Check app store path (e.g. /us/app/zoom-workplace)
      if (u.includes(key)) {
        matchedBrandKey = key;
        break;
      }
    } else {
      // For Web Application and REST API: match hostname directly (e.g. hostname is figma.com or ends with .figma.com)
      // We check for brand key as a domain token (e.g. key + ".com" or just key in hostname parts)
      const brandDomainSuffix = key.includes(".") ? key : `${key}.com`;
      if (hostname === brandDomainSuffix || hostname.endsWith("." + brandDomainSuffix) || hostname.split(".")[0] === key) {
        matchedBrandKey = key;
        break;
      }
    }
  }

  let name = "";
  let logo: string | null = null;
  let bg = "#334155";

  if (matchedBrandKey) {
    const brand = brands[matchedBrandKey];
    name = brand.name;
    logo = brand.logo;
    bg = brand.bg;
  } else {
    // Dynamic parsing fallbacks
    if (platform === "Google Play") {
      if (packageId) {
        const parts = packageId.split(".");
        const raw = parts[parts.length - 1].replace(/([A-Z])/g, " $1").trim();
        name = raw.charAt(0).toUpperCase() + raw.slice(1);
        if ((name.toLowerCase() === "android" || name.toLowerCase() === "app") && parts.length > 2) {
          const parentRaw = parts[parts.length - 2];
          name = parentRaw.charAt(0).toUpperCase() + parentRaw.slice(1);
        }
      } else {
        name = "Google Play App";
      }
      bg = "#34A853";
    } else if (platform === "iOS App Store") {
      const appleMatch = url.match(/apps\.apple\.com\/[^/]+\/app\/([^/]+)\//i);
      if (appleMatch) {
        name = appleMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      } else {
        name = "iOS App Store App";
      }
      bg = "#555555";
    } else if (platform === "REST API") {
      name = hostname ? `${hostname.split(".")[0].toUpperCase()} API` : "REST API Endpoint";
      logo = hostname ? `https://www.google.com/s2/favicons?sz=64&domain=${hostname}` : null;
      bg = "#0f172a";
    } else {
      const parts = hostname.split(".");
      const rawName = parts[0];
      name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      logo = `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
      bg = "#334155";
    }
  }

  return { name, platform, logo, bg };
}

export async function executeScan(url: string): Promise<{ appInfo: AppInfo; report: SecurityReport }> {
  const appInfo = extractAppInfo(url);
  
  if (isGeminiConfigured()) {
    try {
      const report = await analyzeTargetWithAI(url, appInfo.name, appInfo.platform);
      return { appInfo, report };
    } catch (err) {
      console.warn("AI scan failed, falling back to local emulator:", err);
      const report = generateEmulatedReport(url, appInfo.name, appInfo.platform);
      return { appInfo, report };
    }
  } else {
    const report = generateEmulatedReport(url, appInfo.name, appInfo.platform);
    // Simulate minor processing delay
    await new Promise(res => setTimeout(res, 1200));
    return { appInfo, report };
  }
}
