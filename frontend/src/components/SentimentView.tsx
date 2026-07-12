"use client";

import React, { useState } from "react";
import { MessageSquare, AlertTriangle, ShieldCheck, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { ScanReport } from "../types";

interface SentimentViewProps {
  scan: ScanReport | null;
}

export function SentimentView({ scan }: SentimentViewProps) {
  if (!scan || !scan.sentiment) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-center border border-gray-800 bg-[#111827] rounded-2xl animate-fade-in">
        <MessageSquare className="w-16 h-16 text-[#22d3ee] mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-extrabold text-white mb-2">No Review Sentiment Diagnostics</h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Please run a target scan or select a historical threat report containing review indexes first.
        </p>
      </div>
    );
  }

  const { sentiment } = scan;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Sentiment Telemetry</span>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          App Reviews & Sentiment Analysis
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Deep NLP analytics parsing review patterns, inorganic spikes, and fraud risk indices.
        </p>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Index */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] text-center flex flex-col justify-between">
          <div className="text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-4">
            SENTIMENT MATCH INDEX
          </div>
          <div className="my-2">
            <span
              className="text-5xl font-black"
              style={{
                color: sentiment.sentimentScore > 70 ? "#4ade80" : sentiment.sentimentScore > 40 ? "#fbbf24" : "#f43f5e",
              }}
            >
              {sentiment.sentimentScore}%
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-4 leading-relaxed font-sans">
            Positive & Neutral sentiment ratio calculated across {sentiment.totalReviews.toLocaleString()} reviews.
          </div>
        </div>

        {/* Fake Review Ratio */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] text-center flex flex-col justify-between">
          <div className="text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-4">
            FAKE REVIEW DENSITY
          </div>
          <div className="my-2">
            <span
              className="text-5xl font-black"
              style={{
                color: sentiment.fakeReviewPercent < 25 ? "#4ade80" : sentiment.fakeReviewPercent < 45 ? "#fbbf24" : "#f43f5e",
              }}
            >
              {sentiment.fakeReviewPercent}%
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-4 leading-relaxed font-sans">
            Percentage of reviews matching bot profiles, keyword manipulation, or suspicious accounts.
          </div>
        </div>

        {/* Fraud Risk Score */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827] text-center flex flex-col justify-between">
          <div className="text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-4">
            FRAUD RISK INDEX
          </div>
          <div className="my-2">
            <span
              className="text-5xl font-black"
              style={{
                color: sentiment.fraudRiskScore < 35 ? "#4ade80" : sentiment.fraudRiskScore < 65 ? "#fbbf24" : "#f43f5e",
              }}
            >
              {sentiment.fraudRiskScore}/100
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-4 leading-relaxed font-sans">
            Composite score measuring abnormal rating spikes and manipulative ranking campaigns.
          </div>
        </div>
      </div>

      {/* Ratios and Fraud Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sentiments Ratios */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-800 bg-[#111827] space-y-6">
          <h3 className="text-sm font-extrabold text-white">Sentiment Distribution</h3>

          <div className="space-y-4">
            {[
              { label: "Positive Reviews", val: sentiment.positivePercent, Icon: ThumbsUp, color: "#4ade80" },
              { label: "Neutral Reviews", val: sentiment.neutralPercent, Icon: Heart, color: "#64748b" },
              { label: "Negative Reviews", val: sentiment.negativePercent, Icon: ThumbsDown, color: "#f43f5e" },
            ].map((r) => (
              <div key={r.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <r.Icon className="w-3.5 h-3.5" style={{ color: r.color }} /> {r.label}
                  </span>
                  <span className="font-bold text-white">{r.val}%</span>
                </div>
                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.val}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="lg:col-span-3 p-6 rounded-2xl border border-gray-800 bg-[#111827] space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#fbbf24]" /> Review Anomaly Log
          </h3>

          <div className="space-y-3">
            {sentiment.fraudIndicators.map((ind, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-900 bg-gray-950/20 flex items-start gap-3.5"
              >
                <div
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 uppercase`}
                  style={{
                    backgroundColor: ind.risk === "high" || ind.risk === "critical" ? "rgba(244,63,94,0.12)" : "rgba(251,191,36,0.12)",
                    color: ind.risk === "high" || ind.risk === "critical" ? "#f43f5e" : "#fbbf24",
                    border: `1px solid ${ind.risk === "high" || ind.risk === "critical" ? "rgba(244,63,94,0.3)" : "rgba(251,191,36,0.3)"}`,
                  }}
                >
                  {ind.risk}
                </div>
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">{ind.type}</div>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review list stream */}
      <div className="p-6 rounded-2xl border border-gray-800 bg-[#111827]">
        <h3 className="text-sm font-extrabold text-white mb-4">Sample Threat Logs From Review Feed</h3>
        <div className="space-y-4">
          {sentiment.recentReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 border border-gray-900 bg-gray-950/10 rounded-xl flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{rev.user}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{rev.date}</span>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-sans">"{rev.text}"</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 md:self-center">
                {rev.flag && (
                  <span className="text-[9px] font-mono font-bold uppercase text-[#f43f5e] bg-[#f43f5e]/15 border border-[#f43f5e]/30 px-2 py-0.5 rounded">
                    {rev.flag}
                  </span>
                )}
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: rev.sentiment === "positive" ? "rgba(74,222,128,0.1)" : rev.sentiment === "negative" ? "rgba(244,63,94,0.1)" : "rgba(100,116,139,0.1)",
                    color: rev.sentiment === "positive" ? "#4ade80" : rev.sentiment === "negative" ? "#f43f5e" : "#94a3b8",
                  }}
                >
                  {rev.sentiment.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
