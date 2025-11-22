"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { AuthMode } from "./auth-modal";

interface OTPVerificationFormProps {
  onModeChange: (mode: AuthMode, email?: string, otp?: string) => void; // Add otp parameter
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

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
        setSuccess("OTP verified successfully!");
        setTimeout(() => {
          onModeChange("reset", email, otp); // Pass OTP here
        }, 1000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      const message = err instanceof Error 
        ? err.message 
        : "An error occurred. Please try again.";
      setError(message);
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Verify OTP</h3>
        <p className="text-sm text-gray-600">
          Enter the OTP sent to {email}
        </p>
      </div>

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
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="h-10 mt-1 text-center text-lg tracking-widest"
            maxLength={6}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-[#1656a4] hover:bg-[#1656a4]/90"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </div>
          ) : (
            "Verify OTP"
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => onModeChange("forgot", email)}
            className="text-sm text-[#1656a4] hover:underline"
            disabled={isLoading}
          >
            Back to Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
}