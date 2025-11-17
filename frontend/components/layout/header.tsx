"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";

interface HeaderProps {
  userType?: "guest" | "customer" | "doctor";
}

export default function Header({ userType = "guest" }: HeaderProps) {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "login" | "register";
  }>({
    isOpen: false,
    mode: "login",
  });

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: "login" });
  };

  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/" && pathname === "/") return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1656a4] to-[#1656a4]/80 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold text-[#1656a4]">
                Arogya
              </span>
              <div className="text-xs text-gray-500 -mt-1 hidden sm:block">
                Professional Healthcare
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={
                `transition-all duration-200 font-medium px-2 py-1 rounded-md ` +
                (isActive("/")
                  ? "text-[#1656a4] bg-[#e6f0fb] shadow-sm"
                  : "text-gray-600 hover:text-[#1656a4] hover:bg-gray-50 active:scale-95")
              }
              aria-current={isActive("/") ? "page" : undefined}
            >
              Home
            </Link>

            <Link
              href="/guest/doctors"
              className={
                `transition-all duration-200 font-medium px-2 py-1 rounded-md ` +
                (isActive("/guest/doctors")
                  ? "text-[#1656a4] bg-[#e6f0fb] shadow-sm"
                  : "text-gray-600 hover:text-[#1656a4] hover:bg-gray-50 active:scale-95")
              }
              aria-current={isActive("/guest/doctors") ? "page" : undefined}
            >
              Doctors
            </Link>

            <Link
              href="/about"
              className={
                `transition-all duration-200 font-medium px-2 py-1 rounded-md ` +
                (isActive("/about")
                  ? "text-[#1656a4] bg-[#e6f0fb] shadow-sm"
                  : "text-gray-600 hover:text-[#1656a4] hover:bg-gray-50 active:scale-95")
              }
              aria-current={isActive("/about") ? "page" : undefined}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={
                `transition-all duration-200 font-medium px-2 py-1 rounded-md ` +
                (isActive("/contact")
                  ? "text-[#1656a4] bg-[#e6f0fb] shadow-sm"
                  : "text-gray-600 hover:text-[#1656a4] hover:bg-gray-50 active:scale-95")
              }
              aria-current={isActive("/contact") ? "page" : undefined}
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {userType === "guest" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                  className="border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#cfe3fb] font-semibold text-xs sm:text-sm px-2 sm:px-4"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal("register")}
                  className="bg-gradient-to-r from-[#1656a4] to-[#1656a4]/90 hover:from-[#1656a4]/90 hover:to-[#1656a4] shadow-lg hover:shadow-xl transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#bfdcff] font-semibold text-xs sm:text-sm px-2 sm:px-4"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userRole");
                  window.location.href = "/";
                }}
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  );
}
