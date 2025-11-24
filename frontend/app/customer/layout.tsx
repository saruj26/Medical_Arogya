"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Stethoscope,
  Settings,
  LogOut,
  Calendar,
  FileText,
  User,
  MessageSquare,
  Menu,
  X,
  Heart,
  Shield,
  Home,
  Sparkles,
  Zap,
  Bell,
  Map,
  MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent browser from restoring scroll position on refresh/navigation which
  // can cause unexpected jumps on some pages (especially when dynamic content loads).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
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

  const tab =
    searchParams?.get("tab") ||
    (pathname?.includes("/customer/settings")
      ? "settings"
      : pathname?.includes("/customer/prescription")
      ? "prescriptions"
      : pathname?.includes("/customer/tips")
      ? "tips"
      : pathname?.includes("/customer/chat")
      ? "chat"
      : pathname?.includes("/customer/doctors")
      ? "doctors"
      : pathname?.includes("/customer/profile")
      ? "profile"
      : "appointments");

  const userEmail = mounted ? localStorage.getItem("userEmail") : null;
  const userName = mounted
    ? (() => {
        try {
          const u = localStorage.getItem("user");
          return u ? JSON.parse(u).name : null;
        } catch {
          return null;
        }
      })()
    : null;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
  };

  const closeSidebar = () => setSidebarOpen(false);

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
    const active = tab === value;
    return (
      <Link
        href={href}
        onClick={closeSidebar}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 group ${
          active
            ? "bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white shadow-lg border-transparent"
            : "text-gray-700 hover:bg-white hover:shadow-md border-gray-200 hover:border-blue-200 bg-white/50"
        }`}
      >
        <span
          className={`w-5 h-5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            active ? "text-white" : "text-gray-600 group-hover:text-[#1656a4]"
          }`}
        >
          {icon}
        </span>
        <span className="truncate font-semibold">{label}</span>
        {active && (
          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 fixed top-0 inset-x-0 z-50 shadow-sm h-16 flex items-center">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-blue-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-blue-200"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Enhanced Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 hover:opacity-90 transition-opacity group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                  Arogya
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                  Patient Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Enhanced Header right section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-600 font-medium hidden sm:block">
              Welcome,{" "}
              <span className="text-[#1656a4] font-semibold">
                {userName ?? "Guest"}
              </span>
            </span>

            <div className="h-8 w-px bg-gray-200 hidden sm:block" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="p-2 sm:px-4 bg-white hover:bg-red-50 border border-gray-200 text-red-600 hover:text-red-700 hover:border-red-300 transition-all duration-300 rounded-xl"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline text-sm font-semibold">
                Logout
              </span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
            onClick={closeSidebar}
          />
        )}

        {/* Enhanced Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 z-40 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
          style={{
            top: "4rem",
            height: "calc(100vh - 4rem)",
          }}
        >
          {/* Enhanced User profile section */}
          <div className="p-4 border-b border-gray-200/80 bg-gradient-to-br from-blue-50 to-cyan-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                <User className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-base font-bold text-gray-900 truncate">
                    {userName ?? "Patient"}
                  </div>
                </div>
                <div className="text-sm text-gray-600 truncate mb-2">
                  {userEmail ?? "patient@example.com"}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex-1 flex flex-col overflow-hidden mt-2">
            <nav className="py-4 px-6 space-y-3 flex-1">
              <div className="space-y-3">
                <NavItem
                  href="/customer"
                  value="appointments"
                  label="Dashboard"
                  icon={<Home className="w-4 h-4" />}
                />
                <NavItem
                  href="/customer/doctors"
                  value="doctors"
                  label="Find Doctors"
                  icon={<Stethoscope className="w-4 h-4" />}
                />
                <NavItem
                  href="/customer/prescription"
                  value="prescriptions"
                  label="My Prescriptions"
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-2">
                <NavItem
                  href="/customer/tips"
                  value="tips"
                  label="Health Tips"
                  icon={<Heart className="w-4 h-4" />}
                />
                <NavItem
                  href="/customer/chat"
                  value="chat"
                  label="Health Assistant"
                  icon={<MessageSquare className="w-4 h-4" />}
                />
                <NavItem
                  href="/customer/profile"
                  value="profile"
                  label="My Profile"
                  icon={<User className="w-4 h-4" />}
                />
              </div>
            </nav>

            {/* Enhanced Sidebar footer */}
            <div className="px-6 py-10 border-t border-gray-200/80 bg-gradient-to-b from-white to-gray-50/80 space-y-3 flex-shrink-0 mt-auto">
              <Link
                href="/customer/settings"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 group ${
                  tab === "settings"
                    ? "bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white shadow-lg border-transparent"
                    : "text-gray-700 hover:bg-white hover:shadow-md border-gray-200 hover:border-blue-200 bg-white/50"
                }`}
              >
                <Settings className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold">Account Settings</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 border border-red-200 transition-all duration-300 border-2 border-transparent hover:border-red-200 group"
              >
                <LogOut className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold">Sign Out</span>
              </button>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700 font-medium">
                  Healthcare Active
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Enhanced Main content */}
        <main
          className={`flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-cyan-50 lg:ml-72 min-h-0 pt-16 flex flex-col transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-72" : "translate-x-0"
          } lg:translate-x-0`}
        >
          <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-8xl mx-auto">
            {children}
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-8 px-4 mt-auto">
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
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Professional healthcare services with modern technology and
                    experienced doctors. Your health is our priority.
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
                      <Link
                        href="/"
                        className="hover:text-white transition-colors"
                      >
                        Sign In
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-6 text-lg">Contact Info</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2">
                      <span>📞</span> +94 21 343 3433
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✉️</span> info@arogya.com
                    </li>
                    <li className="flex items-center gap-2">
                      <span><MapIcon/></span> 123 Nelliyady, Karaveddy
                    </li>
                    <li className="flex items-center gap-2">
                      <span>🕒</span> 24/7 Emergency Support
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p className="text-sm">
                  &copy; {new Date().getFullYear()} Arogya. All rights reserved.
                  | Professional Healthcare Platform
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  Committed to providing quality healthcare services
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
