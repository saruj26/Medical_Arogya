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
  Shield,
  Sparkles,
  Zap,
  Activity,
  Package,
  UserCheck,
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

  const NavItem = ({
    href,
    label,
    icon: Icon,
    isActive,
  }: {
    href: string;
    label: string;
    icon: any;
    isActive: boolean;
  }) => (
    <Link href={href} onClick={() => setSidebarOpen(false)}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start transition-all duration-300 group ${
          isActive
            ? "bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white shadow-lg border-0"
            : "hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 text-gray-700"
        }`}
      >
        <Icon
          className={`w-4 h-4 mr-3 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? "text-white" : "text-gray-600 group-hover:text-[#1656a4]"
          }`}
        />
        <span className="font-semibold">{label}</span>
        {isActive && (
          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
        )}
      </Button>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex">
      {/* Enhanced Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 transform transition-transform duration-300 ease-in-out h-screen lg:translate-x-0 lg:fixed lg:inset-y-0 lg:left-0 lg:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200/80 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                    Arogya
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    Admin Portal
                  </span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm border border-gray-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Admin Badge */}
            <div className="mt-4 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
              <Shield className="w-4 h-4 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-700 truncate">
                  System Administrator
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {userEmail || "admin@arogya.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              <div className="px-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Main Menu
                </span>
              </div>

              <div className="mt-3">
              <NavItem
                href="/admin"
                label="Dashboard"
                icon={Home}
                isActive={isActive("/admin")}
              />
              </div>
              <div className="mt-3">
              <NavItem
                href="/admin/doctors"
                label="Doctors Management"
                icon={Users}
                isActive={pathname.startsWith("/admin/doctors")}
              />
              </div>

              {/* extra vertical gap before Pharmacists */}
              <div className="mt-3">
                <NavItem
                  href="/admin/pharmacist"
                  label="Pharmacists"
                  icon={UserCheck}
                  isActive={pathname.startsWith("/admin/pharmacist")}
                />
              </div>

              <div className="mt-3">
              <NavItem
                href="/admin/medicine"
                label="Medicine Inventory"
                icon={Package}
                isActive={pathname.startsWith("/admin/medicine")}
              />
              </div>

              <div className="mt-3">
              <div className="px-3 py-2 mt-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Analytics & Reports
                </span>
              </div>
              </div>

              <NavItem
                href="/admin/analytics"
                label="Analytics"
                icon={BarChart3}
                isActive={isActive("/admin/analytics")}
              />
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-200/80 bg-gradient-to-b from-white to-gray-50/80 space-y-3">
            <Link href="/admin/settings">
              <Button
                variant={isActive("/admin/settings") ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-300 group ${
                  isActive("/admin/settings")
                    ? "bg-gradient-to-r from-[#1656a4] to-cyan-600 text-white shadow-lg border-0"
                    : "hover:bg-white hover:shadow-md border border-gray-200 hover:border-blue-200 text-gray-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Settings
                  className={`w-4 h-4 mr-3 transition-transform duration-300 group-hover:scale-110 ${
                    isActive("/admin/settings")
                      ? "text-white"
                      : "text-gray-600 group-hover:text-[#1656a4]"
                  }`}
                />
                <span className="font-semibold">Settings</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md border border-transparent hover:border-red-200 transition-all duration-300 group"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-semibold">Logout</span>
            </Button>

            {/* System Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">
                System Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-0">
        {/* Enhanced Header */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-10 h-10 rounded-xl hover:bg-blue-50 border border-gray-200 hover:border-blue-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {pathname === "/admin" && "Admin Dashboard"}
                    {pathname.startsWith("/admin/doctors") &&
                      "Doctors Management"}
                    {pathname.startsWith("/admin/pharmacist") &&
                      "Pharmacists Management"}
                    {pathname === "/admin/analytics" && "Analytics & Reports"}
                    {pathname === "/admin/settings" && "System Settings"}
                    {pathname.startsWith("/admin/medicine") &&
                      "Medicine Inventory"}
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    {pathname === "/admin" && "System overview and key metrics"}
                    {pathname.startsWith("/admin/doctors") &&
                      "Manage medical professionals"}
                    {pathname.startsWith("/admin/pharmacist") &&
                      "Oversee pharmacy operations"}
                    {pathname === "/admin/analytics" &&
                      "Performance insights and reports"}
                    {pathname === "/admin/settings" &&
                      "Configure system preferences"}
                    {pathname.startsWith("/admin/medicine") &&
                      "Manage medication inventory"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Administrator
                </span>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  System Admin
                </p>
                <p className="text-xs text-gray-600 truncate max-w-[200px]">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
          <div className="max-w-8xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
