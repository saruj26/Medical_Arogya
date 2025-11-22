"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Shield, ArrowLeft } from "lucide-react";
import { AuthMode } from "./auth-modal";
import api from "@/lib/api";

interface OTPVerificationFormProps {
  onModeChange: (mode: AuthMode, email?: string, otp?: string) => void;
  onSuccess: () => void;
  email: string;
  setEmail: (email: string) => void;
}

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
          onModeChange("reset", email, otp);
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
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Verify OTP</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter the 6-digit code sent to <span className="font-medium text-[#1656a4]">{email}</span>
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Field */}
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">
            Verification Code
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="h-11 text-center text-lg tracking-widest font-semibold border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
            maxLength={6}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 text-center">
            Enter the 6-digit verification code
          </p>
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full h-11 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </div>
          ) : (
            "Verify Code"
          )}
        </Button>
      </form>

      {/* Back Button */}
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange("forgot", email)}
          disabled={isLoading}
          className="w-full h-11 border-2 border-gray-200 text-gray-700 hover:border-[#1656a4] hover:text-[#1656a4] font-medium transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forgot Password
        </Button>
        
        <div className="text-xs text-gray-500 mt-3">
          Didn't receive the code? Check your spam folder or try again
        </div>
      </div>
    </div>
  );
}