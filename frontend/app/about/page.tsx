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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userType="guest" />

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            About Arogya
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transforming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1656a4] to-blue-600">
              Healthcare
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            We are dedicated to providing exceptional healthcare services with
            cutting-edge technology and compassionate care. Our mission is to
            make quality healthcare accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 border-[#1656a4]/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-7 h-7" />
                  </div>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  To revolutionize healthcare delivery by providing accessible,
                  affordable, and high-quality medical services through
                  innovative technology and compassionate care. We strive to
                  bridge the gap between patients and healthcare providers,
                  ensuring everyone receives the care they deserve.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1656a4]/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Star className="w-7 h-7" />
                  </div>
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  To become the leading healthcare platform that transforms how
                  people access and experience medical care. We envision a
                  future where quality healthcare is just a click away,
                  empowering individuals to take control of their health journey
                  with confidence and ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#1656a4]/10 text-[#1656a4] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Our Core Values
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Principles That Guide Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values shape our commitment to excellence in healthcare and
              guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description:
                  "We treat every patient with empathy, understanding, and genuine care for their wellbeing.",
                color: "red",
                gradient: "from-red-100 to-red-50",
                iconColor: "text-red-600"
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We maintain the highest standards in medical care and continuously strive for improvement.",
                color: "yellow",
                gradient: "from-yellow-100 to-yellow-50",
                iconColor: "text-yellow-600"
              },
              {
                icon: Shield,
                title: "Integrity",
                description:
                  "We operate with transparency, honesty, and ethical practices in all our interactions.",
                color: "green",
                gradient: "from-green-100 to-green-50",
                iconColor: "text-green-600"
              },
              {
                icon: Users,
                title: "Collaboration",
                description:
                  "We work together as a team to provide comprehensive and coordinated healthcare solutions.",
                color: "blue",
                gradient: "from-blue-100 to-blue-50",
                iconColor: "text-blue-600"
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="text-center border-2 hover:border-[#1656a4]/50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <value.icon
                      className={`w-10 h-10 ${value.iconColor}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Arogya?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine medical expertise with modern technology to deliver
              exceptional healthcare experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Expert Medical Team",
                  description:
                    "Our doctors are highly qualified specialists with years of experience in their respective fields.",
                  color: "green",
                  gradient: "from-green-100 to-green-50",
                  iconColor: "text-green-600"
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  description:
                    "Round-the-clock support and emergency services to ensure you get help when you need it most.",
                  color: "blue",
                  gradient: "from-blue-100 to-blue-50",
                  iconColor: "text-blue-600"
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description:
                    "Your health information is protected with enterprise-grade security and strict privacy protocols.",
                  color: "purple",
                  gradient: "from-purple-100 to-purple-50",
                  iconColor: "text-purple-600"
                },
                {
                  icon: Award,
                  title: "Quality Assurance",
                  description:
                    "We maintain the highest standards of medical care with regular quality assessments and improvements.",
                  color: "orange",
                  gradient: "from-orange-100 to-orange-50",
                  iconColor: "text-orange-600"
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                  >
                    <feature.icon
                      className={`w-8 h-8 ${feature.iconColor}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#1656a4]/10 via-blue-50 to-purple-50 p-10 rounded-3xl shadow-2xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#1656a4] to-[#1656a4]/80 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Join Thousands of Satisfied Patients
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Experience the difference that quality healthcare makes in
                  your life.
                </p>
                <Link href="/auth?mode=register">
                  <Button className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 hover:from-[#1656a4]/90 hover:to-[#1656a4] h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg">
              Numbers that speak for our commitment to excellence
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Happy Patients", icon: "👥" },
              { number: "100+", label: "Expert Doctors", icon: "👨‍⚕️" },
              { number: "50+", label: "Specialties", icon: "🏥" },
              { number: "99%", label: "Satisfaction Rate", icon: "⭐" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
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