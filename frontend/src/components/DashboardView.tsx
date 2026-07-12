"use client";

import React, { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { Search, ShieldAlert, Activity, Calendar, History, Shield } from "lucide-react";
import { DashboardStats, ScanReport, User } from "../types";
import { riskColor } from "./ScoreRing";
import { AppIcon } from "./AppIcon";

interface DashboardViewProps {
  user: User | null;
  stats: DashboardStats;
  history: ScanReport[];
  onRunScan: (url: string) => void;
  onSelectScan: (scan: ScanReport) => void;
}

export function DashboardView({ user, stats, history, onRunScan, onSelectScan }: DashboardViewProps) {
  const [urlInput, setUrlInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalScans = stats.totalScans;
  const highRisk = stats.highRiskScans;
  const avgScore = stats.avgScore;
  const lastScanDate = history.length ? new Date(history[0].timestamp).toLocaleDateString() : "None";

  // Chart data compilation
  const latestScan = history[0];
  const radarData = latestScan
    ? [
        { cat: "Permissions", value: latestScan.categories.permissions.score },
        { cat: "Network", value: latestScan.categories.network.score },
        { cat: "Privacy", value: latestScan.categories.privacy.score },
        { cat: "Code", value: latestScan.categories.obfuscation.score },
      ]
    : [
        { cat: "Permissions", value: 0 },
        { cat: "Network", value: 0 },
        { cat: "Privacy", value: 0 },
        { cat: "Code", value: 0 },
      ];

  // Past scans scores
  const barData = stats.history.slice(0, 8).reverse().map((h) => ({
    name: h.name.substring(0, 10),
    score: h.score,
  }));

  // Findings severity ratios
  const severityCounts = latestScan
    ? Object.values(latestScan.categories)
        .flatMap((cat) => cat.findings)
        .reduce((acc: { [key: string]: number }, finding) => {
          acc[finding.sev] = (acc[finding.sev] || 0) + 1;
          return acc;
        }, {})
    : {};

  const pieData = Object.entries(severityCounts).map(([key, val]) => ({
    name: key.toUpperCase(),
    value: val,
  }));

  const pieColors: { [key: string]: string } = {
    CRITICAL: "#f43f5e",
    HIGH: "#f97316",
    MEDIUM: "#fbbf24",
    LOW: "#4ade80",
    INFO: "#22d3ee",
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onRunScan(urlInput.trim());
      setUrlInput("");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Welcome back, {user?.name.split(" ")[0]}</h1>
          <p className="text-gray-400 text-sm">Real-time threat intelligence and vulnerability analysis dashboard.</p>
        </div>
      </div>

      {/* Top telemetry metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Scans Run", val: totalScans, Icon: Search, color: "#22d3ee" },
          { label: "High Risk Flags", val: highRisk, Icon: ShieldAlert, color: "#f43f5e" },
          { label: "Average Security Score", val: avgScore || "—", Icon: Activity, color: "#fbbf24" },
          { label: "Last Scan Executed", val: lastScanDate, Icon: Calendar, color: "#f97316" },
        ].map((s) => (
          <div key={s.label} className="p-6 rounded-2xl border border-gray-800 bg-[#111827]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-xs font-semibold">{s.label}</span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${s.color}15` }}
              >
                <s.Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Recharts visualizations */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart */}
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] flex flex-col justify-between">
            <h3 className="font-extrabold text-[#f1f5f9] text-sm mb-4">Vulnerability Vector Profile</h3>
            {latestScan ? (
              <div className="w-full h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="cat" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-500 text-sm font-mono">
                No active metrics. Perform a scan first.
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] flex flex-col justify-between">
            <h3 className="font-extrabold text-[#f1f5f9] text-sm mb-4">Telemetry Score History</h3>
            {barData.length > 0 ? (
              <div className="w-full h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#1e3a5f", color: "#f1f5f9", borderRadius: 8 }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {barData.map((e, idx) => (
                        <Cell key={idx} fill={riskColor(e.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-500 text-sm font-mono">
                No scan history.
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] flex flex-col justify-between">
            <h3 className="font-extrabold text-[#f1f5f9] text-sm mb-4">Finding Severity Split</h3>
            {pieData.length > 0 ? (
              <div className="w-full h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={{ stroke: "#64748b", strokeWidth: 0.5 }}
                    >
                      {pieData.map((e, idx) => (
                        <Cell key={idx} fill={pieColors[e.name] || "#64748b"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#1e3a5f", color: "#f1f5f9", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-500 text-sm font-mono">
                No active vulnerabilities reported.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Target input and history table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Scan Input */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[#f1f5f9] text-base mb-2">Initiate Target Audit</h3>
            <p className="text-gray-400 text-xs mb-6">
              Supported targets: Google Play Store link, iOS App Store link, Web Application URL, or REST API Endpoint.
            </p>
          </div>
          <form onSubmit={handleScanSubmit} className="space-y-4">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste Target URL (e.g. play.google.com/... or x.com)"
              className="w-full bg-[#1e293b] border border-gray-800 rounded-xl px-4 py-3 text-sm text-[#f1f5f9] focus:border-[#22d3ee] outline-none transition-colors"
            />
            <button
              type="submit"
              className="w-full shimmer-btn text-black font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" /> Run AI Security Analysis
            </button>
          </form>
        </div>

        {/* Recent Scan History */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-800 bg-[#111827]">
          <h3 className="font-extrabold text-[#f1f5f9] text-base mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-[#22d3ee]" /> Recent Threat Reports
          </h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm font-mono py-8 text-center">No scans run yet.</p>
            ) : (
              history.slice(0, 5).map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => onSelectScan(scan)}
                  className="flex items-center justify-between p-3 border border-gray-900 hover:border-gray-700 bg-gray-950/20 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AppIcon
                      logo={scan.appInfo.logo}
                      name={scan.appInfo.name}
                      bg={scan.appInfo.bg || "#3b82f6"}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{scan.appInfo.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {scan.appInfo.platform} • {new Date(scan.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="font-black text-sm pl-4" style={{ color: riskColor(scan.overallScore) }}>
                    {scan.overallScore}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
