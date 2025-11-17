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
  FileText,
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

  // Prevent browser from restoring scroll position on refresh/navigation which
  // can cause unexpected jumps in the doctor pages. We set scrollRestoration
  // to 'manual' while inside the doctor layout and restore it on cleanup.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      // Ensure we start at top when layout mounts to avoid restored scroll position
      window.scrollTo(0, 0);
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "auto";
        }
      } catch (e) {
        // ignore
      }
    };
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
    if (pathname?.includes("/tips")) return "tips";
    if (pathname?.includes("/appointments")) return "appointments";
    if (pathname?.includes("/prescription")) return "appointments";
    if (pathname?.includes("/profile")) return "profile";
    if (pathname?.includes("/settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  const NavItem = ({
    href,
    value,
    label,
    icon,
  }: {
    href: string;
    value: string;
    label: string;
    icon: React.ReactNode;
  }) => {
    const active = activeTab === value;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
          active
            ? "bg-[#1656a4] text-white shadow-md border-[#1656a4]"
            : "text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200"
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
        <span className="truncate font-semibold">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header (fixed to prevent small jump on scroll) */}
      <header className="bg-white border-b border-gray-200/80 fixed top-0 inset-x-0 z-50 shadow-sm h-16 flex items-center backdrop-blur-sm bg-white/95">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <Link
              href="/doctor"
              className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#1656a4] to-[#0f3f7f] rounded-lg flex items-center justify-center shadow-sm">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#1656a4] hidden sm:inline">
                Arogya
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
              {doctorProfile ? `Dr. ${doctorProfile.user_name}` : userEmail}
            </span>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="p-2 sm:px-3 bg-white hover:bg-red-50 border border-gray-200 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - fixed on desktop so it doesn't scroll with the page; still toggleable on mobile */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
          style={{
            top: "4rem",
            height: "calc(100vh - 4rem)",
          }}
        >
          {/* User profile section */}
          <div className="p-6 border-b border-gray-200/80 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1656a4] to-[#0f3f7f] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-semibold text-gray-900 truncate">
                  {doctorProfile?.user_name || "Dr. Name"}
                </div>
                <div className="text-sm text-gray-600 truncate mt-1">
                  {userEmail || "doctor@example.com"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation items - Fixed container with proper spacing */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <nav className="p-4 space-y-2 flex-1">
              <NavItem
                href="/doctor"
                value="dashboard"
                label="Dashboard"
                icon={<Home className="w-4 h-4" />}
              />
              <NavItem
                href="/doctor/appointments"
                value="appointments"
                label="Appointments"
                icon={<CalendarDays className="w-4 h-4" />}
              />
              <NavItem
                href="/doctor/profile"
                value="profile"
                label="Profile"
                icon={<User className="w-4 h-4" />}
              />
              <NavItem
                href="/doctor/tips"
                value="tips"
                label="Tips"
                icon={<FileText className="w-4 h-4" />}
              />
            </nav>

            {/* Sidebar footer - Always visible at bottom */}
            <div className="p-4 border-t border-gray-200/80 bg-gray-50/80 space-y-2 flex-shrink-0 mt-auto">
              <Link
                href="/doctor/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  activeTab === "settings"
                    ? "bg-[#1656a4] text-white shadow-md border-[#1656a4]"
                    : "text-gray-700 hover:bg-white hover:shadow-sm border-transparent hover:border-gray-200"
                }`}
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">Account Settings</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content - Scrollable area. Add top padding equal to header height to avoid content being hidden under fixed header. */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30 lg:ml-64 min-h-0 pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-8xl mx-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-900"></h2>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
