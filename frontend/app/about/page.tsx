"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  Stethoscope,
  Award,
  Users,
  Heart,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  Globe,
  Zap,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header userType="guest" />

      {/* Hero Section with Split Layout */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-[#1656a4] px-6 py-3 rounded-full text-sm font-semibold border border-[#1656a4]/20 shadow-lg">
                <Sparkles className="w-4 h-4" />
                About Arogya Healthcare
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Redefining{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1656a4] to-cyan-600">
                  Healthcare
                </span>{" "}
                Excellence
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Where cutting-edge technology meets compassionate care. We're
                transforming the healthcare experience through innovation,
                expertise, and unwavering commitment to patient wellbeing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/guest/doctors">
                  <Button className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
                    Find a Doctor
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg font-semibold border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white rounded-2xl transition-all duration-300"
                  onClick={() => openAuthModal("register")}
                >
                  Join Our Community
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Modern Healthcare Facility"
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                {/* Floating Stats */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                      <div className="text-2xl font-bold text-[#1656a4]">
                        100+
                      </div>
                      <div className="text-xs text-gray-600">
                        Expert Doctors
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                      <div className="text-2xl font-bold text-[#1656a4]">
                        10K+
                      </div>
                      <div className="text-xs text-gray-600">
                        Patients Served
                      </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                      <div className="text-2xl font-bold text-[#1656a4]">
                        24/7
                      </div>
                      <div className="text-xs text-gray-600">
                        Care Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Innovative Layout */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              Our Purpose & Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Building the Future of Healthcare
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Mission with Image */}
            <div className="space-y-8">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-[#1656a4] to-blue-600 text-white rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Heart className="w-7 h-7" />
                    </div>
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-blue-100 text-lg leading-relaxed">
                    To revolutionize healthcare delivery by making quality
                    medical services accessible, affordable, and personalized
                    for everyone through innovative technology and compassionate
                    care.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                    <span className="text-sm text-blue-200">
                      Driving Change
                    </span>
                    <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Supporting Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://blog.pepid.com/wp-content/uploads/2024/07/6.png"
                  alt="Compassionate Care"
                  loading="lazy"
                  onError={(e) => {
                    // replace broken remote image with a lightweight inline SVG placeholder
                    // encoded '#' as %23 for correct data URL
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    e.currentTarget.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='%23e6eef8'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231655a4' font-family='Arial,Helvetica,sans-serif' font-size='24'>Image unavailable</text></svg>";
                  }}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Vision with Image */}
            <div className="space-y-8">
              {/* Supporting Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
                  alt="Future Healthcare"
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Eye className="w-7 h-7" />
                    </div>
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-purple-100 text-lg leading-relaxed">
                    To create a world where exceptional healthcare is seamlessly
                    integrated into daily life, empowering individuals to
                    achieve optimal health through personalized, proactive, and
                    accessible medical solutions.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                    <span className="text-sm text-purple-200">
                      Shaping Tomorrow
                    </span>
                    <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values with Interactive Cards */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Our Core Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Pillars of Our Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and
              every service we provide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassionate Care",
                description:
                  "Every patient receives personalized attention with empathy and understanding.",
                color: "from-red-500 to-pink-500",
                bgColor: "bg-red-50",
                textColor: "text-red-600",
              },
              {
                icon: Award,
                title: "Clinical Excellence",
                description:
                  "Highest medical standards with continuous learning and improvement.",
                color: "from-amber-500 to-orange-500",
                bgColor: "bg-amber-50",
                textColor: "text-amber-600",
              },
              {
                icon: Shield,
                title: "Trust & Integrity",
                description:
                  "Complete transparency and ethical practices in all interactions.",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50",
                textColor: "text-green-600",
              },
              {
                icon: Users,
                title: "Collaborative Approach",
                description:
                  "Team-based care that puts patient wellbeing at the center.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
                textColor: "text-blue-600",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 group cursor-pointer bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-0">
                  <div
                    className={`p-8 text-center ${value.bgColor} group-hover:bg-white transition-colors duration-300`}
                  >
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <value.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Split Layout with Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Why Arogya Stands Out
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Experience Healthcare Reimagined
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  We combine medical expertise with cutting-edge technology to
                  deliver healthcare that's not just effective, but truly
                  transformative.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: CheckCircle,
                    title: "Board-Certified Specialists",
                    description:
                      "All our doctors are verified experts with extensive experience.",
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                  },
                  {
                    icon: Clock,
                    title: "24/7 Digital Access",
                    description:
                      "Connect with healthcare professionals anytime, anywhere.",
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                  },
                  {
                    icon: Shield,
                    title: "Military-Grade Security",
                    description:
                      "Your health data is protected with advanced encryption.",
                    color: "text-purple-600",
                    bgColor: "bg-purple-100",
                  },
                  {
                    icon: Globe,
                    title: "Comprehensive Specialties",
                    description:
                      "Access to 50+ medical specialties under one platform.",
                    color: "text-cyan-600",
                    bgColor: "bg-cyan-100",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div
                      className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Advanced Medical Technology"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Expert Medical Team"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Patient Care"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Modern Healthcare"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Ready to Begin Your Health Journey?
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our Healthcare Community Today
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Experience the future of healthcare with Arogya. Book your first
              appointment and discover why thousands trust us with their health.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?mode=register">
                <Button className="bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 px-12 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/guest/doctors">
                <Button
                  variant="outline"
                  className="border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white px-12 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105 rounded-2xl"
                >
                  Meet Our Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </div>
  );
}
