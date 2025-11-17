"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sparkles, Menu, X } from "lucide-react";
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModal({ isOpen: true, mode });
    setMobileMenuOpen(false);
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
      <header className="border-b bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#1656a4] to-cyan-600 bg-clip-text text-transparent">
                Arogya
              </span>
              <div className="text-xs text-gray-500 -mt-1 hidden sm:flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Premium Healthcare
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/guest/doctors", label: "Doctors" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  `relative transition-all duration-300 font-medium px-4 py-2 rounded-xl ` +
                  (isActive(item.href)
                    ? "text-[#1656a4] bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm border border-blue-100"
                    : "text-gray-700 hover:text-[#1656a4] hover:bg-gray-50/80 active:scale-95")
                }
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#1656a4] rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {userType === "guest" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                  className="hidden sm:flex border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent transition-all duration-300 hover:shadow-lg active:scale-95 font-semibold px-4 py-2 rounded-xl"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal("register")}
                  className="hidden sm:flex bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-semibold px-5 py-2 rounded-xl"
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
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-lg active:scale-95 px-4 py-2 rounded-xl"
              >
                Logout
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/guest/doctors", label: "Doctors" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={
                      `block transition-all duration-200 font-medium px-4 py-3 rounded-xl ` +
                      (isActive(item.href)
                        ? "text-[#1656a4] bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 shadow-sm"
                        : "text-gray-700 hover:text-[#1656a4] hover:bg-gray-50/80")
                    }
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              {userType === "guest" && (
                <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => openAuthModal("login")}
                    className="w-full border-2 border-[#1656a4] text-[#1656a4] hover:bg-[#1656a4] hover:text-white bg-transparent transition-all duration-300 font-semibold py-3 rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => openAuthModal("register")}
                    className="w-full bg-gradient-to-r from-[#1656a4] to-cyan-600 hover:from-[#1656a4]/90 hover:to-cyan-600/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-3 rounded-xl"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
      />
    </>
  );
}