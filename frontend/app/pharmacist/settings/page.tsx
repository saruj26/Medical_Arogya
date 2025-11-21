"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { ChangePassword } from "@/components/change-password";
import {
  Stethoscope,
  ArrowLeft,
  User,
  Bell,
  Shield,
  SettingsIcon,
  Mail,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import api from "@/lib/api";

export default function PharmacistSettings() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "pharmacist") {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
  }, [router]);

  const handlePasswordChange = async () => {
    // Validate locally first
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match!",
      });
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters long!",
      });
      return;
    }

    setSavingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(api(`/api/auth/change-password/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
          confirm_password: passwordForm.confirm_password,
        }),
      });

      // Try to parse JSON response if possible to show helpful messages
      const ct = response.headers.get("content-type") || "";
      let data: any = null;
      if (ct.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        // If API returns success boolean, use it; otherwise assume ok
        const ok =
          data && typeof data.success !== "undefined" ? data.success : true;
        if (ok) {
          setPasswordMessage({
            type: "success",
            text: (data && data.message) || "Password changed successfully!",
          });
          setPasswordForm({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
        } else {
          setPasswordMessage({
            type: "error",
            text:
              (data && (data.message || JSON.stringify(data))) ||
              "Invalid current password",
          });
        }
      } else {
        // response not ok - try to map common DRF error shapes
        if (data) {
          // data may be { detail: '...' } or { current_password: ['..'] }
          const detail = data.detail || data.message;
          if (detail) {
            setPasswordMessage({ type: "error", text: String(detail) });
          } else {
            // find first field error
            const firstKey = Object.keys(data)[0];
            const val = data[firstKey];
            const text = Array.isArray(val) ? val.join(" ") : String(val);
            setPasswordMessage({
              type: "error",
              text: text || "Failed to change password",
            });
          }
        } else {
          setPasswordMessage({
            type: "error",
            text: "Failed to change password. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/pharmacist">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#1656a4] bg-white/80 backdrop-blur-sm transition-all duration-300 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                  Pharmacy Settings
                </h1>
                <p className="text-xs text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Pharmacist
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        {/* <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                Pharmacy Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage system settings and your account preferences</p>
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Information */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-white">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Your pharmacist account details and access information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <div className="text-lg font-medium text-gray-900 mt-1">{userEmail}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="text-sm font-semibold text-gray-700">Account Type</label>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <User className="w-3 h-3 mr-1" />
                          Pharmacist
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="text-sm font-semibold text-gray-700">Access Level</label>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Pharmacy Access
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-800">Account Active</div>
                        <div className="text-sm text-green-600">Your pharmacist account is active and in good standing</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Shield className="w-5 h-5" />
                  Security & Access Control
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Manage security settings and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Enable 2FA for enhanced security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-2 border-gray-200 hover:border-blue-200">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Session Timeout</p>
                        <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                      </div>
                    </div>
                    <select className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-[#1656a4] focus:outline-none transition-colors bg-white">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Login Alerts</p>
                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1656a4]"></div>
                    </label>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white py-3 font-semibold shadow-lg">
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Password Change */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl h-fit">
            <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-white">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-blue-100">
                Update your account password for enhanced security
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.current ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          current_password: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                      className="pr-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.new ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          new_password: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      className="pr-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordForm.confirm_password}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirm_password: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                      className="pr-10 border-2 border-gray-200 focus:border-[#1656a4] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">Password Requirements</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordForm.new_password.length >= 6 ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                      At least 6 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordForm.new_password === passwordForm.confirm_password && passwordForm.new_password ? 'bg-green-500' : 'bg-blue-300'}`}></div>
                      New passwords must match
                    </li>
                  </ul>
                </div>

                {/* Message Display */}
                {passwordMessage.text && (
                  <div
                    className={`p-4 rounded-xl border ${
                      passwordMessage.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {passwordMessage.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">{passwordMessage.text}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setPasswordForm({
                        current_password: "",
                        new_password: "",
                        confirm_password: "",
                      });
                      setPasswordMessage({ type: "", text: "" });
                    }}
                    variant="outline"
                    className="flex-1 border-2 border-gray-200 hover:border-gray-300"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handlePasswordChange}
                    disabled={savingPassword || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
                    className="flex-1 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-white font-semibold shadow-lg"
                  >
                    {savingPassword ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
            <Shield className="w-4 h-4 text-[#1656a4]" />
            <span className="text-sm text-gray-600">
              Your security and privacy are important to us. All changes are encrypted and secure.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}