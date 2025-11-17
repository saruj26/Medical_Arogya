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
import { 
  Save, 
  Clock, 
  AlertCircle, 
  Check, 
  User, 
  Briefcase, 
  GraduationCap, 
  FileText,
  Calendar,
  Clock as ClockIcon,
  DollarSign,
  Shield,
  Star,
  Award,
  MapPin,
  ChevronDown,
  ChevronUp
} from "lucide-react";

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
  const [showAvailability, setShowAvailability] = useState(false);
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
            else specialtyKey = rawSpecialty;
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
          setDoctorProfile(data.profile);
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

  const selectAllDays = () => {
    setProfileForm((prev) => ({
      ...prev,
      available_days: [...daysOfWeek],
    }));
  };

  const clearAllDays = () => {
    setProfileForm((prev) => ({
      ...prev,
      available_days: [],
    }));
  };

  const selectAllTimeSlots = () => {
    setProfileForm((prev) => ({
      ...prev,
      available_time_slots: [...timeSlots],
    }));
  };

  const clearAllTimeSlots = () => {
    setProfileForm((prev) => ({
      ...prev,
      available_time_slots: [],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <User className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              Doctor Profile
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              {doctorProfile?.is_profile_complete
                ? "Manage your professional information and availability"
                : "Complete your profile setup to start accepting patient appointments"}
            </p>
          </div>
          
          {doctorProfile?.is_profile_complete && (
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium">
              <Check className="w-4 h-4 mr-1" />
              Profile Complete
            </Badge>
          )}
        </div>

        {/* Profile Completion Alert */}
        {!doctorProfile?.is_profile_complete && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Profile Incomplete</p>
                  <p className="text-sm text-orange-700">
                    Complete your profile to start accepting appointments and appear in patient searches.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Profile Card */}
        <Card className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white pb-4">
            <CardTitle className="text-xl flex items-center gap-3">
              <Briefcase className="w-6 h-6" />
              Professional Information
            </CardTitle>
            <CardDescription className="text-blue-100">
              Update your medical credentials and specialization details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Specialty */}
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-sm font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Specialty *
                </Label>
                <Select
                  value={profileForm.specialty}
                  onValueChange={(value) =>
                    setProfileForm((prev) => ({ ...prev, specialty: value }))
                  }
                >
                  <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500">
                    <SelectValue placeholder="Select your specialty" />
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

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  Experience *
                </Label>
                <Input
                  id="experience"
                  placeholder="e.g., 15 years"
                  className="h-12 border-blue-200 focus:border-blue-500"
                  value={profileForm.experience}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Qualification */}
              <div className="space-y-2">
                <Label htmlFor="qualification" className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Qualification *
                </Label>
                <Input
                  id="qualification"
                  placeholder="MBBS, MD Cardiology"
                  className="h-12 border-blue-200 focus:border-blue-500"
                  value={profileForm.qualification}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      qualification: e.target.value,
                    }))
                  }
                />
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <Label htmlFor="license" className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  License Number
                </Label>
                <Input
                  id="license"
                  placeholder="MED123456"
                  className="h-12 border-blue-200 focus:border-blue-500"
                  value={profileForm.license_number}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      license_number: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Consultation Fee */}
              <div className="space-y-2">
                <Label htmlFor="consultation_fee" className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Consultation Fee (Rs)
                </Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  placeholder="500"
                  className="h-12 border-blue-200 focus:border-blue-500"
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

            {/* Professional Bio */}
            <div className="space-y-3">
              <Label htmlFor="bio" className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Professional Bio *
              </Label>
              <Textarea
                id="bio"
                placeholder="Describe your medical expertise, areas of specialization, treatment philosophy, and any notable achievements or certifications..."
                rows={4}
                className="border-blue-200 focus:border-blue-500 resize-none"
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
                }
              />
              <p className="text-xs text-gray-500">
                This bio will be visible to patients when they view your profile.
              </p>
            </div>

            {/* Availability Section - Compact Design */}
            <div className="border border-blue-100 rounded-xl bg-blue-25 overflow-hidden">
              {/* Availability Header */}
              <div 
                className="p-4 bg-blue-50 border-b border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => setShowAvailability(!showAvailability)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Availability Schedule</h3>
                      <p className="text-sm text-gray-600">
                        {profileForm.available_days.length} days • {profileForm.available_time_slots.length} time slots selected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {profileForm.available_days.length}/7 days
                    </Badge>
                    {showAvailability ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              {showAvailability && (
                <div className="p-6 space-y-6">
                  {/* Days Selection - Compact */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Available Days *
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllDays}
                          className="text-xs border-green-200 text-green-600 hover:bg-green-50"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllDays}
                          className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`
                            p-3 rounded-lg border text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center
                            ${profileForm.available_days.includes(day)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }
                          `}
                        >
                          <span className="text-xs font-semibold">
                            {day.substring(0, 3)}
                          </span>
                          {profileForm.available_days.includes(day) && (
                            <Check className="w-3 h-3 mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots - Compact */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-blue-600" />
                        Available Time Slots *
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllTimeSlots}
                          className="text-xs border-green-200 text-green-600 hover:bg-green-50"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllTimeSlots}
                          className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleTimeSlot(slot)}
                          className={`
                            p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-center
                            ${profileForm.available_time_slots.includes(slot)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }
                          `}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {profileForm.available_time_slots.includes(slot) && (
                              <Check className="w-3 h-3 mr-1" />
                            )}
                            {slot}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Selected Availability</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Days: </span>
                        <span className="text-gray-600">
                          {profileForm.available_days.length > 0 
                            ? profileForm.available_days.map(day => day.substring(0, 3)).join(', ')
                            : 'No days selected'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Time Slots: </span>
                        <span className="text-gray-600">
                          {profileForm.available_time_slots.length} selected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-blue-100">
              <Button
                onClick={handleProfileUpdate}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-sm hover:shadow-md transition-all duration-200"
                size="lg"
              >
                {saving ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {doctorProfile?.is_profile_complete
                      ? "Update Professional Profile"
                      : "Complete Profile Setup"}
                  </>
                )}
              </Button>
              
              {doctorProfile?.is_profile_complete && (
                <Button
                  variant="outline"
                  onClick={() => router.push("/doctor")}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3"
                >
                  Back to Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {doctorProfile?.is_profile_complete ? "Complete" : "Incomplete"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available Days</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profileForm.available_days.length}/7 days
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Time Slots</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profileForm.available_time_slots.length} slots
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}