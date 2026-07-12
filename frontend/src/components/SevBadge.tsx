import React from "react";

interface SevBadgeProps {
  sev: "critical" | "high" | "medium" | "low" | "info";
}

export function SevBadge({ sev }: SevBadgeProps) {
  const badgeMap = {
    critical: {
      bg: "rgba(244, 63, 94, 0.12)",
      border: "rgba(244, 63, 94, 0.35)",
      color: "#f43f5e",
      label: "CRITICAL",
    },
    high: {
      bg: "rgba(249, 115, 22, 0.12)",
      border: "rgba(249, 115, 22, 0.35)",
      color: "#f97316",
      label: "HIGH",
    },
    medium: {
      bg: "rgba(251, 191, 36, 0.12)",
      border: "rgba(251, 191, 36, 0.35)",
      color: "#fbbf24",
      label: "MEDIUM",
    },
    low: {
      bg: "rgba(74, 222, 128, 0.12)",
      border: "rgba(74, 222, 128, 0.35)",
      color: "#4ade80",
      label: "LOW",
    },
    info: {
      bg: "rgba(34, 211, 238, 0.12)",
      border: "rgba(34, 211, 238, 0.35)",
      color: "#22d3ee",
      label: "INFO",
    },
  };

  const current = badgeMap[sev] || badgeMap.info;

  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border whitespace-nowrap"
      style={{
        backgroundColor: current.bg,
        borderColor: current.border,
        color: current.color,
      }}
    >
      {current.label}
    </span>
  );
}
