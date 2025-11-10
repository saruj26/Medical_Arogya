"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Calendar,
  CreditCard,
  Stethoscope,
  LogOut,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Settings,
  Menu,
  X,
  Home,
  BarChart3,
  Clock,
  CalendarDays,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "admin") {
      router.push("/auth");
      return;
    }

    setUserEmail(email || "");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
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
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1656a4] rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1656a4]">
                Arogya Admin
              </span>
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

          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Link href="/admin">
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/doctors">
                <Button
                  variant={pathname.startsWith("/admin/doctors") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Doctors
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button
                  variant={isActive("/admin/analytics") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="space-y-2">
              <Link href="/admin/settings">
                <Button
                  variant={isActive("/admin/settings") ? "default" : "ghost"}
                  className="w-full justify-start"
                >
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

      <div className="flex-1 flex flex-col lg:ml-0">
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
              <h1 className="text-lg font-semibold text-gray-900">
                {pathname === "/admin" && "Dashboard"}
                {pathname.startsWith("/admin/doctors") && "Doctors Management"}
                {pathname === "/admin/analytics" && "Analytics & Reports"}
                {pathname === "/admin/settings" && "Settings"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Admin: {userEmail}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}