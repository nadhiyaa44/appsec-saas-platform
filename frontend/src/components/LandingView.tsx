"use client";

import React from "react";
import { Shield, Lock, Globe, Eye, Code, ArrowRight } from "lucide-react";
import { User } from "../types";
import { AppLogo } from "./AppLogo";

interface LandingViewProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

export function LandingView({ user, onNavigate }: LandingViewProps) {
  const features = [
    { Icon: Lock, color: "#f43f5e", t: "Permissions Audit", d: "Detect over-privileged access requests, background data collection, and manifest violations." },
    { Icon: Globe, color: "#f97316", t: "Network & API Security", d: "Expose unencrypted endpoints, insecure TLS, token leakage, and unauthorized data processors." },
    { Icon: Eye, color: "#22d3ee", t: "Privacy Intelligence", d: "Identify GDPR violations, behavioral fingerprinting, consent gaps, and ad SDK data sharing." },
    { Icon: Code, color: "#4ade80", t: "Code Security", d: "Evaluate source exposure, deobfuscation difficulty, anti-tamper measures, and debug leakage." },
  ];

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-62px)] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-15 pointer-events-none" />
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-[#22d3ee]/5 rounded-full filter blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#f97316]/5 rounded-full filter blur-[70px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-xs font-mono tracking-widest uppercase mb-8">
            <AppLogo size={16} /> Security Intelligence Platform v3.0
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
            Know Every Threat <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22d3ee] to-[#f97316]">
              Before It Strikes
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Deep-scan and audit Google Play, iOS, Web applications, and REST API endpoints for vulnerabilities, privacy leaks, and compliance violations — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate(user ? "dashboard" : "auth")}
              className="shimmer-btn text-black font-extrabold text-base px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Start Free Scan <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="px-8 py-4 rounded-xl border border-gray-700 text-[#f1f5f9] font-bold text-sm bg-gray-900/30 hover:border-gray-500 transition-colors"
            >
              Learn More
            </button>
          </div>

          <div className="flex gap-12 justify-center mt-16 flex-wrap">
            {[
              ["120K+", "Threat Scans"],
              ["99.8%", "Detection Accuracy"],
              ["< 10s", "AI Execution Time"],
            ].map(([n, l]) => (
              <div key={n} className="text-center">
                <div className="text-3xl font-extrabold text-[#22d3ee] mb-1">{n}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-[5%] top-[25%] opacity-5 pointer-events-none animate-float">
          <AppLogo size={384} />
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 px-6 bg-[#0f172a]/30 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Four Pillars of <span className="text-[#22d3ee]">Security Analysis</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-base">
              Comprehensive compliance audits and security scanning covering every digital attack surface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.t}
                className="p-6 rounded-2xl border border-gray-800 bg-[#111827]/50 hover:border-gray-700 hover:-translate-y-1 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: `${f.color}15`,
                    border: `1px solid ${f.color}40`,
                  }}
                >
                  <f.Icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-[#f1f5f9]">{f.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 bg-[#030712]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#22d3ee]" />
          <span className="font-extrabold text-white">
            App<span className="text-[#22d3ee]">Sec</span>
          </span>
          <span>© 2026</span>
        </div>
        <div className="flex gap-6">
          {["about", "contact"].map((k) => (
            <button
              key={k}
              onClick={() => onNavigate(k)}
              className="hover:text-white capitalize transition-colors cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
