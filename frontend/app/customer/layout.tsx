"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Stethoscope,
  Settings,
  LogOut,
  Calendar,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "appointments";

  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const userName =
    typeof window !== "undefined"
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
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active ? "bg-[#1656a4] text-white" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[#1656a4]">
              Arogya
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Welcome, {userEmail ?? "Guest"}
            </span>
            <Link href="/customer/settings">
              <Button
                variant="outline"
                size="sm"
                className="p-2 sm:px-3 bg-transparent"
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="p-2 sm:px-3 bg-transparent"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-80px)]">
          <aside className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-4 flex flex-col justify-between sticky top-20 h-[calc(100vh-6rem)]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#eef2ff] rounded-full flex items-center justify-center text-[#1e3a8a]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {userName ?? "Patient"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {userEmail ?? ""}
                    </div>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  <NavItem
                    href="/customer?tab=appointments"
                    value="appointments"
                    label="Appointments"
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <NavItem
                    href="/customer?tab=doctors"
                    value="doctors"
                    label="Find Doctors"
                    icon={<Stethoscope className="w-4 h-4" />}
                  />
                  <NavItem
                    href="/customer?tab=prescriptions"
                    value="prescriptions"
                    label="Prescriptions"
                    icon={<FileText className="w-4 h-4" />}
                  />
                  <NavItem
                    href="/customer?tab=profile"
                    value="profile"
                    label="Profile"
                    icon={<User className="w-4 h-4" />}
                  />
                </nav>
              </div>

              <div className="pt-4 border-t">
                <Link
                  href="/customer/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
