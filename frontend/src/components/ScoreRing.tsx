"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  thick?: number;
}

export function riskColor(score: number): string {
  if (score < 50) return "#f43f5e"; // critical / high danger
  if (score < 75) return "#fbbf24"; // medium warning
  return "#4ade80"; // low risk / secure
}

export function riskLabel(score: number): string {
  if (score < 50) return "HIGH RISK";
  if (score < 75) return "MEDIUM RISK";
  return "LOW RISK";
}

export function ScoreRing({ score, size = 100, thick = 8 }: ScoreRingProps) {
  const r = (size - thick * 2) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = riskColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={thick}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thick}
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}88)`,
            transition: "stroke-dasharray 1.2s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: size * 0.24, color }} className="font-extrabold leading-none">
          {score}
        </span>
        <span style={{ fontSize: size * 0.11 }} className="text-gray-400 font-mono">
          /100
        </span>
      </div>
    </div>
  );
}
