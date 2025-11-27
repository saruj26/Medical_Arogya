"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Calendar,
  Clock,
  Shield,
  Stethoscope,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Video,
  MessageCircle,
} from "lucide-react";

function useAuthModal() {
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

  return { authModal, openAuthModal, closeAuthModal };
}


export default function HomePage() {
  const { authModal, openAuthModal, closeAuthModal } = useAuthModal();

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dentistry",
    "Ophthalmology",
    "Gynecology",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header userType="guest" />

      {/* Premium Hero Section with Hospital Banner */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Premium Background Banner Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1656a4]/80 via-[#1656a4]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Premium Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg text-white px-5 py-3 rounded-full text-sm font-semibold mb-8 border border-white/30 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Premium Healthcare Experience</span>
              <Award className="w-4 h-4 ml-2" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Excellence in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Medical Care
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed font-light">
              Where cutting-edge technology meets compassionate care. Experience
              personalized healthcare with our team of renowned specialists in a
              state-of-the-art medical facility.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
             
                <Button
                  onClick={() => openAuthModal("login")}
                  size="lg"
                  className="bg-white text-[#1656a4] hover:bg-white/95 px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0 rounded-2xl"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Book Premium Consultation
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>          
              <Link href="/guest/doctors">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#1656a4] px-10 py-6 text-lg font-semibold bg-transparent backdrop-blur-sm transition-all duration-300 transform hover:scale-105 rounded-2xl"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Meet Our Specialists
                </Button>
              </Link>
            </div>

            {/* Premium Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl">
              {[
                { icon: Award, label: "JCI Accredited", value: "Quality" },
                { icon: ShieldCheck, label: "ISO Certified", value: "Safety" },
                { icon: Star, label: "5-Star Rating", value: "Excellence" },
                { icon: Users, label: "50+ Specialists", value: "Expertise" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-white text-center bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                  <div className="text-sm font-semibold text-blue-100">
                    {item.value}
                  </div>
                  <div className="text-xs text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/80 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-white/80 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section
        id="services"
        className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-[#1656a4]/10 text-[#1656a4] px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-[#1656a4]/20">
              <Heart className="w-5 h-5" />
              Premium Healthcare Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Unparalleled Medical Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of premium healthcare services
              designed to provide you with the best possible medical care
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Priority Appointments",
                description:
                  "Get immediate access to our top specialists with minimal waiting time",
                features: [
                  "Same-day appointments",
                  "Flexible scheduling",
                  "Priority access",
                ],
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Video,
                title: "Virtual Consultations",
                description:
                  "Premium telehealth services with high-definition video calls",
                features: [
                  "HD video calls",
                  "Secure platform",
                  "Digital prescriptions",
                ],
                color: "from-green-500 to-green-600",
              },
              {
                icon: FileText,
                title: "Digital Health Records",
                description:
                  "Comprehensive electronic health records accessible anytime, anywhere",
                features: [
                  "Lifetime access",
                  "Real-time updates",
                  "Secure sharing",
                ],
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Users,
                title: "Specialist Team",
                description:
                  "Collaborative care from our multidisciplinary team of experts",
                features: [
                  "Multiple specialists",
                  "Team approach",
                  "Comprehensive care",
                ],
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: ShieldCheck,
                title: "Advanced Security",
                description:
                  "Military-grade encryption for your sensitive health information",
                features: [
                  "End-to-end encryption",
                  "HIPAA compliant",
                  "Regular audits",
                ],
                color: "from-red-500 to-red-600",
              },
              {
                icon: MessageCircle,
                title: "24/7 Support",
                description:
                  "Round-the-clock medical support and consultation services",
                features: [
                  "24/7 helpline",
                  "Quick responses",
                  "Emergency support",
                ],
                color: "from-cyan-500 to-cyan-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:border-[#1656a4]/30 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 bg-white group overflow-hidden"
              >
                <CardHeader className="text-center p-0">
                  <div
                    className={`h-2 bg-gradient-to-r ${feature.color}`}
                  ></div>
                  <div className="p-8">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl mb-4 text-gray-900 font-bold">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed text-base mb-6">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 pt-0">
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      {/* Elegant Stats Section */}
      {/* Elegant Stats Section with Icons */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              Excellence in Healthcare
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Setting New Standards
            </h2>
            <p className="text-blue-100 text-base max-w-lg mx-auto leading-relaxed">
              Our commitment to excellence is reflected in outstanding
              performance metrics.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                number: "25K+",
                label: "Treatments",
                description: "Successful",
                icon: "🎯",
                color: "text-blue-300",
              },
              {
                number: "99.2%",
                label: "Satisfaction",
                description: "Patient Rating",
                icon: "⭐",
                color: "text-amber-300",
              },
              {
                number: "150+",
                label: "Experts",
                description: "Medical Specialists",
                icon: "👨‍⚕️",
                color: "text-emerald-300",
              },
              {
                number: "24/7",
                label: "Care",
                description: "Emergency Available",
                icon: "🚑",
                color: "text-red-300",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-md rounded-xl p-6 min-h-[180px] hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105"
              >
                {/* Content */}
                <div className="text-center space-y-3">
                  <div className="text-2xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-2xl font-bold text-white leading-tight">
                    {stat.number}
                  </div>
                  <div className="space-y-1">
                    <div className="text-blue-100 font-semibold text-sm leading-tight">
                      {stat.label}
                    </div>
                    <div className="text-blue-200 text-xs opacity-80">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Medical Specialties Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Medical Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access world-class care across a wide range of medical specialties
              with our team of board-certified physicians.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center border border-gray-200 hover:border-[#1656a4]/50 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#1656a4]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1656a4] transition-colors duration-300">
                  <Stethoscope className="w-6 h-6 text-[#1656a4] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#1656a4] transition-colors duration-300">
                  {specialty}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-[#1656a4] to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your Journey to Better Health
            </h2>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Experience the difference of premium healthcare. Schedule your
              first consultation today and receive a comprehensive health
              assessment from our expert team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/auth?mode=login">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-white/95 px-12 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0 rounded-2xl"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Schedule Premium Consultation
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-6 h-6 text-blue-200 mb-3" />
                <div className="text-blue-100 text-sm">Emergency Line</div>
                <div className="text-white font-semibold">
                  3433
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-6 h-6 text-blue-200 mb-3" />
                <div className="text-blue-100 text-sm">Email Us</div>
                <div className="text-white font-semibold">care@arogya.com</div>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 text-blue-200 mb-3" />
                <div className="text-blue-100 text-sm">Visit Us</div>
                <div className="text-white font-semibold">24/7 Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
      />
      <Footer />
    </div>
  );
}
