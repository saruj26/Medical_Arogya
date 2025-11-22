"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock, User } from "lucide-react";
import { AuthMode } from "./auth-modal";
import api from "@/lib/api";

interface LoginFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export function LoginForm({
  onModeChange,
  onSuccess,
  email,
  setEmail,
}: LoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await fetch(api(`/api/auth/login/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text().catch(() => null);
        console.error("Non-JSON response from login:", response.status, text);
        setError(text || "Login failed.");
        return;
      }

      if (response.ok && data.success && data.user && data.token) {
        const rawRole = (data.user && data.user.role) || "";
        const normalizedRole = rawRole === "phamacist" ? "pharmacist" : rawRole;

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", normalizedRole);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userId", data.user.id.toString());

        setSuccess("Login successful!");

        setTimeout(() => {
          onSuccess();
          const roleToUse = rawRole === "phamacist" ? "pharmacist" : rawRole;

          if (roleToUse === "admin") {
            router.push("/admin");
          } else if (roleToUse === "doctor") {
            const complete = (data.user as any).is_profile_complete;
            if (!complete) {
              router.push("/doctor/profile");
            } else {
              router.push("/doctor");
            }
          } else if (roleToUse === "pharmacist") {
            router.push("/pharmacist");
          } else {
            router.push("/customer");
          }
        }, 1000);
      } else {
        if (data && data.errors) {
          try {
            const errs = Object.values(data.errors)
              .flat()
              .map((e: any) => (typeof e === "string" ? e : JSON.stringify(e)));
            setError(errs.join(" | "));
          } catch (e) {
            setError(JSON.stringify(data.errors));
          }
        } else {
          setError(data.message || "Invalid email or password.");
        }
      }
    } catch (err) {
      const message =
        err instanceof Error && /Failed to fetch|network/i.test(err.message)
          ? `Cannot connect to backend at ${API_BASE_URL}. Is the Django server running?`
          : "An error occurred. Please try again.";
      setError(message);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pl-10 pr-12 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-gray-100"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
           <button
              type="button"
              onClick={() => onModeChange("forgot", email)}
              className="text-xs text-[#1656a4] hover:text-cyan-600 font-medium transition-colors"
            >
              Forgot Password?
            </button>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing In...
            </div>
          ) : (
            "Sign In to Account"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">New to Arogya?</span>
        </div>
      </div>

      {/* Register Section */}
      <div className="text-center space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onModeChange("register", email)}
          className="w-full h-11 border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white font-medium transition-all duration-300"
        >
          <User className="w-4 h-4 mr-2" />
          Create New Account
        </Button>
        
        <div className="text-xs text-gray-500">
          Secure login • Your data is protected
        </div>
      </div>
    </div>
  );
}