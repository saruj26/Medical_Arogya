"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Lock, ArrowLeft, Shield } from "lucide-react";
import { AuthMode } from "./auth-modal";
import api from "@/lib/api";

interface ResetPasswordFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  otp: string;
}

export function ResetPasswordForm({
  onModeChange,
  email,
  otp,
}: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Debug: Log when component renders
  useEffect(() => {
    console.log("🔍 ResetPasswordForm rendered with:", { email, otp, otpLength: otp?.length });
  }, [email, otp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!otp) {
      setError("OTP is missing. Please go back and verify OTP again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        email: email.trim(),
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
        otp: otp.trim(),
      };

      const response = await fetch(api(`/api/auth/reset-password/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          onModeChange("login");
        }, 2000);
      } else {
        // Extract detailed error message
        let errorMessage = "Failed to reset password";
        
        if (data.errors) {
          const fieldErrors = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('; ');
          errorMessage = fieldErrors || errorMessage;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
        <p className="text-sm text-gray-600 mt-1">
          Create your new password for <span className="font-medium text-[#1656a4]">{email}</span>
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
        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password "
              value={formData.newPassword}
              onChange={(e) => updateFormData("newPassword", e.target.value)}
              className="h-11 pl-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              className="h-11 pl-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500">
            Make sure both passwords match exactly
          </p>
        </div>

        {/* Reset Password Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.newPassword || !formData.confirmPassword || !otp}
          className="w-full h-11 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Resetting Password...
            </div>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      {/* Back Button */}
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange("otp", email)}
          disabled={isLoading}
          className="w-full h-11 border-2 border-gray-200 text-gray-700 hover:border-[#1656a4] hover:text-[#1656a4] font-medium transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to OTP Verification
        </Button>
        
        <div className="text-xs text-gray-500 mt-3">
          Your password will be securely updated
        </div>
      </div>
    </div>
  );
}