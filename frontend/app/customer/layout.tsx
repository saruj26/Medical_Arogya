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
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
          active
            ? "bg-[#1656a4] text-white shadow-md border-[#1656a4]"
            : "text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200"
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50 shadow-sm h-16 flex items-center backdrop-blur-sm bg-white/95">
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
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity "
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#1656a4] to-[#0f3f7f] rounded-lg flex items-center justify-center shadow-sm">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#1656a4] hidden sm:inline">
                Arogya
              </span>
            </Link>
          </div>

          {/* Header right section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
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
            onClick={closeSidebar}
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
                  {userName ?? "Patient"}
                </div>
                <div className="text-sm text-gray-600 truncate mt-1">
                  {userEmail ?? "guest@example.com"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation items - Fixed container with proper spacing */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <nav className="p-4 space-y-2 flex-1">
              <Suspense
                fallback={<div className="animate-pulse">Loading...</div>}
              >
                <NavItem
                  href="/customer"
                  value="appointments"
                  label="My Appointments"
                  icon={<Calendar className="w-4 h-4" />}
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
                  label="Prescriptions"
                  icon={<FileText className="w-4 h-4" />}
                />
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
              </Suspense>
            </nav>

            {/* Sidebar footer - Always visible at bottom */}
            <div className="p-4 border-t border-gray-200/80 bg-gray-50/80 space-y-2 flex-shrink-0 mt-auto">
              <Link
                href="/customer/settings"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  tab === "settings"
                    ? "bg-[#1656a4] text-white shadow-md border-[#1656a4]"
                    : "text-gray-700 hover:bg-white hover:shadow-sm border-transparent hover:border-gray-200"
                }`}
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content - Scrollable area. On large screens add left margin to avoid overlap with fixed sidebar */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30 lg:ml-64 min-h-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
