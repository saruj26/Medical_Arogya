"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Stethoscope,
  Star,
  Clock,
  ArrowLeft,
  Filter,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";

interface Doctor {
  id: number;
  doctor_id: string;
  user_name: string;
  specialty: string;
  experience: string;
  qualification: string;
  bio: string;
  consultation_fee: string;
  available_days: string[];
  available_time_slots: string[];
  is_profile_complete: boolean;
}

export default function BrowseDoctors() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const availableDates = [
    { date: "2024-12-25", label: "Today, Dec 25" },
    { date: "2024-12-26", label: "Tomorrow, Dec 26" },
    { date: "2024-12-27", label: "Dec 27, 2024" },
    { date: "2024-12-28", label: "Dec 28, 2024" },
    { date: "2024-12-29", label: "Dec 29, 2024" },
  ];

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "General Medicine",
  ];

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    fetchDoctors(token);
  }, [router]);

  const fetchDoctors = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = doctors;

    if (selectedSpecialty && selectedSpecialty !== "All Specialties") {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty
      );
    }

    setFilteredDoctors(filtered);
  }, [selectedDate, selectedSpecialty, doctors]);

  const getDoctorsByDate = (date: string) => {
    // This would need to be implemented based on actual availability data
    return doctors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1656a4]" />
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/customer">
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
              Find Doctors
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Find the Right Doctor
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Browse by date availability or specialty to find your perfect match
          </p>
        </div>

        <Tabs defaultValue="by-specialty" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
            <TabsTrigger value="by-specialty" className="text-xs sm:text-base">
              By Specialty
            </TabsTrigger>
            <TabsTrigger value="by-date" className="text-xs sm:text-base">
              By Date
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-specialty" className="space-y-4 sm:space-y-6">
            {/* Filters */}
            <Card className="border-2 border-[#1656a4]/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" />
                  Filter Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Specialty
                    </label>
                    <Select
                      value={selectedSpecialty}
                      onValueChange={setSelectedSpecialty}
                    >
                      <SelectTrigger className="h-10 sm:h-12 border-2 focus:border-[#1656a4]">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Available Date
                    </label>
                    <Select
                      value={selectedDate}
                      onValueChange={setSelectedDate}
                    >
                      <SelectTrigger className="h-10 sm:h-12 border-2 focus:border-[#1656a4]">
                        <SelectValue placeholder="Any date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any date</SelectItem>
                        {availableDates.map((date) => (
                          <SelectItem key={date.date} value={date.date}>
                            {date.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctors List */}
            <div className="grid gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  {filteredDoctors.length} Doctor
                  {filteredDoctors.length !== 1 ? "s" : ""} Available
                </h2>
                {(selectedDate || selectedSpecialty !== "All Specialties") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate("");
                      setSelectedSpecialty("All Specialties");
                    }}
                    className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {filteredDoctors.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Doctors Found
                    </h3>
                    <p className="text-gray-600">
                      No doctors match your current filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#1656a4]/30"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#1656a4]/20 mx-auto lg:mx-0">
                          <AvatarFallback className="bg-[#1656a4] text-white text-lg">
                            {doctor.user_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center lg:text-left">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {doctor.user_name}
                          </h3>
                          <p className="text-[#1656a4] font-semibold text-base sm:text-lg">
                            {doctor.specialty}
                          </p>
                          <p className="text-gray-600 mb-3">
                            {doctor.experience} experience
                          </p>

                          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">4.8</span>
                              <span className="text-gray-500 text-sm">
                                (150+ reviews)
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {doctor.is_profile_complete
                                ? "Available"
                                : "Profile Incomplete"}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              Available days:{" "}
                              {doctor.available_days?.join(", ") ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        <div className="text-center lg:text-right">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <p className="text-green-800 font-medium text-sm">
                              Consultation Fee
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">
                              ₹{doctor.consultation_fee}
                            </p>
                          </div>
                          <Link href={`/customer/book/${doctor.id}`}>
                            <Button
                              className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90 h-10 sm:h-12 text-sm sm:text-lg font-semibold shadow-lg"
                              disabled={!doctor.is_profile_complete}
                            >
                              {doctor.is_profile_complete
                                ? "Book Now"
                                : "Not Available"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="by-date" className="space-y-4 sm:space-y-6">
            <Card className="border-2 border-[#1656a4]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  Select Date to View Available Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {availableDates.map((date) => {
                    const doctorsCount = getDoctorsByDate(date.date).length;
                    return (
                      <Button
                        key={date.date}
                        variant={
                          selectedDate === date.date ? "default" : "outline"
                        }
                        className={`h-auto p-3 sm:p-4 flex-col ${
                          selectedDate === date.date
                            ? "bg-[#1656a4] hover:bg-[#1656a4]/90 shadow-lg"
                            : "border-2 hover:border-[#1656a4] hover:bg-[#1656a4]/5"
                        }`}
                        onClick={() => setSelectedDate(date.date)}
                      >
                        <div className="font-semibold text-sm">
                          {date.label}
                        </div>
                        <div className="text-xs opacity-80">
                          {doctorsCount} doctor{doctorsCount !== 1 ? "s" : ""}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selectedDate && (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Doctors Available on{" "}
                  {availableDates.find((d) => d.date === selectedDate)?.label}
                </h2>

                <div className="grid gap-4">
                  {getDoctorsByDate(selectedDate).map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="hover:shadow-lg transition-shadow border-2 hover:border-[#1656a4]/30"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-[#1656a4]/20">
                              <AvatarFallback className="bg-[#1656a4] text-white">
                                {doctor.user_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold">
                                {doctor.user_name}
                              </h3>
                              <p className="text-[#1656a4] font-medium">
                                {doctor.specialty}
                              </p>
                              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">4.8</span>
                                <span className="text-sm text-gray-500">
                                  • {doctor.experience}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600 mb-2">
                              ₹{doctor.consultation_fee}
                            </p>
                            <Link href={`/customer/book/${doctor.id}`}>
                              <Button
                                className="bg-[#1656a4] hover:bg-[#1656a4]/90"
                                disabled={!doctor.is_profile_complete}
                              >
                                {doctor.is_profile_complete
                                  ? "Book Appointment"
                                  : "Not Available"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
