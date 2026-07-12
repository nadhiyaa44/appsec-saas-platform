"use client";

import React, { useState, useEffect } from "react";
import { Shield, Sun, Moon, LogOut, LayoutDashboard, MessageSquare, History, User as UserIcon } from "lucide-react";

// Views
import { LandingView } from "../components/LandingView";
import { AuthView } from "../components/AuthView";
import { DashboardView } from "../components/DashboardView";
import { ScanResultView } from "../components/ScanResultView";
import { SentimentView } from "../components/SentimentView";
import { HistoryView } from "../components/HistoryView";
import { AccountView } from "../components/AccountView";
import { AppLogo } from "../components/AppLogo";

// Utility Components
import { Toast } from "../components/Toast";
import { api } from "../services/api";
import type { DashboardStats, ScanReport, User } from "../types";

export default function Home() {
  const [page, setPage] = useState<string>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [dark, setDark] = useState<boolean>(true);

  // States
  const [history, setHistory] = useState<ScanReport[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    highRiskScans: 0,
    avgScore: 0,
    history: [],
  });

  const [activeScan, setActiveScan] = useState<ScanReport | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Progress Scanner Simulation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLabel, setScanLabel] = useState<string>("");

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("appsec_token");
    if (token) {
      api
        .getMe()
        .then((resUser) => {
          setUser(resUser);
          setPage("dashboard");
          refreshTelemetry();
        })
        .catch(() => {
          localStorage.removeItem("appsec_token");
          setUser(null);
        });
    }
  }, []);

  // Theme Sync
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (dark) {
        root.classList.remove("light-theme");
      } else {
        root.classList.add("light-theme");
      }
    }
  }, [dark]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const refreshTelemetry = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        api.getHistory(),
        api.getDashboardStats(),
      ]);
      setHistory(historyData);
      setStats(statsData);
    } catch (err: any) {
      console.warn("Failed to fetch dashboard stats:", err.message);
    }
  };

  const handleAuthSuccess = (resUser: User, token: string) => {
    localStorage.setItem("appsec_token", token);
    setUser(resUser);
    setPage("dashboard");
    refreshTelemetry();
    showToast(`Session authenticated successfully. Welcome ${resUser.name}!`, "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("appsec_token");
    setUser(null);
    setPage("landing");
    showToast("Session disconnected. Secure logout verified.", "success");
  };

  // Run Scan Orchestration
  const handleExecuteScan = async (url: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLabel("Resolving target & DNS fingerprint...");

    // Progressive animation timeline
    const steps = [
      { label: "Parsing App Store manifest and metadata...", target: 20 },
      { label: "Scanning declared third-party SDK permissions...", target: 40 },
      { label: "Probing network fallback endpoints & TLS...", target: 60 },
      { label: "Evaluating code obfuscation anti-tamper profiles...", target: 80 },
      { label: "Executing NLP sentiment mining on reviews...", target: 95 },
      { label: "Compiling Threat Intelligence report...", target: 100 },
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        const step = steps[currentStep];
        if (prev >= step.target) {
          if (currentStep < steps.length - 1) {
            currentStep++;
            setScanLabel(steps[currentStep].label);
          } else {
            clearInterval(progressInterval);
          }
        }
        return prev + 1;
      });
    }, 50);

      api
        .runScan(url)
        .then((report) => {
          clearInterval(progressInterval);
          setScanProgress(100);
          setScanLabel("Scan complete. Threat report registered.");
          setTimeout(() => {
            setIsScanning(false);
            setActiveScan(report);
            setPage("result");
            refreshTelemetry();
            showToast("Vulnerability audit compiled successfully.", "success");
          }, 600);
        })
        .catch((err: any) => {
          clearInterval(progressInterval);
          setIsScanning(false);
          showToast(err.message || "Failed to execute vulnerability scan.", "error");
        });
  };

  const handleDeleteScan = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this scan report?")) {
      try {
        await api.deleteScan(id);
        showToast("Report deleted successfully from secure storage.", "success");
        refreshTelemetry();
      } catch (err: any) {
        showToast(err.message || "Failed to delete report.", "error");
      }
    }
  };

  const handleSelectScan = (scan: ScanReport) => {
    setActiveScan(scan);
    setPage("result");
  };

  // Navigations Links
  const links = user
    ? [
        { key: "dashboard", label: "Dashboard" },
        { key: "sentiment", label: "Sentiment" },
        { key: "history", label: "History" },
        { key: "account", label: "Profile" },
      ]
    : [
        { key: "landing", label: "Home" },
        { key: "about", label: "About" },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] h-[62px] flex items-center justify-between px-6 md:px-10">
        <button
          onClick={() => setPage(user ? "dashboard" : "landing")}
          className="flex items-center gap-2.5 text-[var(--text)] bg-transparent border-0 cursor-pointer"
        >
          <AppLogo size={36} />
          <span className="font-extrabold text-lg tracking-tight">
            App<span className="text-[#22d3ee]">Sec</span>
          </span>
        </button>

        <div className="flex gap-2 items-center">
          <div className="hidden md:flex gap-2 items-center">
            {links.map((link) => (
              <button
                key={link.key}
                onClick={() => setPage(link.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  page === link.key
                    ? "bg-[#22d3ee]/10 border-[#22d3ee]/30 text-[#22d3ee]"
                    : "bg-transparent border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setDark((prev) => !prev)}
            className="w-9 h-9 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors ml-2"
          >
            {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 ml-2 border-l border-[var(--border)] pl-4">
              <button
                onClick={() => setPage("account")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-gray-500 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#f97316] text-black text-[10px] font-black flex items-center justify-center">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold hidden sm:inline">{user.name.split(" ")[0]}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-white flex items-center justify-center cursor-pointer hover:border-red-950 transition-colors"
                title="Secure Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            page !== "auth" && (
              <button
                onClick={() => setPage("auth")}
                className="ml-3 px-5 py-2 text-xs font-black rounded-lg bg-[#22d3ee] text-black hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </nav>

      {/* Main View Router */}
      <main className={`flex-grow flex flex-col justify-start ${user ? "pb-20 md:pb-0" : ""}`}>
        {isScanning ? (
          <div className="flex-grow flex items-center justify-center p-12 animate-fade-in">
            <div className="text-center max-w-sm w-full space-y-6">
              <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-[#22d3ee] border-t-transparent rounded-full animate-spin shadow-md shadow-[#22d3ee]/20" />
                <div className="absolute inset-2 border-4 border-[#f97316] border-b-transparent rounded-full animate-spin-reverse" />
                <Shield className="w-6 h-6 text-[#22d3ee] animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold text-[#22d3ee] uppercase tracking-wider h-6 overflow-hidden">
                  {scanLabel}
                </h3>
                <div className="w-full h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#22d3ee] to-[#f97316] rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-500 font-mono">{scanProgress}% completed</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {page === "landing" && <LandingView user={user} onNavigate={setPage} />}
            {page === "auth" && <AuthView onAuthSuccess={handleAuthSuccess} onNavigate={setPage} />}
            {page === "dashboard" && (
              <DashboardView
                user={user}
                stats={stats}
                history={history}
                onRunScan={handleExecuteScan}
                onSelectScan={handleSelectScan}
              />
            )}
            {page === "result" && activeScan && (
              <ScanResultView scan={activeScan} onNavigateBack={() => setPage("dashboard")} />
            )}
            {page === "sentiment" && <SentimentView scan={activeScan || (history.length ? history[0] : null)} />}
            {page === "history" && (
              <HistoryView history={history} onSelectScan={handleSelectScan} onDeleteScan={handleDeleteScan} />
            )}
            {page === "account" && <AccountView user={user} />}

            {/* About & Contact fallbacks */}
            {(page === "about" || page === "contact") && (
              <div className="p-10 max-w-2xl mx-auto space-y-6 animate-fade-in">
                <h1 className="text-3xl font-black text-white capitalize">{page} Information</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                  AppSec SaaS Platform is a comprehensive static-telemetry scanner auditing framework, designed to assess package signatures, manifest declarations, privacy profiles, TLS endpoints, and sentiment manipulation patterns.
                </p>
                {page === "contact" ? (
                  <p className="text-[#22d3ee] text-sm font-mono">Support command: support@appsec-saas.io</p>
                ) : (
                  <p className="text-gray-400 text-sm">Engine Version: v3.1.2-beta</p>
                )}
                <button
                  onClick={() => setPage(user ? "dashboard" : "landing")}
                  className="px-6 py-2.5 rounded-lg border border-gray-800 text-white font-bold text-xs hover:border-gray-500 transition-all cursor-pointer"
                >
                  Return
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-45 bg-[#0b0f19]/95 backdrop-blur-md border-t border-gray-900 h-[64px] flex items-center justify-around px-4 pb-safe shadow-2xl">
          {links.map((link) => {
            let Icon = LayoutDashboard;
            if (link.key === "sentiment") Icon = MessageSquare;
            if (link.key === "history") Icon = History;
            if (link.key === "account") Icon = UserIcon;
            const isActive = page === link.key;
            return (
              <button
                key={link.key}
                onClick={() => setPage(link.key)}
                className={`flex flex-col items-center gap-1 bg-transparent border-0 cursor-pointer py-1 ${
                  isActive ? "text-[#22d3ee]" : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold tracking-tight">{link.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Global Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
