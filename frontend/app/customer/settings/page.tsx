"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Stethoscope,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Heart,
  Lock,
  Users,
  BarChart3,
} from "lucide-react";

export default function CustomerSettings() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    marketing: false,
    appointmentReminders: true,
    healthTips: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    dataSharing: false,
    medicalHistory: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "customer") {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
  }, [router]);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Preferences saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save preferences" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // basic validations
    const current = (passwordForm.current_password || "").trim();
    const nw = (passwordForm.new_password || "").trim();
    const confirm = (passwordForm.confirm_password || "").trim();

    if (!current || !nw || !confirm) {
      setMessage({ type: "error", text: "Please fill all password fields." });
      Swal.fire({
        icon: "error",
        title: "Missing fields",
        text: "Please fill all password fields.",
      });
      return;
    }

    if (nw !== confirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "New passwords do not match.",
      });
      return;
    }

    if (nw.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      Swal.fire({
        icon: "error",
        title: "Password too short",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(api("/api/auth/change-password/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          current_password: current,
          new_password: nw,
          confirm_password: confirm,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setMessage({
          type: "error",
          text: "Authentication required. Please login again.",
        });
        Swal.fire({
          icon: "warning",
          title: "Session expired",
          text: "Please login again.",
        });
        // optional: clear tokens and redirect to login
        setTimeout(() => {
          localStorage.removeItem("token");
          router.push("/auth?mode=login");
        }, 1200);
        return;
      }

      if (!res.ok) {
        const errText =
          data?.message || "Failed to change password. Please try again.";
        setMessage({ type: "error", text: errText });
        Swal.fire({ icon: "error", title: "Error", text: errText });
        return;
      }

      if (data && data.success) {
        const successText = data.message || "Password changed successfully.";
        setMessage({ type: "success", text: successText });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: successText,
          timer: 1500,
          showConfirmButton: false,
        });
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        const errText = data?.message || "Failed to change password.";
        setMessage({ type: "error", text: errText });
        Swal.fire({ icon: "error", title: "Error", text: errText });
      }
    } catch (err) {
      console.error("Change password error:", err);
      const errText = "Failed to change password. Please try again.";
      setMessage({ type: "error", text: errText });
      Swal.fire({ icon: "error", title: "Error", text: errText });
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Patient Settings
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Message Alert */}
        {message.text && (
          <Alert
            className={`mb-6 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Your basic account details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email Address
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
                      {userEmail}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Account Type
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Patient Account
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Member Since
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Account Status
                    </Label>
                    <div className="p-3 border rounded-lg text-sm">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Choose how you want to receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  {Object.entries({
                    email: "Email Notifications",
                    sms: "SMS Notifications",
                    appointmentReminders: "Appointment Reminders",
                    healthTips: "Health Tips & Updates",
                    marketing: "Marketing Communications",
                  }).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3 border-b border-blue-50 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {label}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {key === "email" &&
                            "Receive appointment reminders and updates via email"}
                          {key === "sms" &&
                            "Get SMS notifications for important updates"}
                          {key === "appointmentReminders" &&
                            "Reminders 24 hours before appointments"}
                          {key === "healthTips" &&
                            "Weekly health tips and wellness advice"}
                          {key === "marketing" &&
                            "Promotional offers and health program updates"}
                        </p>
                      </div>
                      <Switch
                        checked={
                          notifications[key as keyof typeof notifications]
                        }
                        onCheckedChange={() =>
                          handleNotificationChange(
                            key as keyof typeof notifications
                          )
                        }
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Notification Preferences
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="current_password"
                      className="text-sm font-semibold"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPassword.current ? "text" : "password"}
                        value={passwordForm.current_password}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            current_password: e.target.value,
                          }))
                        }
                        className="border-blue-200 focus:border-blue-500 h-12 pr-10"
                        placeholder="Enter your current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPassword.current ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="new_password"
                      className="text-sm font-semibold"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showPassword.new ? "text" : "password"}
                        value={passwordForm.new_password}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            new_password: e.target.value,
                          }))
                        }
                        className="border-blue-200 focus:border-blue-500 h-12 pr-10"
                        placeholder="Enter new password (min 6 characters)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPassword.new ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm_password"
                      className="text-sm font-semibold"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordForm.confirm_password}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirm_password: e.target.value,
                          }))
                        }
                        className="border-blue-200 focus:border-blue-500 h-12 pr-10"
                        placeholder="Confirm your new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handlePasswordChange}
                  disabled={
                    saving ||
                    !passwordForm.current_password ||
                    !passwordForm.new_password ||
                    !passwordForm.confirm_password
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Privacy Settings */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-green-100">
                  Manage your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {Object.entries({
                  profileVisibility: "Profile Visibility",
                  medicalHistory: "Medical History Sharing",
                  dataSharing: "Anonymous Data Sharing",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {label}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {key === "profileVisibility" &&
                          "Allow doctors to view your basic profile"}
                        {key === "medicalHistory" &&
                          "Share medical history with treating doctors"}
                        {key === "dataSharing" &&
                          "Contribute anonymized data for medical research"}
                      </p>
                    </div>
                    <Switch
                      checked={privacy[key as keyof typeof privacy]}
                      onCheckedChange={() =>
                        handlePrivacyChange(key as keyof typeof privacy)
                      }
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                ))}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold mt-4">
                  <Save className="w-4 h-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Use a strong, unique password</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enable two-factor authentication if available</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Never share your login credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Log out from shared devices</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Health Records
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Family Accounts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Data</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Medical Records</span>
                    <Badge variant="secondary">12 files</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Appointments</span>
                    <Badge variant="secondary">5 upcoming</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prescriptions</span>
                    <Badge variant="secondary">8 active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
