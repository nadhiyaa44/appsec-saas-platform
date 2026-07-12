"use client";

import React from "react";
import { User as UserIcon, Shield, CreditCard, Calendar } from "lucide-react";
import { User } from "../types";

interface AccountViewProps {
  user: User | null;
}

export function AccountView({ user }: AccountViewProps) {
  if (!user) return null;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">User profile</span>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-[#22d3ee]" /> Account Command Center
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Review subscription telemetry and credential authentication parameters.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-8 rounded-2xl border border-gray-800 bg-[#111827] space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#f97316] text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-[#22d3ee]/10">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-none">{user.name}</h3>
            <span className="text-sm text-gray-400 font-mono mt-2 block">{user.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-800 pt-6">
          <div className="p-4 rounded-xl border border-gray-900 bg-gray-950/20 flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#22d3ee]" />
            <div>
              <div className="text-[10px] text-gray-500 font-mono uppercase">Access Role</div>
              <div className="text-sm font-bold text-white">{user.role} Developer</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-900 bg-gray-950/20 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#f97316]" />
            <div>
              <div className="text-[10px] text-gray-500 font-mono uppercase">User Since</div>
              <div className="text-sm font-bold text-white">
                {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Licensing Banner */}
      <div className="p-6 rounded-2xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 flex gap-4 items-start">
        <CreditCard className="w-6 h-6 text-[#fbbf24] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-white">License Billing Status</h4>
          <p className="text-gray-400 text-xs leading-relaxed font-sans">
            You are currently on a <span className="text-[#fbbf24] font-bold">{user.role}</span> plan. Your credentials grant you unlimited static analysis checks and up to 50 detailed AI scans per month.
          </p>
        </div>
      </div>
    </div>
  );
}
