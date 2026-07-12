"use client";

import React, { useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === "error";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm text-black shadow-2xl animate-fade-in max-w-sm`}
      style={{
        backgroundColor: isError ? "#f43f5e" : "#22d3ee",
      }}
    >
      {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
}
