"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Stethoscope, ArrowLeft } from "lucide-react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { OTPVerificationForm } from "./otp-verification-form";
import { ResetPasswordForm } from "./reset-password-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export type AuthMode = "login" | "register" | "forgot" | "otp" | "reset";

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");

  const switchMode = (newMode: AuthMode, userEmail?: string) => {
    setMode(newMode);
    if (userEmail) setEmail(userEmail);
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back";
      case "register":
        return "Join Arogya";
      case "forgot":
        return "Forgot Password";
      case "otp":
        return "Verify OTP";
      case "reset":
        return "Reset Password";
      default:
        return "Arogya";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login":
        return "Sign in to your account";
      case "register":
        return "Create your account";
      case "forgot":
        return "Enter your email to reset password";
      case "otp":
        return "Enter the OTP sent to your email";
      case "reset":
        return "Create a new password";
      default:
        return "";
    }
  };

  const handleClose = () => {
    setMode(initialMode);
    setEmail("");
    onClose();
  };

  const renderForm = () => {
    const commonProps = {
      onModeChange: switchMode,
      onSuccess: handleClose,
      email,
      setEmail,
    };

    switch (mode) {
      case "login":
        return <LoginForm {...commonProps} />;
      case "register":
        return <RegisterForm {...commonProps} />;
      case "forgot":
        return <ForgotPasswordForm {...commonProps} />;
      case "otp":
        return <OTPVerificationForm {...commonProps} />;
      case "reset":
        return <ResetPasswordForm {...commonProps} />;
      default:
        return <LoginForm {...commonProps} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm sm:max-w-md p-0 bg-black/60 border-none shadow-none backdrop-blur-md">
        <div className="relative">
          <div className="border border-[#1656a4]/30 shadow-xl bg-white rounded-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                {(mode === "forgot" || mode === "otp" || mode === "reset") && (
                  <button
                    onClick={() => switchMode("login")}
                    className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <Stethoscope className="w-5 h-5" />
                  <DialogTitle className="text-lg font-semibold">
                    {getTitle()}
                  </DialogTitle>
                </div>
                {/* Spacer for alignment when back button is present */}
                {(mode === "forgot" || mode === "otp" || mode === "reset") && (
                  <div className="w-6" />
                )}
              </div>
              <DialogDescription className="text-blue-100 text-center text-sm mt-1">
                {getDescription()}
              </DialogDescription>
            </div>

            {/* Form Content */}
            <div className="p-4">{renderForm()}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
