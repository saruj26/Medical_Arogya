"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Stethoscope,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  ArrowLeft,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<
    "login" | "register" | "forgot" | "otp" | "reset"
  >(initialMode);
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
        onClose();
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
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md p-0 bg-black/60 border-none shadow-none backdrop-blur-md">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute -top-8 right-0 text-white hover:bg-white/20 z-50"
          >
            <X className="w-4 h-4" />
          </Button>

          <Card className="border border-[#1656a4]/30 shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg p-4">
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
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <Stethoscope className="w-5 h-5" />
                  <CardTitle className="text-lg">{getTitle()}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-blue-100 text-center text-sm">
                {getDescription()}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
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
                {mode === "register" && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
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
                        className="h-10 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-10 mt-1"
                        required
                      />
                    </div>
                  </>
                )}

                {(mode === "login" ||
                  mode === "register" ||
                  mode === "forgot") && (
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-10 mt-1"
                      required
                    />
                  </div>
                )}

                {(mode === "login" || mode === "register") && (
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="h-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-10 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {mode === "otp" && (
                  <div>
                    <Label htmlFor="otp" className="text-sm font-medium">
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
                      className="h-10 mt-1 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Demo OTP: 123456
                    </p>
                  </div>
                )}

                {mode === "reset" && (
                  <>
                    <div>
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium"
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
                        className="h-10 mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
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
                        className="h-10 mt-1"
                        required
                      />
                    </div>
                  </>
                )}

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
                    className="text-sm text-[#1656a4] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {mode === "login" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 text-sm">
                    Demo Accounts:
                  </h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div>Patient: customer@gmail.com</div>
                    <div>Doctor: doctor@gmail.com</div>
                    <div>Admin: admin@gmail.com</div>
                    <div>Password: password123</div>
                  </div>
                </div>
              )}

              {(mode === "login" || mode === "register") && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      switchMode(mode === "login" ? "register" : "login")
                    }
                    className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white"
                  >
                    {mode === "login" ? "Create Account" : "Sign In"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
