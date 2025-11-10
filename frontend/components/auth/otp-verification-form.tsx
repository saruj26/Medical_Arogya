"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { AuthMode } from "./auth-modal";

interface OTPVerificationFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  setEmail: (email: string) => void;
}

import api from "@/lib/api";

export function OTPVerificationForm({
  onModeChange,
  email,
}: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = api("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(api(`/api/auth/verify-otp/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("OTP verified!");
        setTimeout(() => {
          onModeChange("reset", email);
        }, 1000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      const message =
        err instanceof Error && /Failed to fetch|network/i.test(err.message)
          ? `Cannot connect to backend at ${API_BASE_URL}. Is the Django server running?`
          : "An error occurred. Please try again.";
      setError(message);
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-800 text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="otp" className="text-sm font-medium">
            Enter OTP
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="h-10 mt-1 text-center text-lg tracking-widest"
            maxLength={6}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-[#1656a4] hover:bg-[#1656a4]/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </div>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </div>
  );
}
