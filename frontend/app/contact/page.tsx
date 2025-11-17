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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header userType="guest" />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in <span className="text-[#1656a4]">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about our services? Need help with booking an
            appointment? We're here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center border-2 hover:border-[#1656a4] transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#1656a4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-[#1656a4]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Visit Us</h3>
                <p className="text-gray-600">
                  750 Nelliyady Karaveddy
                  <br />
                  Kunsarkada Lane
                  <br />
                  Jaffna
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#1656a4] transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#1656a4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-[#1656a4]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Call Us</h3>
                <p className="text-gray-600">
                  Emergency: +94 21 343 3433
                  <br />
                  Appointments: +94 21 343 3434
                  <br />
                  General: +94 21 343 3435
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#1656a4] transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#1656a4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-[#1656a4]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Email Us</h3>
                <p className="text-gray-600">
                  info@arogya.com
                  <br />
                  appointments@arogya.com
                  <br />
                  support@arogya.com
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#1656a4] transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-[#1656a4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-[#1656a4]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Working Hours</h3>
                <p className="text-gray-600">
                  Mon - Fri: 8:00 AM - 8:00 PM
                  <br />
                  Saturday: 9:00 AM - 6:00 PM
                  <br />
                  Sunday: 10:00 AM - 4:00 PM
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-[#1656a4]/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/80 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Send className="w-6 h-6" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-base font-semibold"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-base font-semibold"
                        >
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
                          className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-base font-semibold"
                        >
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
                          className="mt-2 h-12 border-2 focus:border-[#1656a4]"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="subject"
                          className="text-base font-semibold"
                        >
                          Subject *
                        </Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) =>
                            setFormData({ ...formData, subject: value })
                          }
                        >
                          <SelectTrigger className="mt-2 h-12 border-2 focus:border-[#1656a4]">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appointment">
                              Appointment Booking
                            </SelectItem>
                            <SelectItem value="general">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="technical">
                              Technical Support
                            </SelectItem>
                            <SelectItem value="billing">
                              Billing Question
                            </SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="message"
                        className="text-base font-semibold"
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="mt-2 border-2 focus:border-[#1656a4]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#1656a4] hover:bg-[#1656a4]/90 text-lg font-semibold shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Find Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4" />
                      <p>Interactive Map</p>
                      <p className="text-sm">123 Nelliyady Karaveddy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      24/7 Emergency Hotline
                    </h3>
                    <p className="text-2xl font-bold text-red-600 mb-2">
                      +94 21 343 3433
                    </p>
                    <p className="text-red-700 text-sm">
                      For medical emergencies, call immediately or visit our
                      emergency department.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#1656a4]/20 shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/guest/doctors">
                    <Button
                      variant="outline"
                      className="w-full border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent"
                    >
                      View Our Doctors
                    </Button>
                  </Link>
                  <Link href="/auth?mode=register">
                    <Button className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90">
                      Book an Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}