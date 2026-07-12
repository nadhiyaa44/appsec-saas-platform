"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";

interface AppIconProps {
  logo: string | null;
  name: string;
  bg?: string;
  size?: "sm" | "md";
}

export function AppIcon({ logo, name, bg = "#334155", size = "md" }: AppIconProps) {
  const [error, setError] = useState(false);
  
  const containerClasses = size === "sm" 
    ? "w-7 h-7 text-xs rounded-md" 
    : "w-8 h-8 text-sm rounded-lg";
    
  const imgClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div
      className={`${containerClasses} flex items-center justify-center font-black text-white flex-shrink-0 select-none`}
      style={{ backgroundColor: bg }}
    >
      {logo && !error ? (
        <img
          src={logo}
          alt={name}
          className={`${imgClasses} object-contain`}
          onError={() => setError(true)}
        />
      ) : (
        name ? (
          <span>{name[0].toUpperCase()}</span>
        ) : (
          <Globe className={imgClasses} />
        )
      )}
    </div>
  );
}
