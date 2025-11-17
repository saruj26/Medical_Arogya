"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Users,
  Calendar,
  Shield,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Heart,
  Zap,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header userType="guest" />

      {/* Premium Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-cyan-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-white/30">
              <MessageCircle className="w-4 h-4" />
              We're Here to Help You
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Connect With Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Healthcare Team
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Have questions about our premium healthcare services? Our dedicated team is ready to provide personalized support and guidance for all your medical needs.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Contact Information */}
      <section className="py-16 px-4 -mt-8 relative z-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: MapPin,
                title: "Visit Our Facility",
                description: "750 Nelliyady Karaveddy, Kunsarkada Lane, Jaffna",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
                contact: "Main Campus"
              },
              {
                icon: Phone,
                title: "Call Us Directly",
                description: "Emergency: +94 21 343 3433\nAppointments: +94 21 343 3434\nGeneral: +94 21 343 3435",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50",
                contact: "24/7 Available"
              },
              {
                icon: Mail,
                title: "Email Support",
                description: "info@arogya.com\nappointments@arogya.com\nsupport@arogya.com",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50",
                contact: "Quick Response"
              },
              {
                icon: Clock,
                title: "Working Hours",
                description: "Mon - Fri: 8:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM",
                color: "from-orange-500 to-amber-500",
                bgColor: "bg-orange-50",
                contact: "Extended Hours"
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-3">
                    {item.description}
                  </p>
                  <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    {item.contact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Contact Form Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Premium Contact Form */}
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white p-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    Send Us a Message
                    <p className="text-blue-100 text-sm font-normal mt-1">
                      We typically respond within 2 hours during business hours
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting Arogya Healthcare. Our team will get back to you within 24 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link href="/guest/doctors">
                        <Button variant="outline" className="border-2 border-[#1656a4] text-[#1656a4]">
                          Browse Doctors
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="bg-[#1656a4] hover:bg-[#1656a4]/90"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="Enter your email"
                          className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+94 21 343 3433"
                          className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                          Inquiry Type *
                        </Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) =>
                            setFormData({ ...formData, subject: value })
                          }
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-0 shadow-xl">
                            <SelectItem value="appointment" className="rounded-lg py-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Appointment Booking
                              </div>
                            </SelectItem>
                            <SelectItem value="general" className="rounded-lg py-3">
                              <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                General Inquiry
                              </div>
                            </SelectItem>
                            <SelectItem value="technical" className="rounded-lg py-3">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Technical Support
                              </div>
                            </SelectItem>
                            <SelectItem value="billing" className="rounded-lg py-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Billing Question
                              </div>
                            </SelectItem>
                            <SelectItem value="feedback" className="rounded-lg py-3">
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Feedback
                              </div>
                            </SelectItem>
                            <SelectItem value="other" className="rounded-lg py-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Other
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                        Your Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Please describe how we can assist you with your healthcare needs..."
                        rows={6}
                        className="border-2 border-gray-200 focus:border-[#1656a4] focus:ring-2 focus:ring-blue-200 rounded-xl transition-all resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
                {/* Support Promise Card */}
              <Card className="mt-4 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#1656a4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Our Support Promise</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We guarantee a response within 2 hours during business hours. Your health and satisfaction are our top priorities.
                    </p>
                  </div>
                </CardContent>
              </Card>
              </CardContent>
            </Card>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Location Map Card */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6">
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    Our Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 h-64 rounded-b-3xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="text-center relative z-10">
                      <MapPin className="w-12 h-12 text-[#1656a4] mx-auto mb-4" />
                      <p className="text-gray-700 font-semibold">Arogya Healthcare Center</p>
                      <p className="text-gray-600 text-sm">750 Nelliyady Karaveddy</p>
                      <p className="text-gray-600 text-sm">Jaffna, Sri Lanka</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">24/7 Emergency Hotline</h3>
                      <p className="text-2xl font-bold mb-3 text-white">+94 21 343 3433</p>
                      <p className="text-red-100 text-sm leading-relaxed">
                        For immediate medical emergencies, call our emergency line. Our team is available round the clock to provide urgent care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#1656a4]" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/guest/doctors">
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white h-12 font-semibold transition-all duration-300 rounded-xl group"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Browse Our Specialists
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/auth?mode=register">
                    <Button className="mt-2 w-full bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button 
                      variant="outline" 
                      className="mt-2 w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-12 font-semibold transition-all duration-300 rounded-xl"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Learn About Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              
            </div>
          </div>
        </div>
      </section>

      {/* Additional Support Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the communication method that works best for you. We're here to help through every channel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Phone Support",
                description: "Speak directly with our healthcare coordinators for immediate assistance.",
                action: "Call Now",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Mail,
                title: "Email Support",
                description: "Send detailed inquiries and receive comprehensive written responses.",
                action: "Email Us",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: MessageCircle,
                title: "Live Chat",
                description: "Get instant answers to your questions through our online chat service.",
                action: "Start Chat",
                color: "from-purple-500 to-pink-500"
              },
            ].map((method, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center bg-white/80 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  <Button variant="outline" className="border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white rounded-xl">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}