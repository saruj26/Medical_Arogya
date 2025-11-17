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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Stethoscope,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Briefcase,
  GraduationCap,
  FileText,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/api";

export default function DoctorSettings() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
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
  const [profileForm, setProfileForm] = useState({
    specialty: "",
    experience: "",
    qualification: "",
    license_number: "",
    bio: "",
    consultation_fee: 500,
  });
  const [notifications, setNotifications] = useState({
    appointments: true,
    reminders: true,
    messages: true,
    healthTips: true,
    systemUpdates: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "doctor") {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
    fetchDoctorProfile();
  }, [router]);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(api(`/api/doctor/doctor/profile/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDoctorProfile(data.profile);
          setProfileForm({
            specialty: data.profile.specialty || "",
            experience: data.profile.experience || "",
            qualification: data.profile.qualification || "",
            license_number: data.profile.license_number || "",
            bio: data.profile.bio || "",
            consultation_fee: data.profile.consultation_fee || 500,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    }
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(api(`/api/doctor/doctor/profile/`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage({
            type: "success",
            text: "Profile updated successfully!",
          });
          setDoctorProfile(data.profile);
        } else {
          setMessage({
            type: "error",
            text: data.message || "Failed to update profile",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

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

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/doctor">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Doctor Settings
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
                  Your basic account details and status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email Address
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
                      {userEmail}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-gray-700">
                      Account Type
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        Doctor Account
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-gray-700">
                      Doctor ID
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 font-mono">
                      {doctorProfile?.doctor_id || "Not assigned"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-gray-700">
                      Profile Status
                    </Label>
                    <div className="p-3 border rounded-lg text-sm">
                      <Badge
                        className={
                          doctorProfile?.is_profile_complete
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {doctorProfile?.is_profile_complete ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Incomplete
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Stethoscope className="w-5 h-5" />
                  Professional Information
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Update your professional credentials and expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="specialty"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      Specialty *
                    </Label>
                    <Input
                      id="specialty"
                      value={profileForm.specialty}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          specialty: e.target.value,
                        }))
                      }
                      className="border-blue-200 focus:border-blue-500 h-12"
                      placeholder="e.g., Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="experience"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-blue-600" />
                      Years of Experience *
                    </Label>
                    <Input
                      id="experience"
                      value={profileForm.experience}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          experience: e.target.value,
                        }))
                      }
                      className="border-blue-200 focus:border-blue-500 h-12"
                      placeholder="e.g., 15 years"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="qualification"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Qualification *
                    </Label>
                    <Input
                      id="qualification"
                      value={profileForm.qualification}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          qualification: e.target.value,
                        }))
                      }
                      className="border-blue-200 focus:border-blue-500 h-12"
                      placeholder="e.g., MBBS, MD Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="license"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      Medical License Number
                    </Label>
                    <Input
                      id="license"
                      value={profileForm.license_number}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          license_number: e.target.value,
                        }))
                      }
                      className="border-blue-200 focus:border-blue-500 h-12"
                      placeholder="e.g., MED123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="consultation_fee"
                      className="text-sm font-semibold flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      Consultation Fee (Rs)
                    </Label>
                    <Input
                      id="consultation_fee"
                      type="number"
                      value={profileForm.consultation_fee}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          consultation_fee: Number(e.target.value),
                        }))
                      }
                      className="border-blue-200 focus:border-blue-500 h-12"
                      placeholder="500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    Professional Bio *
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className="border-blue-200 focus:border-blue-500 min-h-[120px] resize-none"
                    placeholder="Brief description of your expertise, experience, and approach to patient care..."
                  />
                  <p className="text-xs text-gray-500">
                    This bio will be visible to patients when they view your
                    profile
                  </p>
                </div>
                <Button
                  onClick={handleProfileUpdate}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Professional Information
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5" />
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
                {/* Inline password message for this card */}
                {passwordMessage.text && (
                  <Alert
                    className={`mb-4 ${
                      passwordMessage.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {passwordMessage.type === "success" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <AlertDescription>{passwordMessage.text}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handlePasswordChange}
                  disabled={
                    savingPassword ||
                    !passwordForm.current_password ||
                    !passwordForm.new_password ||
                    !passwordForm.confirm_password
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  {savingPassword ? (
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
            {/* Notification Settings */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {Object.entries({
                  appointments: "New Appointment Notifications",
                  reminders: "Appointment Reminders",
                  messages: "Patient Messages",
                  healthTips: "Health Tip Engagement",
                  systemUpdates: "System Updates",
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
                        {key === "appointments" &&
                          "Get notified when patients book appointments"}
                        {key === "reminders" &&
                          "Receive reminders before appointments"}
                        {key === "messages" &&
                          "Get notified of patient inquiries"}
                        {key === "healthTips" &&
                          "Notifications about your health tips"}
                        {key === "systemUpdates" &&
                          "Important system and feature updates"}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={() =>
                        handleNotificationChange(
                          key as keyof typeof notifications
                        )
                      }
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                ))}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
                    <span>Change your password regularly</span>
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

            {/* Quick Stats */}
            <Card className="bg-white rounded-2xl shadow-sm border border-blue-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Profile Completion
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Basic Information
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Complete
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Professional Details
                    </span>
                    <Badge
                      className={
                        profileForm.specialty &&
                        profileForm.experience &&
                        profileForm.qualification
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {profileForm.specialty &&
                      profileForm.experience &&
                      profileForm.qualification
                        ? "Complete"
                        : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bio</span>
                    <Badge
                      className={
                        profileForm.bio
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {profileForm.bio ? "Complete" : "Incomplete"}
                    </Badge>
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
