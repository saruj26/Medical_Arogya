"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { AuthMode } from "./auth-modal";

interface ResetPasswordFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  otp: string;
}

import api from "@/lib/api";

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
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
        <p className="text-sm text-gray-600">
          Enter your new password for {email}
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
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password (min. 6 characters)"
            value={formData.newPassword}
            onChange={(e) => updateFormData("newPassword", e.target.value)}
            className="h-10 mt-1"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            className="h-10 mt-1"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-[#1656a4] hover:bg-[#1656a4]/90"
          disabled={isLoading || !formData.newPassword || !formData.confirmPassword || !otp}
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

        <div className="text-center">
          <button
            type="button"
            onClick={() => onModeChange("otp", email)}
            className="text-sm text-[#1656a4] hover:underline"
            disabled={isLoading}
          >
            Back to OTP Verification
          </button>
        </div>
      </form>
    </div>
  );
}