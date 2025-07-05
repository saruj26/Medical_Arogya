"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Stethoscope,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<
    "login" | "register" | "forgot" | "otp" | "reset"
  >("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "register") {
      setMode("register");
    }
  }, [searchParams]);

  const getUserRole = (email: string): string => {
    if (email === "doctor@gmail.com") return "doctor";
    if (email === "admin@gmail.com") return "admin";
    return "customer";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (mode === "login") {
      if (
        (formData.email === "doctor@gmail.com" &&
          formData.password === "password123") ||
        (formData.email === "admin@gmail.com" &&
          formData.password === "password123") ||
        (formData.email === "customer@gmail.com" &&
          formData.password === "password123")
      ) {
        const role = getUserRole(formData.email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", formData.email);

        if (role === "admin") {
          router.push("/admin");
        } else if (role === "doctor") {
          router.push("/doctor");
        } else {
          router.push("/customer");
        }
      } else {
        setError("Invalid email or password.");
      }
    } else if (mode === "register") {
      localStorage.setItem("userRole", "customer");
      localStorage.setItem("userEmail", formData.email);
      router.push("/customer");
    } else if (mode === "forgot") {
      if (formData.email) {
        setSuccess("OTP sent to your email!");
        setMode("otp");
      } else {
        setError("Please enter a valid email.");
      }
    } else if (mode === "otp") {
      if (formData.otp === "123456") {
        setSuccess("OTP verified!");
        setMode("reset");
      } else {
        setError("Invalid OTP. Try 123456");
      }
    } else if (mode === "reset") {
      if (formData.newPassword === formData.confirmPassword) {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          setMode("login");
          resetForm();
        }, 2000);
      } else {
        setError("Passwords don't match.");
      }
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const switchMode = (
    newMode: "login" | "register" | "forgot" | "otp" | "reset"
  ) => {
    setMode(newMode);
    setError("");
    setSuccess("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-white/80 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-2 border-[#1656a4]/20 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg p-6">
            <div className="flex items-center justify-between">
              {(mode === "forgot" || mode === "otp" || mode === "reset") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("login")}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-3 flex-1 justify-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{getTitle()}</CardTitle>
                  <CardDescription className="text-blue-100 text-sm">
                    {getDescription()}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-800 text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <>
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-12 mt-2 border-2 focus:border-[#1656a4]"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-12 mt-2 border-2 focus:border-[#1656a4]"
                      required
                    />
                  </div>
                </>
              )}

              {(mode === "login" ||
                mode === "register" ||
                mode === "forgot") && (
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 mt-2 border-2 focus:border-[#1656a4]"
                    required
                  />
                </div>
              )}

              {(mode === "login" || mode === "register") && (
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-12 pr-12 border-2 focus:border-[#1656a4]"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-4"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {mode === "otp" && (
                <div>
                  <Label
                    htmlFor="otp"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                    className="h-12 mt-2 text-center text-xl tracking-widest border-2 focus:border-[#1656a4]"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Demo OTP: 123456
                  </p>
                </div>
              )}

              {mode === "reset" && (
                <>
                  <div>
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-semibold text-gray-700"
                    >
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="h-12 mt-2 border-2 focus:border-[#1656a4]"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="h-12 mt-2 border-2 focus:border-[#1656a4]"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 hover:from-[#1656a4]/90 hover:to-[#1656a4] text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : mode === "login" ? (
                  "Sign In"
                ) : mode === "register" ? (
                  "Create Account"
                ) : mode === "forgot" ? (
                  "Send OTP"
                ) : mode === "otp" ? (
                  "Verify OTP"
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            {mode === "login" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-sm text-[#1656a4] hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {mode === "login" && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3 text-sm">
                  Demo Accounts:
                </h4>
                <div className="space-y-2 text-xs text-blue-700">
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="font-mono">customer@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctor:</span>
                    <span className="font-mono">doctor@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin:</span>
                    <span className="font-mono">admin@gmail.com</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-300 pt-2 mt-2">
                    <span>Password:</span>
                    <span className="font-mono font-semibold">password123</span>
                  </div>
                </div>
              </div>
            )}

            {(mode === "login" || mode === "register") && (
              <div className="text-center border-t pt-6">
                <p className="text-sm text-gray-600 mb-3">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    switchMode(mode === "login" ? "register" : "login")
                  }
                  className="border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent font-semibold"
                >
                  {mode === "login" ? "Create Account" : "Sign In"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>&copy; 2024 Arogya. Professional Healthcare Platform</p>
        </div>
      </div>
    </div>
  );
}
