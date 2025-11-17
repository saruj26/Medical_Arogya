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
  Filter,
  Search,
  MapPin,
  Award,
  Zap,
  Heart,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import api from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MonthCalendar from "@/components/booking/month-calendar";

interface Doctor {
  id: number;
  doctor_id: string;
  user_name: string;
  profile_image?: string | null;
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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    "All Specialties",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "General Medicine",
    "Dentistry",
    "Ophthalmology",
    "Gynecology",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setError(null);

      const response = await fetch(api(`/api/doctor/doctors/`), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
      } else {
        const text = await response.text();
        setError(`Unable to load doctors at the moment. Please try again.`);
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
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

    if (searchQuery.trim() !== "") {
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



  if ( error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="max-w-lg w-full border-0 shadow-2xl text-center py-12 bg-white/90 backdrop-blur-sm rounded-3xl">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Unable to load doctors
            </h3>
            <p className="text-gray-600">{error}</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={fetchDoctors}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-xl"
              >
                Try Again
              </Button>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Go Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header userType="guest" />

      {/* Enhanced Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-blue-900 to-cyan-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-white/30">
              <Sparkles className="w-4 h-4" />
              {doctors.length}+ Expert Doctors Available
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Healthcare Partner
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Connect with certified healthcare professionals who are dedicated
              to your well-being. Book appointments with top-rated doctors in
              just a few clicks.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        {/* Main Content Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden mb-12">
          <CardContent className="p-0">
            <Tabs defaultValue="by-specialty" className="w-full">
              {/* Enhanced Tabs Navigation */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b">
                <div className="flex justify-center px-6 pt-6">
                  <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border">
                    <TabsTrigger
                      value="by-specialty"
                      className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-semibold"
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Browse Specialties
                    </TabsTrigger>
                    <TabsTrigger
                      value="by-date"
                      className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 font-semibold"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Pick a Date
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Enhanced Filters */}
                <div className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Medical Specialty
                      </label>
                      <Select
                        value={selectedSpecialty}
                        onValueChange={setSelectedSpecialty}
                      >
                        <SelectTrigger className="h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white/80 backdrop-blur-sm">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-2xl bg-white">
                          {specialties.map((specialty) => (
                            <SelectItem
                              key={specialty}
                              value={specialty}
                              className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 py-3"
                            >
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search Doctors
                      </label>
                      <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by doctor name or specialty..."
                          className="h-14 border-2 border-gray-200 rounded-xl pl-12 pr-4 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 backdrop-blur-sm"
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
                        className="h-14 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl w-full font-semibold"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <TabsContent value="by-specialty" className="p-6 space-y-8">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Available Doctors
                    </h2>
                    <p className="text-gray-600 mt-2 text-lg">
                      {filteredDoctors.length} specialist
                      {filteredDoctors.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-sm px-4 py-2 rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Professionals
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm px-4 py-2 rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      {doctors.length} Total Doctors
                    </Badge>
                  </div>
                </div>

                {filteredDoctors.length === 0 ? (
                  <Card className="border-0 shadow-xl text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-3xl">
                    <CardContent className="space-y-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Stethoscope className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        No Doctors Found
                      </h3>
                      <p className="text-gray-600 text-lg max-w-md mx-auto">
                        Try adjusting your search criteria or browse all
                        available specialties.
                      </p>
                      <Button
                        onClick={() => {
                          setSelectedDate("");
                          setSelectedSpecialty("All Specialties");
                          setSearchQuery("");
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl text-lg"
                      >
                        Show All Doctors
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden rounded-3xl"
                      >
                        <CardContent className="p-0">
                          {/* Doctor Header with Gradient */}
                          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-20 h-20 border-4 border-white/30 group-hover:border-white/50 transition-colors shadow-2xl">
                                {doctor.profile_image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <AvatarImage
                                    src={doctor.profile_image}
                                    alt={doctor.user_name}
                                    className="object-cover"
                                  />
                                ) : (
                                  <AvatarFallback className="bg-white/20 text-white font-bold text-xl">
                                    {doctor.user_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                )}
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold truncate mb-1">
                                  {doctor.user_name}
                                </h3>
                                <p className="text-blue-100 font-semibold text-sm mb-2">
                                  {doctor.specialty}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-amber-300" />
                                  <span className="text-sm text-white/90">
                                    {doctor.qualification}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Doctor Details */}
                          <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold text-gray-900 text-lg">
                                  {(doctor.avg_rating ?? 0).toFixed(1)}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  ({doctor.review_count ?? 0} reviews)
                                </span>
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-sm">
                                Available Today
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {doctor.experience} experience
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              {doctor.bio ||
                                "Dedicated healthcare professional committed to providing excellent patient care with personalized attention."}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>
                                Available:{" "}
                                {doctor.available_days?.join(", ") ||
                                  "Flexible schedule"}
                              </span>
                            </div>
                          </div>

                          {/* Action Section */}
                          <div className="bg-gray-50/80 p-6 border-t">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">
                                  Consultation Fee
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                  Rs {doctor.consultation_fee}
                                </p>
                              </div>
                              <Link
                                href="/auth?mode=register"
                                className="flex-1 ml-4"
                              >
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-12 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl">
                                  Book Appointment
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="by-date" className="p-6 space-y-8">
                {/* Date Selection Section */}
                <div className="text-center mb-8">
                  <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Select Your Preferred Date
                  </h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Choose a date to see which doctors are available for your
                    appointment. We'll show you all specialists with open slots
                    on your selected day.
                  </p>
                </div>

                <MonthCalendar
                  selectedDate={selectedDate}
                  onSelectDate={(d) => setSelectedDate(d)}
                />

                {selectedDate && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Available on{" "}
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {getDoctorsByDate(selectedDate).length} doctor
                        {getDoctorsByDate(selectedDate).length !== 1
                          ? "s"
                          : ""}{" "}
                        available for appointments
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                      {getDoctorsByDate(selectedDate).map((doctor) => (
                        <Card
                          key={doctor.id}
                          className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden rounded-3xl"
                        >
                          <CardContent className="p-0">
                            {/* Doctor Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-4 border-white/30 group-hover:border-white/50 transition-colors">
                                  {doctor.profile_image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <AvatarImage
                                      src={doctor.profile_image}
                                      alt={doctor.user_name}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                                      {doctor.user_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  )}
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-bold truncate">
                                    {doctor.user_name}
                                  </h3>
                                  <p className="text-blue-100 text-sm">
                                    {doctor.specialty}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Doctor Details */}
                            <div className="p-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                  <span className="font-semibold text-gray-900">
                                    {(doctor.avg_rating ?? 0).toFixed(1)}
                                  </span>
                                </div>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                                  Available
                                </Badge>
                              </div>

                              <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                  Consultation Fee
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                  Rs {doctor.consultation_fee}
                                </p>
                              </div>
                            </div>

                            {/* Action Section */}
                            <div className="bg-gray-50/80 p-4 border-t">
                              <Link
                                href="/auth?mode=register"
                                className="block"
                              >
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-semibold shadow-lg transition-all duration-300 rounded-xl">
                                  Book This Slot
                                  <Calendar className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Book Your Appointment?
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Join thousands of satisfied patients who trust our healthcare
                platform. Create an account now to book appointments and manage
                your health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?mode=register">
                  <Button className="bg-white text-blue-600 hover:bg-white/95 px-8 py-3 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
