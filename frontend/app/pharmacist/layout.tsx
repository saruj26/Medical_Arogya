"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Pill,
  FileText,
  Shield,
  Sparkles,
  Zap,
  User,
} from "lucide-react";

export default function PharmacistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pharmacistProfile, setPharmacistProfile] = useState<any>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "pharmacist") {
      router.push("/");
      return;
    }

    setUserEmail(email || "");
    fetchPharmacistProfile();
  }, [router]);

  // Prevent browser from restoring scroll position on refresh/navigation
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

  const fetchPharmacistProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      // You can replace this with your actual API endpoint
      const response = await fetch('/api/pharmacist/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPharmacistProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching pharmacist profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/");
  };

  const getActiveTab = () => {
    if (pathname?.includes("/medicine")) return "medicine";
    if (pathname?.includes("/products")) return "products";
    if (pathname?.includes("/prescriptions")) return "prescriptions";
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
        onClick={() => setSidebarOpen(false)}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
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

            <Link
              href="/pharmacist"
              className="flex items-center gap-3 flex-shrink-0 hover:opacity-90 transition-opacity group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                  Arogya
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">
                  Pharmacy Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Shield className="w-3 h-3 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                {pharmacistProfile?.pharmacyName || "Licensed Pharmacist"}
              </span>
            </div>

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
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-72 flex-shrink-0 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 z-40 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
          style={{
            top: "4rem",
            height: "calc(100vh - 4rem)",
          }}
        >
          {/* Enhanced User profile section */}
          <div className="p-6 border-b border-gray-200/80 bg-gradient-to-br from-blue-50 to-cyan-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                {pharmacistProfile?.profile_image && !imageLoadError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pharmacistProfile.profile_image}
                    alt={pharmacistProfile?.user_name || "Pharmacist"}
                    className="w-full h-full object-cover"
                    onError={() => setImageLoadError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1656a4] to-cyan-600 flex items-center justify-center text-white">
                    <User className="w-7 h-7" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-base font-bold text-gray-900 truncate">
                    {pharmacistProfile?.user_name || "Pharmacist"}
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-sm text-gray-600 truncate mb-2">
                  {userEmail || "pharmacist@example.com"}
                </div>
                {pharmacistProfile?.pharmacyName && (
                  <div className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs font-medium text-blue-700 border border-blue-200">
                    <Zap className="w-3 h-3" />
                    {pharmacistProfile.pharmacyName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <nav className="p-6 space-y-1 flex-1">
              <div className="space-y-2">
                <div className="px-4 py-0">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Main Menu
                  </span>
                </div>
                <NavItem
                  href="/pharmacist"
                  value="dashboard"
                  label="Dashboard"
                  icon={<Home className="w-4 h-4" />}
                />
                <NavItem
                  href="/pharmacist/medicine"
                  value="medicine"
                  label="Pharmacy Sales"
                  icon={<Pill className="w-4 h-4" />}
                />
                <NavItem
                  href="/pharmacist/products"
                  value="products"
                  label="Medicine Management"
                  icon={<Pill className="w-4 h-4" />}
                />
                <NavItem
                  href="/pharmacist/prescriptions"
                  value="prescriptions"
                  label="Prescriptions"
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>

            </nav>

            {/* Enhanced Sidebar footer */}
            <div className="p-6 border-t border-gray-200/80 bg-gradient-to-b from-white to-gray-50/80 space-y-3 flex-shrink-0 mt-auto">
              <Link
                href="/pharmacist/settings"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 group ${
                  activeTab === "settings"
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
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 border-2 border-transparent hover:border-red-200 group"
              >
                <LogOut className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold">Sign Out</span>
              </button>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700 font-medium">
                  Pharmacy Open
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Enhanced Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 lg:ml-72 min-h-0 pt-10">
          <div className="w-full px-2 sm:px-6 lg:px-6 py-6 max-w-8xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}