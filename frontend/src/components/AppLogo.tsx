"use client";

import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
}

export function AppLogo({ className = "", size = 24 }: AppLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`drop-shadow-[0_0_8px_rgba(34,211,238,0.2)] ${className}`}
    >
      {/* Outer shield structure */}
      <path
        d="M12 2L3 6.5v5.8c0 5.6 3.8 10.2 9 11.7 5.2-1.5 9-6.1 9-11.7V6.5L12 2z"
        stroke="url(#logo-grad)"
        strokeWidth="1.75"
        fill="url(#logo-bg)"
      />
      {/* Radar scanner ring representing target analysis */}
      <circle cx="12" cy="12" r="3.2" stroke="url(#logo-grad)" strokeWidth="1.25" fill="#0b0f19" />
      <circle cx="12" cy="12" r="0.75" fill="#22d3ee" />
      
      {/* Target Crosshairs */}
      <path d="M12 6.5v2.3M12 15.2v2.3M6.5 12h2.3M15.2 12h2.3" stroke="#22d3ee" strokeWidth="1.25" />
      
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.04)" />
          <stop offset="100%" stopColor="rgba(79, 70, 229, 0.12)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
