"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { AuthMode } from "./auth-modal";
import api from "@/lib/api";

interface RegisterFormProps {
  onModeChange: (mode: AuthMode, email?: string) => void;
  onSuccess: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export function RegisterForm({
  onModeChange,
  onSuccess,
  email,
  setEmail,
}: RegisterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
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
      const response = await fetch(api(`/api/auth/register/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: "customer",
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text().catch(() => null);
        console.error(
          "Non-JSON response from register:",
          response.status,
          text
        );
        setError(text || "Registration failed.");
        return;
      }

      if (response.ok && data.success && data.user && data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userId", data.user.id.toString());

        setSuccess("Registration successful!");

        setTimeout(() => {
          onSuccess();
          router.push("/customer");
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
          setError(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      const message =
        err instanceof Error && /Failed to fetch|network/i.test(err.message)
          ? `Cannot connect to backend at ${API_BASE_URL}. Is the Django server running?`
          : "An error occurred. Please try again.";
      setError(message);
      console.error("Registration error:", err);
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
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            className="h-10 mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => updateFormData("phone", e.target.value)}
            className="h-10 mt-1"
            required
          />
        </div>

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
              onChange={(e) => updateFormData("password", e.target.value)}
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
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onModeChange("login", email)}
          className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
