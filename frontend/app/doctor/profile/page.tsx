"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Clock, AlertCircle, Check } from "lucide-react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
];

import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DoctorProfilePage() {
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    specialty: "",
    experience: "",
    qualification: "",
    license_number: "",
    bio: "",
    available_days: [] as string[],
    available_time_slots: [] as string[],
    consultation_fee: 500,
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

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
          // Map backend specialty labels (Title Case) to the Select item's keys
          const rawSpecialty = (data.profile.specialty || "")
            .toString()
            .toLowerCase();
          let specialtyKey = "";
          if (rawSpecialty) {
            if (rawSpecialty.includes("cardio")) specialtyKey = "cardiology";
            else if (rawSpecialty.includes("derma"))
              specialtyKey = "dermatology";
            else if (rawSpecialty.includes("pedi")) specialtyKey = "pediatrics";
            else if (rawSpecialty.includes("ortho"))
              specialtyKey = "orthopedics";
            else if (rawSpecialty.includes("neuro")) specialtyKey = "neurology";
            else if (rawSpecialty.includes("general")) specialtyKey = "general";
            else specialtyKey = rawSpecialty; // fallback
          }

          setProfileForm({
            specialty: specialtyKey,
            experience: data.profile.experience || "",
            qualification: data.profile.qualification || "",
            license_number: data.profile.license_number || "",
            bio: data.profile.bio || "",
            available_days: data.profile.available_days || [],
            available_time_slots: data.profile.available_time_slots || [],
            consultation_fee: data.profile.consultation_fee || 500,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setLoading(false);
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
          // ✅ Refresh the profile data to get updated completion status
          setDoctorProfile(data.profile);

          // ✅ If profile is now complete, redirect to doctor dashboard
          if (data.profile.is_profile_complete) {
            setTimeout(() => {
              router.push("/doctor");
            }, 1500);
          }
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

  const toggleDay = (day: string) => {
    setProfileForm((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
    }));
  };

  const toggleTimeSlot = (slot: string) => {
    setProfileForm((prev) => ({
      ...prev,
      available_time_slots: prev.available_time_slots.includes(slot)
        ? prev.available_time_slots.filter((s) => s !== slot)
        : [...prev.available_time_slots, slot],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p>Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Doctor Profile</CardTitle>
          <CardDescription className="text-sm">
            {doctorProfile?.is_profile_complete
              ? "Update your professional information"
              : "Complete your profile to start accepting appointments"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty" className="text-sm font-medium">
                Specialty *
              </Label>
              <Select
                value={profileForm.specialty}
                onValueChange={(value) =>
                  setProfileForm((prev) => ({ ...prev, specialty: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="general">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience" className="text-sm font-medium">
                Experience *
              </Label>
              <Input
                id="experience"
                placeholder="15 years"
                className="mt-1"
                value={profileForm.experience}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="qualification" className="text-sm font-medium">
                Qualification *
              </Label>
              <Input
                id="qualification"
                placeholder="MBBS, MD Cardiology"
                className="mt-1"
                value={profileForm.qualification}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    qualification: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="license" className="text-sm font-medium">
                License Number
              </Label>
              <Input
                id="license"
                placeholder="MED123456"
                className="mt-1"
                value={profileForm.license_number}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    license_number: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="consultation_fee" className="text-sm font-medium">
                Consultation Fee (₹)
              </Label>
              <Input
                id="consultation_fee"
                type="number"
                placeholder="500"
                className="mt-1"
                value={profileForm.consultation_fee}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    consultation_fee: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium">
              Professional Bio *
            </Label>
            <Textarea
              id="bio"
              placeholder="Brief description of your expertise and experience"
              rows={4}
              className="mt-1"
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          {/* Availability Days */}
          <div>
            <Label className="text-sm font-medium">Available Days *</Label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={
                    profileForm.available_days.includes(day)
                      ? "default"
                      : "outline"
                  }
                  className="justify-start"
                  onClick={() => toggleDay(day)}
                >
                  {profileForm.available_days.includes(day) && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <Label className="text-sm font-medium">
              Available Time Slots *
            </Label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={
                    profileForm.available_time_slots.includes(slot)
                      ? "default"
                      : "outline"
                  }
                  className="justify-start"
                  onClick={() => toggleTimeSlot(slot)}
                >
                  {profileForm.available_time_slots.includes(slot) && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {slot}
                </Button>
              ))}
            </div>
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
                {doctorProfile?.is_profile_complete
                  ? "Update Profile"
                  : "Complete Profile"}
              </>
            )}
          </Button>

          {doctorProfile?.is_profile_complete && (
            <Badge variant="default" className="ml-4">
              Profile Complete
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
