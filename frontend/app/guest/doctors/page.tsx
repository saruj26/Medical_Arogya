"use client";

import { useState, useEffect } from "react";
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
  Search,
  MapPin,
  Award,
  Shield,
  Zap,
} from "lucide-react";
import api from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MonthCalendar from "@/components/booking/month-calendar";

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
  avg_rating?: number;
  review_count?: number;
}

export default function BrowseDoctors() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Run once on mount. Fetch doctors whether or not a token exists.
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (storedToken) headers.Authorization = `Bearer ${storedToken}`;

      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers,
      });

      // If unauthorized, clear auth but allow guests to continue viewing public data.
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
      }

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
      } else {
        const text = await response.text();
        const msg = `Failed to fetch doctors: ${response.status} ${text}`;
        console.warn(msg);
        setError(msg);
      }
    } catch (error) {
      const msg = (error as Error)?.message || String(error);
      console.error("Error fetching doctors:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = doctors;

    if (selectedDate) {
      filtered = getDoctorsByDate(selectedDate);
    }

    if (selectedSpecialty && selectedSpecialty !== "All Specialties") {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty
      );
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((doctor) => {
        const name = (doctor.user_name || "").toLowerCase();
        const spec = (doctor.specialty || "").toLowerCase();
        return name.includes(q) || spec.includes(q);
      });
    }

    filtered = filtered.filter((doctor) => doctor.is_profile_complete);
    setFilteredDoctors(filtered);
  }, [selectedDate, selectedSpecialty, doctors, searchQuery]);

  const normalizeDay = (day: string) => day.trim().toLowerCase();

  const weekdayForISO = (iso: string) =>
    new Date(iso)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

  const getDoctorsByDate = (dateISO: string) => {
    if (!dateISO) return doctors;
    const weekday = weekdayForISO(dateISO);
    return doctors.filter(
      (d) =>
        d.is_profile_complete &&
        (d.available_days || []).some((day) => normalizeDay(day) === weekday)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <Stethoscope className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading expert doctors...</p>
        </div>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <Card className="max-w-lg w-full border-0 shadow-xl text-center py-8 bg-white/90">
          <CardContent>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Unable to load doctors
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => fetchDoctors()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Retry
              </Button>
              <Link href="/" className="text-sm text-gray-600 hover:underline">
                Go Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Header userType={token ? "customer" : "guest"} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            {doctors.length}+ Expert Doctors Available
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-900 to-cyan-800 bg-clip-text text-transparent">
            Find Your Perfect Doctor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with certified healthcare professionals for personalized
            medical care.
          </p>
        </div>

        <Tabs defaultValue="by-specialty" className="space-y-8">
          {/* Enhanced Tabs */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-gray-100/80 rounded-2xl">
              <TabsTrigger
                value="by-specialty"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 transition-all"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                By Specialty
              </TabsTrigger>
              <TabsTrigger
                value="by-date"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 transition-all"
              >
                <Calendar className="w-4 h-4 mr-2" />
                By Date
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="by-specialty" className="space-y-8">
            {/* Enhanced Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Medical Specialty
                    </label>
                    <Select
                      value={selectedSpecialty}
                      onValueChange={setSelectedSpecialty}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-xl">
                        {specialties.map((specialty) => (
                          <SelectItem
                            key={specialty}
                            value={specialty}
                            className="rounded-lg hover:bg-blue-50 focus:bg-blue-50"
                          >
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Search Doctors
                    </label>
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or specialty..."
                        className="h-12 border-2 border-gray-200 rounded-xl pl-10 pr-4 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDate("");
                        setSelectedSpecialty("All Specialties");
                        setSearchQuery("");
                      }}
                      className="h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Doctors Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Doctors
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredDoctors.length} specialist
                    {filteredDoctors.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className="text-sm bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                  Verified Professionals
                </Badge>
              </div>

              {filteredDoctors.length === 0 ? (
                <Card className="border-0 shadow-xl text-center py-16 bg-white/80 backdrop-blur-sm">
                  <CardContent>
                    <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Doctors Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search criteria or browse all
                      specialties.
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedDate("");
                        setSelectedSpecialty("All Specialties");
                        setSearchQuery("");
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Show All Doctors
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] bg-white/90 backdrop-blur-sm overflow-hidden"
                    >
                      <CardContent className="p-0">
                        {/* Doctor Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-4 border-blue-100 group-hover:border-blue-200 transition-colors shadow-lg">
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-semibold text-lg">
                                {doctor.user_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {doctor.user_name}
                              </h3>
                              <p className="text-blue-700 font-semibold text-sm">
                                {doctor.specialty}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Award className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-gray-600">
                                  {doctor.qualification}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Doctor Details */}
                        <div className="px-6 pb-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-gray-900">
                                {(doctor.avg_rating ?? 0).toFixed(1)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                ({doctor.review_count ?? 0} reviews)
                              </span>
                            </div>
                            <Badge
                              className={
                                doctor.is_profile_complete
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs"
                              }
                            >
                              {doctor.is_profile_complete
                                ? "Available"
                                : "Not Available"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{doctor.experience} experience</span>
                          </div>

                          <div className="text-sm text-gray-600 line-clamp-2">
                            {doctor.bio ||
                              "Dedicated healthcare professional committed to providing excellent patient care."}
                          </div>
                        </div>

                        {/* Action Section */}
                        <div className="bg-gray-50/80 p-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Consultation Fee
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                Rs {doctor.consultation_fee}
                              </p>
                            </div>
                            <Link
                              href={
                                token ? `/customer/book/${doctor.id}` : "/auth"
                              }
                              className="flex-1 ml-4"
                            >
                              <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold shadow-lg transition-all duration-300 hover:shadow-blue-200"
                                disabled={!doctor.is_profile_complete}
                              >
                                {doctor.is_profile_complete
                                  ? "Book Appointment"
                                  : "Not Available"}
                              </Button>
                            </Link>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>
                              Available:{" "}
                              {doctor.available_days?.join(", ") ||
                                "Flexible schedule"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="by-date" className="space-y-8">
            {/* Date Selection Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Select Your Preferred Date
                  </h3>
                  <p className="text-gray-600">
                    Choose a date to see available doctors for your appointment
                  </p>
                </div>

                <MonthCalendar
                  selectedDate={selectedDate}
                  onSelectDate={(d) => setSelectedDate(d)}
                />
              </CardContent>
            </Card>

            {selectedDate && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available on{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <p className="text-gray-600">
                    {getDoctorsByDate(selectedDate).length} doctor
                    {getDoctorsByDate(selectedDate).length !== 1
                      ? "s"
                      : ""}{" "}
                    available
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getDoctorsByDate(selectedDate).map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] bg-white/90 backdrop-blur-sm overflow-hidden"
                    >
                      <CardContent className="p-0">
                        {/* Doctor Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-4 border-blue-100 group-hover:border-blue-200 transition-colors shadow-lg">
                              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-semibold text-lg">
                                {doctor.user_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {doctor.user_name}
                              </h3>
                              <p className="text-blue-700 font-semibold text-sm">
                                {doctor.specialty}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Award className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-gray-600">
                                  {doctor.qualification}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Doctor Details */}
                        <div className="px-6 pb-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-gray-900">
                                {(doctor.avg_rating ?? 0).toFixed(1)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                ({doctor.review_count ?? 0} reviews)
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                              Available
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{doctor.experience} experience</span>
                          </div>
                        </div>

                        {/* Action Section */}
                        <div className="bg-gray-50/80 p-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Consultation Fee
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                Rs {doctor.consultation_fee}
                              </p>
                            </div>
                            <Link
                              href={
                                token ? `/customer/book/${doctor.id}` : "/auth"
                              }
                              className="flex-1 ml-4"
                            >
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-semibold shadow-lg transition-all duration-300 hover:shadow-blue-200">
                                Book Appointment
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

      <Footer />
    </div>
  );
}
