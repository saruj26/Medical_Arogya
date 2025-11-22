"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Mail, ArrowLeft, Key } from "lucide-react";
import { AuthMode } from "./auth-modal";
import api from "@/lib/api";

interface ForgotPasswordFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export function ForgotPasswordForm({
  onModeChange,
  email,
  setEmail,
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(api(`/api/auth/forgot-password/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("OTP sent to your email! Redirecting...");
        setTimeout(() => {
          onModeChange("otp", email);
        }, 1500);
      } else {
        setError(data.message || data.errors?.email?.[0] || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const message = err instanceof Error 
        ? err.message 
        : "Network error. Please check your connection and try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Key className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email to receive a verification code
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
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
              required
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500">
            We'll send a 6-digit verification code to this email
          </p>
        </div>

        {/* Send OTP Button */}
        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-11 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending Code...
            </div>
          ) : (
            "Send Verification Code"
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange("login")}
          disabled={isLoading}
          className="w-full h-11 border-2 border-gray-200 text-gray-700 hover:border-[#1656a4] hover:text-[#1656a4] font-medium transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
        
        <div className="text-xs text-gray-500 mt-3">
          Check your spam folder if you don't receive the email
        </div>
      </div>
    </div>
  );
}