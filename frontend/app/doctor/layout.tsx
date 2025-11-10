"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  LogOut,
  Settings,
  Menu,
  X,
  Home,
  CalendarDays,
  User,
} from "lucide-react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "doctor") {
      window.location.href = "/";
      return;
    }

    setUserEmail(email || "");
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api(`/api/doctor/doctor/profile/`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDoctorProfile(data.profile);
        }
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const getActiveTab = () => {
    if (pathname.includes("/appointments")) return "appointments";
    if (pathname.includes("/profile")) return "profile";
    if (pathname.includes("/settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  const getPageTitle = () => {
    if (pathname.includes("/appointments")) return "Appointments";
    if (pathname.includes("/profile")) return "Profile";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/doctor" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1656a4]">Arogya</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Link href="/doctor">
                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/doctor/appointments">
                <Button
                  variant={activeTab === "appointments" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Appointments
                </Button>
              </Link>
              <Link href="/doctor/profile">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div className="space-y-2">
              <Link href="/doctor/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {doctorProfile ? `Dr. ${doctorProfile.user_name}` : userEmail}
              </span>
              {doctorProfile?.doctor_id && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  ID: {doctorProfile.doctor_id}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
