// app/customer/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  User,
  Stethoscope,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Award,
  Zap,
  TrendingUp,
  CheckCircle,
  Users,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";

export default function CustomerDashboard() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const doctorsScrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (role !== "customer" || !token) {
      router.push("/");
      return;
    }

    fetchTopDoctors(token);
  }, [router]);

  // Auto-scroll functionality for doctors
  useEffect(() => {
    if (!autoScroll || doctors.length === 0) return;

    const scrollDoctors = () => {
      const el = doctorsScrollRef.current;
      if (!el) return;

      const scrollAmount = 300;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    autoScrollRef.current = setInterval(scrollDoctors, 3000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [autoScroll, doctors.length]);

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  const scrollDoctors = (dir: "left" | "right") => {
    const el = doctorsScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const fetchTopDoctors = async (token: string) => {
    try {
      setDoctorsLoading(true);
      const res = await fetch(api(`/api/doctor/doctors/?limit=12`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setDoctors([]);
        return;
      }

      const json = await res.json();
      setDoctors(json.doctors || json.results || []);
    } catch (e) {
      console.error("Failed to fetch doctors for dashboard", e);
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    setContactForm({ name: "", email: "", subject: "", message: "" });
    await Swal.fire({
      icon: "success",
      title: "Message sent",
      text: "Thank you for your message! We'll get back to you soon.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Patient Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Your health, our priority
                  </p>
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

      <div className="container mx-auto py-6">
        {/* Hero Banner */}
        <section className="mb-12 relative overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-[#1656a4] via-[#0ea5a4] to-[#0c7cba] p-8 sm:p-12 rounded-2xl text-white shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8 text-yellow-300" />
                  <span className="text-lg font-semibold text-blue-100">
                    Trusted Healthcare Platform
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                  Quality Healthcare <br />
                  <span className="text-cyan-200">
                    Made Simple & Accessible
                  </span>
                </h2>
                <p className="text-lg text-blue-100 mb-6 max-w-2xl leading-relaxed">
                  Connect with top-rated doctors, book appointments instantly,
                  and manage your health journey seamlessly. Your well-being is
                  just a click away.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <Link href="/customer/doctors">
                    <Button className="bg-white text-[#1656a4] hover:bg-blue-50 font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      Find Doctors
                    </Button>
                  </Link>
                  <Link href="/customer/appointment">
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      View Appointments
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 mt-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-300" />
                    <span className="text-sm">Instant Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-300" />
                    <span className="text-sm">Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-300" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="w-full h-full bg-white/20 rounded-2xl p-4 flex items-center justify-center">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yfGVufDB8fDB8fHww"
                    alt="Doctors illustration"
                    className="w-full h-auto rounded-2xl object-cover shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section with Interactive Features */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Key Metrics */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white lg:col-span-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-cyan-200" />
                  <h3 className="text-xl font-bold">Platform Performance</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-cyan-100">Doctors</span>
                    </div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs text-cyan-200 mt-1">Verified</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <User className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-cyan-100">Patients</span>
                    </div>
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-xs text-cyan-200 mt-1">
                      Happy Users
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-cyan-100">Bookings</span>
                    </div>
                    <div className="text-2xl font-bold">15K+</div>
                    <div className="text-xs text-cyan-200 mt-1">Completed</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-cyan-100">
                        Satisfaction
                      </span>
                    </div>
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs text-cyan-200 mt-1">Rating</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-cyan-500/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyan-200">
                      Active Consultations Today
                    </span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="w-full bg-cyan-700/30 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Quick Actions */}
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Quick Actions
                  </h3>
                </div>

                <div className="space-y-4">
                  <Link href="/customer/doctors">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 p-4 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          Find Doctors
                        </div>
                        <div className="text-sm text-gray-600">
                          Book appointment with specialists
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors" />
                    </Button>
                  </Link>

                  <Link href="/customer/appointment">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 p-4 h-auto border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          My Appointments
                        </div>
                        <div className="text-sm text-gray-600">
                          View and manage bookings
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-green-600 transition-colors" />
                    </Button>
                  </Link>

                  <Link href="/customer/medical-records">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 p-4 h-auto border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          Medical Records
                        </div>
                        <div className="text-sm text-gray-600">
                          Access your health history
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-600 transition-colors" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Premium Feature:</span>{" "}
                      Get instant e-prescriptions after consultation
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Book Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-cyan-800 bg-clip-text text-transparent mb-3">
              How to Book an Appointment
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Follow these simple steps to book your consultation with our
              expert doctors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Search Doctors
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Filter by specialty, location, or availability. Read reviews
                  and check ratings to find the perfect doctor for your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-white hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Choose Time Slot
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Select a convenient date and time for your consultation.
                  Real-time availability ensures you get your preferred slot.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-white hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Confirm & Pay
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Securely confirm your booking and make payment. Receive
                  instant confirmation and e-prescription after consultation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recommended Doctors with Auto Scroll */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Recommended Doctors
              </h3>
              <p className="text-gray-600">
                Top-rated healthcare professionals available for consultation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAutoScroll}
                aria-label={
                  autoScroll ? "Pause auto-scroll" : "Start auto-scroll"
                }
                className="flex items-center gap-2"
              >
                {autoScroll ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {autoScroll ? "Pause" : "Play"}
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollDoctors("left")}
                  aria-label="Scroll doctors left"
                  className="h-9 w-9"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollDoctors("right")}
                  aria-label="Scroll doctors right"
                  className="h-9 w-9"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={doctorsScrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {doctorsLoading ? (
              <div className="flex items-center justify-center w-full py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Loading doctors...</span>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center w-full py-12 text-gray-600">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No doctors available at the moment.</p>
              </div>
            ) : (
              doctors.map((doctor, index) => (
                <Card
                  key={doctor.id}
                  style={{ flex: "0 0 calc(33.333% - 1rem)" }}
                  className={`bg-white/95 backdrop-blur-sm border-0 shadow-xl transition-transform duration-400 ease-in-out transform-gpu flex-shrink-0 group hover:scale-105 hover:rotate-0 ${
                    index % 3 === 0
                      ? "rotate-3"
                      : index % 3 === 1
                      ? "-rotate-2"
                      : "rotate-1"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20 rounded-2xl shadow-lg ring-1 ring-white/20">
                          {doctor.image ? (
                            <AvatarImage
                              src={doctor.image}
                              alt={doctor.user_name || doctor.name}
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-lg">
                              {(doctor.user_name || doctor.name || "")
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("") || "Dr"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-lg truncate">
                          Dr. {doctor.user_name || doctor.name}
                        </h4>
                        <p className="text-cyan-600 font-medium truncate text-sm">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const rating = Math.round(
                              doctor.avg_rating || 0 || 0
                            );
                            return (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          })}
                          <span className="text-xs text-gray-500 ml-1">
                            ({(doctor.avg_rating ?? 0).toFixed(1)})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>Colombo, Sri Lanka</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Available Today</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {doctor.bio ||
                        doctor.about ||
                        "Experienced healthcare professional dedicated to providing quality care."}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          Rs {doctor.consultation_fee ?? doctor.fee ?? "1,500"}
                        </div>
                        <div className="text-xs text-gray-500">
                          Consultation Fee
                        </div>
                      </div>
                      <Link
                        href={`/customer/book/${doctor.id}`}
                        aria-label={`Book appointment with Dr. ${
                          doctor.user_name || doctor.name
                        }`}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Contact & Support Section */}
        <section className="mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Contact Information */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our support team is here to help you with any questions
                    about appointments, doctors, or technical issues. We're
                    available 24/7 to assist you.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Call Us
                        </div>
                        <div className="text-gray-600">+94 21 343 3433</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Email Us
                        </div>
                        <div className="text-gray-600">support@arogya.com</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Visit Us
                        </div>
                        <div className="text-gray-600">
                          123 Nelliyady, Karaveddy
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">
                    Send us a Message
                  </h4>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your name"
                          className="border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your@email.com"
                          className="border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="What is this regarding?"
                        className="border-gray-300 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="Tell us how we can help you..."
                        rows={4}
                        className="border-gray-300 focus:border-blue-500 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
