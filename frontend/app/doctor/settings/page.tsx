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
import {
  Stethoscope,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Clock,
  Save,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";

export default function DoctorSettings() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
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
    }
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
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
          alert("Profile updated successfully!");
          setDoctorProfile(data.profile);
        } else {
          alert(
            "Failed to update profile: " + (data.message || "Unknown error")
          );
        }
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordForm.new_password.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = api("");

      const response = await fetch(api(`/api/auth/change-password/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Password changed successfully!");
          setPasswordForm({
            current_password: "",
            new_password: "",
            confirm_password: "",
          });
        } else {
          alert(
            "Failed to change password: " +
              (data.message || "Invalid current password")
          );
        }
      } else {
        alert("Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/doctor">
            <Button
              variant="outline"
              size="sm"
              className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent p-2 sm:px-4"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#1656a4]">
              Doctor Settings
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account preferences and security
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Account Information */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription className="text-sm">
                Your basic account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">
                    {userEmail}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">
                    Doctor
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Doctor ID
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 border rounded-md text-sm">
                    {doctorProfile?.doctor_id || "Not assigned"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Profile Status
                  </label>
                  <div
                    className={`mt-1 p-3 border rounded-md text-sm ${
                      doctorProfile?.is_profile_complete
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-yellow-50 border-yellow-200 text-yellow-800"
                    }`}
                  >
                    {doctorProfile?.is_profile_complete
                      ? "Complete"
                      : "Incomplete"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Stethoscope className="w-5 h-5" />
                Professional Information
              </CardTitle>
              <CardDescription className="text-sm">
                Update your professional credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="specialty"
                    className="text-sm font-medium text-gray-700"
                  >
                    Specialty
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
                    className="mt-1"
                    placeholder="Cardiology"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="experience"
                    className="text-sm font-medium text-gray-700"
                  >
                    Years of Experience
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
                    className="mt-1"
                    placeholder="15 years"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="qualification"
                    className="text-sm font-medium text-gray-700"
                  >
                    Qualification
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
                    className="mt-1"
                    placeholder="MBBS, MD Cardiology"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="license"
                    className="text-sm font-medium text-gray-700"
                  >
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
                    className="mt-1"
                    placeholder="MED123456"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="consultation_fee"
                    className="text-sm font-medium text-gray-700"
                  >
                    Consultation Fee (Rs )
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
                    className="mt-1"
                    placeholder="500"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="mt-1"
                  rows={4}
                  placeholder="Brief description of your expertise and experience"
                />
              </div>
              <Button
                className="bg-[#1656a4] hover:bg-[#1656a4]/90"
                onClick={handleProfileUpdate}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Information
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-sm">
                Update your password for security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label
                    htmlFor="current_password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        current_password: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="new_password"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Password
                  </Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        new_password: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="confirm_password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirm_password: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button
                className="bg-[#1656a4] hover:bg-[#1656a4]/90"
                onClick={handlePasswordChange}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-2 border-[#1656a4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-sm">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      New Appointment Notifications
                    </p>
                    <p className="text-xs text-gray-600">
                      Get notified when patients book appointments
                    </p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Appointment Reminders</p>
                    <p className="text-xs text-gray-600">
                      Receive reminders 30 minutes before appointments
                    </p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Patient Messages</p>
                    <p className="text-xs text-gray-600">
                      Get notified of patient inquiries
                    </p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
              </div>
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
