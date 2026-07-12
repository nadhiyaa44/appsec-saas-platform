import { SecurityReport, Finding } from "./gemini.service";

export function generateEmulatedReport(url: string, appName: string, platform: string): SecurityReport {
  // Use URL to generate a deterministic seed
  const seed = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomRange = (min: number, max: number, offset = 0) => {
    return min + (seed * 17 + offset * 31) % (max - min);
  };

  const overallScore = randomRange(35, 88, 1);
  const riskLevel = overallScore < 50 ? "HIGH" : overallScore < 75 ? "MEDIUM" : "LOW";

  // Build findings depending on the platform type
  let permissions: Finding[] = [];
  let network: Finding[] = [];
  let privacy: Finding[] = [];
  let codeSecurity: Finding[] = [];
  let aiSummary = "";
  let recommendations: string[] = [];

  if (platform === "Google Play" || platform === "iOS App Store") {
    const isAndroid = platform === "Google Play";
    aiSummary = `Simulated analysis of ${appName} (${platform}) revealed several compliance and security items. The app requests ${isAndroid ? "dangerous permissions (background location, camera)" : "extensive framework access permissions"}. Sentiment mining on public reviews suggests a ${overallScore < 50 ? "high" : "moderate"} density of fake ratings or promotional bots. Critical vulnerabilities include cleartext HTTP fallbacks and unpinned SSL endpoints.`;

    recommendations = [
      `Enforce background permission gating and strict justification flows.`,
      `Implement SHA-256 certificate pinning on all API hostnames.`,
      `Remove unused third-party marketing SDKs to comply with GDPR data-minimization rules.`,
      `Obfuscate application builds using ${isAndroid ? "ProGuard/DexGuard" : "SwiftShield/obfuscator-llvm"} to prevent reverse-engineering.`
    ];

    permissions = [
      {
        id: 1,
        sev: overallScore < 55 ? "critical" : "high",
        title: isAndroid ? "Geolocation Background Access" : "Inconsistent Location Triggers",
        desc: isAndroid
          ? "Precise GPS requested in background without clear user consent. Violates GDPR Article 9."
          : "App requests location authorization triggers during startup before rendering maps.",
        cve: "N/A",
        fix: "Restrict location permissions to foreground-only; introduce an explicit privacy disclosure popup."
      },
      {
        id: 2,
        sev: "medium",
        title: isAndroid ? "READ_CONTACTS Permission Flagged" : "Address Book Sharing Enabled",
        desc: "Full contact list read permissions declared. No core feature justifying contact mining was detected in the UI scan.",
        cve: "CWE-250",
        fix: "Migrate to the system Contact Picker API which doesn't require permanent full address book read permission."
      },
      {
        id: 3,
        sev: overallScore < 60 ? "high" : "medium",
        title: "Bundled Media Capture Access",
        desc: "Permissions for camera and microphone are requested in a single startup sequence.",
        cve: "CWE-272",
        fix: "Gate media capture behind user-initiated button triggers, prompting only when needed."
      },
      {
        id: 4,
        sev: "low",
        title: "Push Notification Payload Audit",
        desc: "Standard notification permissions declared. Low risk of notification spoofing.",
        cve: "N/A",
        fix: "Ensure notification payloads use end-to-end data encryption and omit sensitive personal data."
      }
    ];

    network = [
      {
        id: 6,
        sev: overallScore < 60 ? "critical" : "high",
        title: "Cleartext HTTP Token Transmission",
        desc: "Authentication bearer tokens are transmitted over plain HTTP during connection retries.",
        cve: "CVE-2023-38545",
        fix: "Configure network security config to disable cleartext traffic entirely (android:usesCleartextTraffic='false')."
      },
      {
        id: 7,
        sev: "high",
        title: "Undisclosed Third-party Analytics Integration",
        desc: "Mixpanel and Amplitude SDK integrations detected in bundle. User profiles and usage data are uploaded without user opting in.",
        cve: "CWE-200",
        fix: "Introduce compliance checkboxes for analytics tracking; delay SDK init until user grants permission."
      },
      {
        id: 8,
        sev: "medium",
        title: isAndroid ? "Cleartext Traffic Permitted in Android Manifest" : "Arbitrary Loads Allowed in Info.plist",
        desc: isAndroid
          ? "android:usesCleartextTraffic set to true in Manifest, facilitating TLS downgrade attacks."
          : "NSAllowsArbitraryLoads key set to YES in Info.plist, allowing unencrypted HTTP connections.",
        cve: "CWE-319",
        fix: isAndroid
          ? "Set android:usesCleartextTraffic='false' and enforce strict HTTPS."
          : "Remove NSAllowsArbitraryLoads or restrict it using strict NSExceptionDomains."
      }
    ];

    privacy = [
      {
        id: 10,
        sev: "critical",
        title: "Cross-App Canvas Fingerprinting",
        desc: "Canvas rendering script signatures detected in adware packages, collecting device fingerprint IDs.",
        cve: "CWE-359",
        fix: "Remove fingerprinting ad SDKs; upgrade to privacy-respecting alternatives."
      },
      {
        id: 11,
        sev: "high",
        title: "GDPR Consent Banner Missing",
        desc: "Cookies and persistent tracker UUIDs are initialized before presenting cookie policy terms.",
        cve: "N/A",
        fix: "Implement a unified Consent Management Platform (CMP) blocking tracking scripts before opt-in."
      }
    ];

    codeSecurity = [
      {
        id: 14,
        sev: "high",
        title: "JavaScript Source Maps Exposed",
        desc: "React Native source map files are available at public endpoint paths, enabling full decompilation.",
        cve: "CWE-540",
        fix: "Remove .map files from final distribution bundles and configure web server access controls."
      },
      {
        id: 15,
        sev: "medium",
        title: "Trivial Deobfuscation Risk",
        desc: "Application bundle lacks symbols name mangling. Reverse-engineering of API endpoints is trivial.",
        cve: "CWE-693",
        fix: "Integrate ProGuard/R8 or commercial packers to scramble class names, parameters, and variable references."
      },
      {
        id: 16,
        sev: "low",
        title: "Anti-Tamper Integrity Checks Absent",
        desc: "No checksum controls or app store receipt verification routines exist to detect side-loaded duplicates.",
        cve: "CWE-354",
        fix: "Add runtime signature verification checks against store metadata during startup."
      }
    ];
  } else if (platform === "Web Application") {
    aiSummary = `Security assessment of Web Application target ${appName} identified ${overallScore < 50 ? "severe" : "moderate"} vulnerabilities in HTTP headers, CORS configurations, and TLS configurations. The web portal exposes sensitive server information headers and allows cross-origin requests from arbitrary wildcards.`;

    recommendations = [
      `Configure strong Content Security Policy (CSP) headers to block XSS and resource injection.`,
      `Enable HTTP Strict Transport Security (HSTS) with preloading.`,
      `Restrict Access-Control-Allow-Origin to authorized domains instead of wildcards.`,
      `Disable directory indexing and strip Server info banners.`
    ];

    permissions = [
      {
        id: 1,
        sev: "medium",
        title: "Browser Geolocation Gating",
        desc: "HTML5 location prompts are requested immediately on page load, causing high user abandonment.",
        cve: "N/A",
        fix: "Defer location prompts until the user explicitly requests geographical lookups."
      },
      {
        id: 2,
        sev: "low",
        title: "Clipboard Access Request",
        desc: "Scripts requesting raw clipboard access triggers found in source scripts.",
        cve: "CWE-272",
        fix: "Use the modern asynchronous Navigator Clipboard API with strict user-gesture gating."
      }
    ];

    network = [
      {
        id: 6,
        sev: "critical",
        title: "Insecure CORS Policy (Wildcard Access)",
        desc: "Access-Control-Allow-Origin header is configured as '*' while supporting credential sharing, leading to potential CSRF.",
        cve: "CWE-942",
        fix: "Explicitly list trusted subdomains and reject wildcard configurations for authenticated paths."
      },
      {
        id: 7,
        sev: "high",
        title: "HTTP Strict Transport Security (HSTS) Disabled",
        desc: "HSTS header is absent, making users vulnerable to SSL stripping and man-in-the-middle attacks.",
        cve: "CWE-523",
        fix: "Configure web server response headers: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload'."
      },
      {
        id: 8,
        sev: "medium",
        title: "TLS 1.0 / 1.1 Support Enabled",
        desc: "The host server accepts TLS 1.0 and 1.1 handshakes, which are deprecated and vulnerable to BEAST/POODLE attacks.",
        cve: "CVE-2014-3566",
        fix: "Update server configuration to disable TLS 1.0/1.1; enforce TLS 1.2 and TLS 1.3 exclusively."
      }
    ];

    privacy = [
      {
        id: 10,
        sev: "high",
        title: "Insecure Session Cookie Configuration",
        desc: "Auth session cookies are missing 'Secure', 'HttpOnly', or 'SameSite=Strict' flags, enabling XSS hijacking.",
        cve: "CWE-1004",
        fix: "Set cookie attributes: 'Set-Cookie: sessionId=...; Secure; HttpOnly; SameSite=Strict'."
      },
      {
        id: 11,
        sev: "medium",
        title: "Referrer Policy Information Leak",
        desc: "Referrer-Policy header is missing or set to unsafe values, exposing private API token URLs to external links.",
        cve: "CWE-200",
        fix: "Set header: 'Referrer-Policy: no-referrer-when-downgrade' or 'strict-origin-when-cross-origin'."
      }
    ];

    codeSecurity = [
      {
        id: 14,
        sev: "critical",
        title: "Content Security Policy (CSP) Header Missing",
        desc: "CSP is not configured, allowing inline script execution and CSS cross-site injection.",
        cve: "CWE-79",
        fix: "Configure a robust CSP header: 'Content-Security-Policy: default-src \'self\'; script-src \'self\' ...'"
      },
      {
        id: 15,
        sev: "high",
        title: "Server Banner Information Disclosure",
        desc: "Server banners ('Server: Apache/2.4.41 (Ubuntu)' and 'X-Powered-By: PHP/7.4') expose operating system and framework patches.",
        cve: "CWE-200",
        fix: "Disable ServerTokens directive in Apache / hide X-Powered-By header in middleware."
      }
    ];
  } else {
    // REST API Endpoint scan
    aiSummary = `API Endpoint Scan of ${appName} revealed critical vulnerabilities. We detected CORS configuration flaws, insecure fallback endpoints, and lack of strict payload schema sanitization. The endpoint is highly susceptible to rate-limiting exhaustion and credential stuffing.`;

    recommendations = [
      `Enforce JWT token signature verification with RS256 algorithm.`,
      `Add strict input schema parsing using Zod to block SQL injection and buffer overflow.`,
      `Configure request throttling (100 requests per minute per IP).`,
      `Validate CORS request origin domains and disable HTTP/1.0 fallbacks.`
    ];

    permissions = [
      {
        id: 1,
        sev: "high",
        title: "Insecure Direct Object Reference (IDOR)",
        desc: "Endpoints accept raw integer IDs in request parameters (/api/users/:id) without validating ownership tokens.",
        cve: "CWE-285",
        fix: "Bind resource lookups to the subject claims inside the verified JWT payload rather than raw parameters."
      },
      {
        id: 2,
        sev: "medium",
        title: "Missing Authentication Gating",
        desc: "Sub-endpoints like /api/v1/metrics do not require active Authorization headers.",
        cve: "CWE-306",
        fix: "Wrap all API routes under authentication validation middleware by default."
      }
    ];

    network = [
      {
        id: 6,
        sev: "critical",
        title: "Sensitive Token Leak in Query Parameters",
        desc: "API routes accept access tokens in GET query string (/api/data?token=...), which are logged in reverse proxy access logs.",
        cve: "CWE-598",
        fix: "Enforce authorization tokens transmission through HTTP Authorization Bearer headers exclusively."
      },
      {
        id: 7,
        sev: "high",
        title: "Lack of API Rate Limiting",
        desc: "Endpoints do not return HTTP 429 rate limit responses when bombarded with parallel requests, exposing it to denial-of-service.",
        cve: "CWE-770",
        fix: "Implement IP and token-based rate limiting (e.g. using redis or express-rate-limit)."
      }
    ];

    privacy = [
      {
        id: 10,
        sev: "high",
        title: "Plaintext API Token Storage",
        desc: "Database models indicate API integration tokens are stored in plain database fields without encryption-at-rest.",
        cve: "CWE-312",
        fix: "Encrypt third-party integration credentials using AES-256-GCM before database write."
      }
    ];

    codeSecurity = [
      {
        id: 14,
        sev: "high",
        title: "Verbose Stack Traces Exposed",
        desc: "Unhandled exceptions write Node/Express stack traces directly into HTTP JSON responses in development environment mode.",
        cve: "CWE-209",
        fix: "Override default Express error handler to return generic messages while writing trace details to secure log files."
      }
    ];
  }

  // Generate Sentiment analysis data
  const totalReviews = randomRange(500, 15000, 2);
  const positivePercent = randomRange(35, 78, 3);
  const negativePercent = randomRange(12, 45, 4);
  const neutralPercent = 100 - positivePercent - negativePercent;
  const fakeReviewPercent = randomRange(10, 52, 5);
  const fraudRiskScore = randomRange(15, 88, 6);
  const sentimentScore = Math.round((positivePercent * 1 + neutralPercent * 0.5));

  const recentReviews = [
    {
      id: 1,
      user: "SecReviewer_" + randomRange(100, 999, 10),
      rating: 1,
      text: "App drains battery in background. Suspicious network transfers registered during standby.",
      sentiment: "negative",
      date: "2026-06-12",
      flag: "⚠️ Fraud Indicator"
    },
    {
      id: 2,
      user: "DevTester_" + randomRange(100, 999, 11),
      rating: 5,
      text: "Extremely reliable tool. UI design is gorgeous and updates are prompt.",
      sentiment: "positive",
      date: "2026-06-25"
    },
    {
      id: 3,
      user: "Analyst_" + randomRange(100, 999, 12),
      rating: 2,
      text: "Too many analytics SDK trackers integrated. It violates GDPR compliance.",
      sentiment: "negative",
      date: "2026-07-02",
      flag: "⚠️ Compliance Risk"
    },
    {
      id: 4,
      user: "NetSec_Guru",
      rating: 4,
      text: "Functional but certificates pinning should be enforced for maximum trust.",
      sentiment: "neutral",
      date: "2026-07-08"
    }
  ];

  const fraudIndicators = [
    {
      type: "Review Text Anomaly",
      risk: fraudRiskScore > 70 ? "high" : "medium",
      desc: `${fakeReviewPercent}% of reviews utilize templated keyword structures typical of automated rating campaigns.`
    },
    {
      type: "Review Timing Spike",
      risk: fraudRiskScore > 60 ? "critical" : "medium",
      desc: "Repetitive rating submission patterns detected during low-traffic periods, pointing to inorganic boosting."
    }
  ];

  return {
    overallScore,
    riskLevel,
    aiSummary,
    recommendations,
    permissions,
    network,
    privacy,
    codeSecurity,
    sentiment: {
      totalReviews,
      positivePercent,
      negativePercent,
      neutralPercent,
      fakeReviewPercent,
      fraudRiskScore,
      sentimentScore,
      recentReviews,
      fraudIndicators
    }
  };
}
