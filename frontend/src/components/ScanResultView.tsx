"use client";

import React, { useState } from "react";
import { Shield, Eye, Network, FileCode, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { ScanReport } from "../types";
import { ScoreRing, riskLabel, riskColor } from "./ScoreRing";
import { SevBadge } from "./SevBadge";
import { AppIcon } from "./AppIcon";

interface ScanResultViewProps {
  scan: ScanReport;
  onNavigateBack: () => void;
}

export function ScanResultView({ scan, onNavigateBack }: ScanResultViewProps) {
  const [activeCategory, setActiveCategory] = useState<"permissions" | "network" | "privacy" | "obfuscation">("permissions");
  const [selectedFindingId, setSelectedFindingId] = useState<number | null>(null);

  const categories = {
    permissions: {
      key: "permissions",
      label: "Permissions",
      Icon: Shield,
      data: scan.categories.permissions,
    },
    network: {
      key: "network",
      label: "Network / API",
      Icon: Network,
      data: scan.categories.network,
    },
    privacy: {
      key: "privacy",
      label: "Privacy Audit",
      Icon: Eye,
      data: scan.categories.privacy,
    },
    obfuscation: {
      key: "obfuscation",
      label: "Code Security",
      Icon: FileCode,
      data: scan.categories.obfuscation,
    },
  } as const;

  const currentCategory = categories[activeCategory];
  const findingsList = currentCategory.data.findings;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onNavigateBack}
          className="p-2.5 rounded-xl border border-gray-800 hover:border-gray-600 bg-gray-900/30 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Scan Telemetry Report</span>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <AppIcon
              logo={scan.appInfo.logo}
              name={scan.appInfo.name}
              bg={scan.appInfo.bg}
            />
            {scan.appInfo.name}
          </h1>
        </div>
      </div>

      {/* Main Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-gray-800 bg-[#111827]">
        <div className="flex items-center gap-6">
          <ScoreRing score={scan.overallScore} size={110} />
          <div>
            <div className="text-xs text-gray-500 font-mono tracking-wider">THREAT VERDICT</div>
            <div className="text-lg font-black mt-1" style={{ color: riskColor(scan.overallScore) }}>
              {riskLabel(scan.overallScore)}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
              Scanned: {new Date(scan.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-6">
          <h4 className="text-xs text-gray-500 font-mono tracking-wider mb-2">AI THREAT SUMMATION</h4>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">{scan.aiSummary}</p>
        </div>
      </div>

      {/* Categories Tabs & Findings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category navigation sidebar */}
        <div className="flex overflow-x-auto gap-2 pb-3 lg:flex-col lg:space-y-2 lg:overflow-x-visible lg:pb-0 scrollbar-none">
          {Object.values(categories).map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key as any);
                  setSelectedFindingId(null);
                }}
                className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-4 p-3.5 lg:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#22d3ee]/10 border-[#22d3ee]/40 text-[#22d3ee]"
                    : "bg-[#111827] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <cat.Icon className="w-5 h-5" />
                  <span className="text-sm font-bold">{cat.label}</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? "bg-[#22d3ee]/20 text-[#22d3ee]" : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {cat.data.score}
                </span>
              </button>
            );
          })}
        </div>

        {/* Findings Listings & Detail Remediations */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827]">
            <h3 className="text-base font-extrabold text-white mb-4 flex items-center justify-between">
              <span>{currentCategory.label} Audit Log</span>
              <span className="text-xs text-gray-500 font-mono">
                {findingsList.length} Vector{findingsList.length !== 1 ? "s" : ""} Checked
              </span>
            </h3>

            <div className="space-y-3">
              {findingsList.map((finding) => {
                const isSelected = selectedFindingId === finding.id;
                return (
                  <div
                    key={finding.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isSelected
                        ? "border-[#1e3a5f] bg-[#0f172a]"
                        : "border-gray-900 bg-gray-950/20 hover:border-gray-800"
                    }`}
                  >
                    {/* Header bar */}
                    <div
                      onClick={() => setSelectedFindingId(isSelected ? null : finding.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SevBadge sev={finding.sev} />
                        <span className="text-sm font-bold text-white truncate">{finding.title}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {finding.cve !== "N/A" && (
                          <span className="text-[10px] font-mono bg-red-950/40 text-red-400 border border-red-950 px-2 py-0.5 rounded font-bold">
                            {finding.cve}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono select-none">
                          {isSelected ? "Collapse ▲" : "Expand ▼"}
                        </span>
                      </div>
                    </div>

                    {/* Details content */}
                    {isSelected && (
                      <div className="p-5 border-t border-gray-900 bg-gray-950/40 text-gray-300 text-sm space-y-4">
                        <div>
                          <div className="text-gray-500 text-[10px] font-mono tracking-wider uppercase mb-1">
                            THREAT SCENARIO
                          </div>
                          <p className="leading-relaxed font-sans">{finding.desc}</p>
                        </div>

                        <div>
                          <div className="text-gray-500 text-[10px] font-mono tracking-wider uppercase mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-[#4ade80]" /> COMPLIANCE MITIGATION
                          </div>
                          <div className="p-4 rounded-xl border border-gray-900 bg-black/60 font-mono text-[11px] text-[#4ade80] leading-relaxed whitespace-pre-wrap">
                            {finding.fix}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Recommendations Checklist */}
          {scan.recommendations.length > 0 && (
            <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#22d3ee]" /> General Remediation Checklist
              </h3>
              <div className="space-y-3 font-sans">
                {scan.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-gray-950/20 border border-gray-900 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-300 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
