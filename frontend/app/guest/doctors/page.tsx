"use client";

import { useState } from "react";
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
import { Stethoscope, Star, Clock, Filter, ArrowRight } from "lucide-react";

// Mock data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: "15 years",
    rating: 4.8,
    image: "/placeholder.svg?height=100&width=100",
    fee: 500,
    education: "MBBS, MD Cardiology",
    hospital: "City Heart Hospital",
    nextSlot: "Today 2:00 PM",
    about:
      "Specialized in interventional cardiology with expertise in complex cardiac procedures.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    experience: "12 years",
    rating: 4.9,
    image: "/placeholder.svg?height=100&width=100",
    fee: 500,
    education: "MBBS, MD Dermatology",
    hospital: "Skin Care Center",
    nextSlot: "Tomorrow 10:00 AM",
    about: "Expert in cosmetic dermatology and advanced skin treatments.",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialty: "Pediatrics",
    experience: "10 years",
    rating: 4.7,
    image: "/placeholder.svg?height=100&width=100",
    fee: 500,
    education: "MBBS, MD Pediatrics",
    hospital: "Children's Medical Center",
    nextSlot: "Dec 26, 3:00 PM",
    about:
      "Dedicated to providing comprehensive healthcare for children and adolescents.",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    experience: "18 years",
    rating: 4.6,
    image: "/placeholder.svg?height=100&width=100",
    fee: 500,
    education: "MBBS, MS Orthopedics",
    hospital: "Bone & Joint Hospital",
    nextSlot: "Today 4:00 PM",
    about: "Specializes in joint replacement surgery and sports medicine.",
  },
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

export default function GuestDoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    if (specialty === "All Specialties") {
      setFilteredDoctors(mockDoctors);
    } else {
      setFilteredDoctors(
        mockDoctors.filter((doctor) => doctor.specialty === specialty)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1656a4]">Arogya</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#1656a4] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#1656a4] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-[#1656a4] transition-colors"
            >
              Contact
            </Link>
            <Link href="/guest/doctors" className="text-[#1656a4] font-medium">
              Doctors
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button
                variant="outline"
                className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Our Expert Doctors
          </h1>
          <p className="text-gray-600">
            Meet our qualified healthcare professionals
          </p>
        </div>

        {/* Filter */}
        <Card className="border-2 border-[#1656a4]/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Specialty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Select
                value={selectedSpecialty}
                onValueChange={handleSpecialtyChange}
              >
                <SelectTrigger className="h-12 border-2 focus:border-[#1656a4]">
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
          </CardContent>
        </Card>

        {/* Doctors List */}
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredDoctors.length} Doctor
              {filteredDoctors.length !== 1 ? "s" : ""} Available
            </h2>
            {selectedSpecialty !== "All Specialties" && (
              <Button
                variant="outline"
                onClick={() => handleSpecialtyChange("All Specialties")}
                className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white"
              >
                Show All Doctors
              </Button>
            )}
          </div>

          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#1656a4]/30"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24 border-4 border-[#1656a4]/20">
                    <AvatarImage
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                    />
                    <AvatarFallback className="bg-[#1656a4] text-white text-xl">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {doctor.name}
                        </h3>
                        <p className="text-[#1656a4] font-semibold text-lg mb-2">
                          {doctor.specialty}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Experience</p>
                            <p className="font-medium">{doctor.experience}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Education</p>
                            <p className="font-medium">{doctor.education}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Hospital</p>
                            <p className="font-medium">{doctor.hospital}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {doctor.rating}
                              </span>
                              <span className="text-gray-500 text-sm">
                                (150+ reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{doctor.about}</p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Next available: {doctor.nextSlot}</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Available
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <p className="text-green-800 font-medium">
                            Consultation Fee
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{doctor.fee}
                          </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-blue-800 text-sm mb-2">
                            To book an appointment
                          </p>
                          <Link href="/auth?mode=register">
                            <Button className="w-full bg-[#1656a4] hover:bg-[#1656a4]/90 h-12 text-lg font-semibold shadow-lg">
                              Register & Book
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>

                        <Link href="/auth">
                          <Button
                            variant="outline"
                            className="w-full border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent"
                          >
                            Already have account?
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 border-2 border-[#1656a4]/20 bg-gradient-to-r from-[#1656a4]/5 to-blue-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Book Your Appointment?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied patients who trust Arogya for their
              healthcare needs. Register now to book appointments with our
              expert doctors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?mode=register">
                <Button className="bg-[#1656a4] hover:bg-[#1656a4]/90 h-12 px-8 text-lg font-semibold">
                  Register Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white h-12 px-8 bg-transparent"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Arogya</span>
              </div>
              <p className="text-gray-400">
                Professional healthcare services with modern technology and
                experienced doctors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
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
                    Doctors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>General Consultation</li>
                <li>Specialist Care</li>
                <li>Health Checkups</li>
                <li>Online Prescriptions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +91 98765 43210</li>
                <li>✉️ info@Arogya.com</li>
                <li>📍 123 Health Street, Medical City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Arogya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
