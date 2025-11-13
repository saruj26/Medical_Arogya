// app/customer/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Shield, User } from "lucide-react";
import api from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token: string) => {
    try {
      setProfileLoading(true);
      const res = await fetch(api(`/api/user/profile/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
        router.push("/");
        return;
      }

      const ct = res.headers.get("content-type") || "";
      if (res.ok) {
        try {
          if (ct.includes("application/json")) {
            const data = await res.json();
            const u = data.user || {};
            setName(u.name || "");
            setPhone(u.phone || "");
            setDob(u.date_of_birth || "");
            setGender(u.gender || "");
            setBloodGroup(u.blood_group || "");
            setAddress(u.address || "");
          } else {
            const text = await res.text();
            console.error("User profile endpoint returned non-JSON:", text);
            setProfileMessage(
              "Failed to load profile: server returned non-JSON response"
            );
          }
        } catch (e) {
          console.error("Failed to parse profile JSON:", e);
          setProfileMessage("Failed to parse profile response");
        }
      } else {
        try {
          const text = await res.text();
          console.error("Failed to fetch profile", res.status, text);
          setProfileMessage(`Failed to fetch profile: ${res.status}`);
        } catch (e) {
          console.error("Failed to fetch profile", res.status, e);
          setProfileMessage("Failed to fetch profile");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setProfileMessage(null);
    setProfileLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const profileData = {
        name: name,
        phone: phone,
        date_of_birth: dob || null,
        gender: gender,
        blood_group: bloodGroup,
        address: address,
      };

      const res = await fetch(api("/api/user/profile/"), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProfileMessage("Profile updated successfully");
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            const updated = {
              ...u,
              name: name,
              phone: phone,
              date_of_birth: dob,
              gender: gender,
              blood_group: bloodGroup,
              address: address,
            };
            localStorage.setItem("user", JSON.stringify(updated));
          } catch (e) {
            console.error("Error updating localStorage:", e);
          }
        }
      } else {
        setProfileMessage(
          data.message || data.errors
            ? JSON.stringify(data.errors)
            : "Failed to update profile"
        );
      }
    } catch (e) {
      console.error("Profile update error:", e);
      setProfileMessage("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-sm text-gray-600">Expert medical care at your fingertips</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Confidential</span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#0f3f7f] text-white">
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription className="text-blue-100">
              Update your profile details and medical information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                  value={userEmail}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Gender
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Blood Group
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Address
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1656a4] focus:border-transparent transition-all"
                rows={4}
                placeholder="Enter your complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Button
                className="bg-[#1656a4] hover:bg-[#0f3f7f] text-white font-semibold h-11 px-6 sm:w-auto w-full"
                onClick={handleProfileUpdate}
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
              {profileMessage && (
                <span
                  className={`text-sm font-medium ${
                    profileMessage.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {profileMessage}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}