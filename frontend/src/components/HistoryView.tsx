"use client";

import React from "react";
import { History, Shield, Trash2, ArrowRight } from "lucide-react";
import { ScanReport } from "../types";
import { riskColor } from "./ScoreRing";
import { AppIcon } from "./AppIcon";

interface HistoryViewProps {
  history: ScanReport[];
  onSelectScan: (scan: ScanReport) => void;
  onDeleteScan: (id: string) => void;
}

export function HistoryView({ history, onSelectScan, onDeleteScan }: HistoryViewProps) {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Telemetry Storage</span>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <History className="w-6 h-6 text-[#22d3ee]" /> Historical Audit Logs
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Review, analyze, and delete past security scans compiled by the engine.
        </p>
      </div>

      {/* History List */}
      <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827]">
        {history.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-mono text-sm">
            No historical reports found. Go back and run a target scan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-mono text-[10px] tracking-wider uppercase">
                  <th className="py-4 px-3">Target Details</th>
                  <th className="py-4 px-3">Platform</th>
                  <th className="py-4 px-3">Scan Date</th>
                  <th className="py-4 px-3 text-center">Security Score</th>
                  <th className="py-4 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {history.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-gray-950/20 transition-colors group"
                  >
                    <td className="py-4 px-3 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <AppIcon
                          logo={scan.appInfo.logo}
                          name={scan.appInfo.name}
                          bg={scan.appInfo.bg || "#3b82f6"}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate max-w-[180px] sm:max-w-[280px]">
                            {scan.appInfo.name}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[180px] sm:max-w-[280px] font-mono">
                            {scan.url}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-gray-400 text-xs font-mono">{scan.appInfo.platform}</td>
                    <td className="py-4 px-3 text-gray-400 text-xs font-mono">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-3 text-center font-black text-base" style={{ color: riskColor(scan.overallScore) }}>
                      {scan.overallScore}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onSelectScan(scan)}
                          className="px-3 py-1.5 rounded-lg border border-gray-800 hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/5 text-gray-300 hover:text-[#22d3ee] font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          View Report <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteScan(scan.id)}
                          className="p-2 rounded-lg border border-gray-800 hover:border-red-950 hover:bg-red-950/20 text-gray-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
