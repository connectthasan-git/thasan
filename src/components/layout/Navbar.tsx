"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/types/user";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, profile } = useAuth();
  const { signOut } = useAuthActions();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dashboardSegment = pathname.split("/")[2];
  const routeRole = ["admin", "founder", "freelancer", "student"].includes(dashboardSegment)
    ? (dashboardSegment as UserRole)
    : null;

  const dashboardRole = routeRole || profile?.role || "student";
  const dashboardUrl = `/dashboard/${dashboardRole}`;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/image.png" alt="Thasan AI" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold text-gray-900">
              {APP_NAME.replace("Thasan", "Thasan")}<span className="text-green-600">AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium text-sm transition-colors ${isActive ? "text-green-600" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href={dashboardUrl} className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-500 text-sm font-medium hover:text-gray-900 hover:bg-gray-50 transition-all">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-2xl text-gray-600 text-sm font-semibold hover:text-gray-900 hover:bg-gray-50 transition-all">
                  Login
                </Link>
                <Link href="/register" className="px-5 py-2 rounded-2xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-gray-600 p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2.5 px-3 rounded-xl hover:bg-gray-50 font-medium text-sm ${isActive ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-gray-900"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <Link href={dashboardUrl} className="block py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm text-center" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={signOut} className="w-full py-2.5 px-3 rounded-xl text-gray-500 font-medium text-sm hover:bg-gray-50">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-2.5 px-3 rounded-xl text-gray-600 font-medium text-sm text-center hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="block py-2.5 px-3 rounded-2xl bg-green-600 text-white font-semibold text-sm text-center shadow-lg shadow-green-200" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
