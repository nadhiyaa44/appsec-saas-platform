"use client";

import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { api } from "../services/api";
import { User } from "../types";
import { AppLogo } from "./AppLogo";

interface AuthViewProps {
  onAuthSuccess: (user: User, token: string) => void;
  onNavigate: (page: string) => void;
}

export function AuthView({ onAuthSuccess, onNavigate }: AuthViewProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backendSpinning, setBackendSpinning] = useState(false);

  useEffect(() => {
    let active = true;
    let timer: any;

    const checkHealth = async () => {
      // Show warming message if the server doesn't respond quickly (Render Free Tier sleeping)
      timer = setTimeout(() => {
        if (active) setBackendSpinning(true);
      }, 1200);

      try {
        await api.getHealth();
        clearTimeout(timer);
        if (active) setBackendSpinning(false);
      } catch (e) {
        clearTimeout(timer);
        if (active) {
          timer = setTimeout(checkHealth, 4000);
        }
      }
    };

    checkHealth();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (tab === "register") {
        if (!name || !email || !password) {
          throw new Error("All fields are required");
        }
        const data = await api.register(name, email, password);
        onAuthSuccess(data.user, data.token);
      } else {
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        const data = await api.login(email, password);
        onAuthSuccess(data.user, data.token);
      }
    } catch (error: any) {
      setErr(error.message || "Authentication process failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api.login("demo@appsec.io", "demo123");
      onAuthSuccess(data.user, data.token);
    } catch (error: any) {
      setErr(error.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="w-full max-w-md animate-fade-up z-10">
        <div className="text-center mb-10">
          <AppLogo size={64} className="mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white">
            App<span className="text-[#22d3ee]">Sec</span> Command Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">Access threat intelligence telemetry</p>
        </div>

        <div className="flex bg-[#111827] rounded-xl p-1 mb-6 border border-gray-800">
          <button
            onClick={() => {
              setTab("login");
              setErr("");
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              tab === "login" ? "bg-[#22d3ee] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab("register");
              setErr("");
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              tab === "register" ? "bg-[#22d3ee] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">
          {backendSpinning && (
            <div className="mb-6 p-4 rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 flex flex-col gap-2.5 text-xs text-[#fbbf24] animate-pulse">
              <div className="flex items-center gap-2 font-black uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Backend spin-up in progress</span>
              </div>
              <p className="text-gray-400 font-sans leading-relaxed">
                The free-tier backend server goes to sleep after 15 minutes of inactivity. We are spinning it up now. This takes about 45 seconds — please wait.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {tab === "register" && (
              <div>
                <label className="block text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-[#1e293b] border border-gray-800 rounded-xl px-4 py-3 text-sm text-[#f1f5f9] focus:border-[#22d3ee] outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@example.com"
                className="w-full bg-[#1e293b] border border-gray-800 rounded-xl px-4 py-3 text-sm text-[#f1f5f9] focus:border-[#22d3ee] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-mono text-[10px] tracking-wider uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1e293b] border border-gray-800 rounded-xl pl-4 pr-11 py-3 text-sm text-[#f1f5f9] focus:border-[#22d3ee] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {err && (
              <div className="flex items-center gap-2.5 text-xs text-[#f43f5e] bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22d3ee] text-black font-extrabold text-sm py-3.5 rounded-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : tab === "login" ? "Sign In →" : "Create Account →"}
            </button>

            {tab === "login" && (
              <>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-800"></div>
                  <span className="flex-shrink mx-4 text-gray-500 font-mono text-[9px] uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-gray-800"></div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 hover:bg-[#fbbf24]/12 text-[#fbbf24] font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Accessing..." : "One-Click Demo Access"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
