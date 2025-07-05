"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthModal } from "@/components/auth-modal";
import {
  Calendar,
  Clock,
  Shield,
  Stethoscope,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "login" | "register";
  }>({
    isOpen: false,
    mode: "login",
  });

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: "login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1656a4] to-[#1656a4]/80 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold text-[#1656a4]">
                Arogya
              </span>
              <div className="text-xs text-gray-500 -mt-1 hidden sm:block">
                Professional Healthcare
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="#services"
              className="text-gray-600 hover:text-[#1656a4] transition-all duration-200 font-medium"
            >
              Services
            </Link>
            <Link
              href="/guest/doctors"
              className="text-gray-600 hover:text-[#1656a4] transition-all duration-200 font-medium"
            >
              Doctors
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#1656a4] transition-all duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-[#1656a4] transition-all duration-200 font-medium"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAuthModal("login")}
              className="border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent transition-all duration-200 font-semibold text-xs sm:text-sm px-2 sm:px-4"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              onClick={() => openAuthModal("register")}
              className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 hover:from-[#1656a4]/90 hover:to-[#1656a4] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-xs sm:text-sm px-2 sm:px-4"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Professional Healthcare Platform
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Your Health, Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1656a4] to-blue-600">
              Priority
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Book appointments with qualified doctors, manage your health
            records, and get prescriptions online. Professional healthcare at
            your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button
              size="lg"
              onClick={() => openAuthModal("register")}
              className="w-full sm:w-auto bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 hover:from-[#1656a4]/90 hover:to-[#1656a4] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Book Appointment Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Link href="/guest/doctors">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                View Our Doctors
              </Button>
            </Link>
          </div>

          <div className="mt-8 sm:mt-12 text-xs sm:text-sm text-gray-500 px-4">
            ✨ Trusted by 1,000+ patients • 100+ expert doctors • 24/7 support
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 px-4 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Why Choose Arogya
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide modern technology and experienced professionals to
              deliver exceptional healthcare experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Easy Booking",
                description:
                  "Book appointments with your preferred doctors in just a few clicks",
                color: "blue",
              },
              {
                icon: Clock,
                title: "Flexible Timing",
                description:
                  "Choose from available time slots that fit your schedule",
                color: "green",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your health data is protected with enterprise-grade security",
                color: "purple",
              },
              {
                icon: Users,
                title: "Expert Doctors",
                description:
                  "Qualified and experienced doctors across various specialties",
                color: "orange",
              },
              {
                icon: Heart,
                title: "Health Records",
                description:
                  "Maintain digital health records and prescription history",
                color: "red",
              },
              {
                icon: Stethoscope,
                title: "Online Prescriptions",
                description:
                  "Get digital prescriptions and medical advice online",
                color: "indigo",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-[#1656a4]/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center p-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-50`}
                  >
                    <feature.icon
                      className={`w-8 h-8 text-${feature.color}-600`}
                    />
                  </div>
                  <CardTitle className="text-xl mb-4">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg">
              Join our growing community of satisfied patients
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Happy Patients", icon: "👥" },
              { number: "100+", label: "Expert Doctors", icon: "👨‍⚕️" },
              { number: "24/7", label: "Support Available", icon: "🕐" },
              { number: "₹500", label: "Consultation Fee", icon: "💰" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Join thousands of satisfied patients who trust Arogya for their
              healthcare needs. Book your first appointment today and experience
              the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => openAuthModal("register")}
                className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 hover:from-[#1656a4]/90 hover:to-[#1656a4] px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openAuthModal("login")}
                className="border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Already Have Account?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-[#1656a4]/80 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">Arogya</span>
                  <div className="text-xs text-gray-400 -mt-1">
                    Professional Healthcare
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Professional healthcare services with modern technology and
                experienced doctors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  General Consultation
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Specialist Care
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Health Checkups
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Online Prescriptions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guest/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Our Doctors
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <span>📞</span> +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span> info@Arogya.com
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> 123 Health Street, Medical City
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Arogya. All rights reserved. | Professional Healthcare
              Platform
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </div>
  );
}
