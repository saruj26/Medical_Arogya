"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { AuthMode } from "./auth-modal";

interface ResetPasswordFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  setEmail: (email: string) => void;
}

import api from "@/lib/api";

export function ResetPasswordForm({
  onModeChange,
  email,
}: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = api("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(api(`/api/auth/reset-password/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: formData.newPassword,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          onModeChange("login", email);
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      const message =
        err instanceof Error && /Failed to fetch|network/i.test(err.message)
          ? `Cannot connect to backend at ${API_BASE_URL}. Is the Django server running?`
          : "An error occurred. Please try again.";
      setError(message);
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            OTP
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={(e) => updateFormData("otp", e.target.value)}
            className="h-10 mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={(e) => updateFormData("newPassword", e.target.value)}
            className="h-10 mt-1"
            required
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
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}
