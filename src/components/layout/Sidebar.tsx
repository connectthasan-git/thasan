"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/user";
import {
  Home,
  GraduationCap,
  Briefcase,
  UsersRound,
  Lightbulb,
  Settings,
  ClipboardList,
  IndianRupee,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const studentLinks: SidebarLink[] = [
  { href: "/dashboard/student", label: "Overview", icon: <Home size={18} /> },
  { href: "/dashboard/student/courses", label: "My Courses", icon: <GraduationCap size={18} /> },
  { href: "/dashboard/student/projects", label: "Projects", icon: <ClipboardList size={18} /> },
  { href: "/dashboard/student/internships", label: "Internships", icon: <Briefcase size={18} /> },
  { href: "/dashboard/student/community", label: "Community", icon: <UsersRound size={18} /> },
  { href: "/dashboard/student/settings", label: "Settings", icon: <Settings size={18} /> },
];

const freelancerLinks: SidebarLink[] = [
  { href: "/dashboard/freelancer", label: "Overview", icon: <Home size={18} /> },
  { href: "/dashboard/freelancer/projects", label: "Projects", icon: <ClipboardList size={18} /> },
  { href: "/dashboard/freelancer/earnings", label: "Earnings", icon: <IndianRupee size={18} /> },
  { href: "/dashboard/freelancer/settings", label: "Settings", icon: <Settings size={18} /> },
];

const founderLinks: SidebarLink[] = [
  { href: "/dashboard/founder", label: "Overview", icon: <Home size={18} /> },
  { href: "/dashboard/founder/startup", label: "My Startup", icon: <Lightbulb size={18} /> },
  { href: "/dashboard/founder/team", label: "Team", icon: <Users size={18} /> },
  { href: "/dashboard/founder/settings", label: "Settings", icon: <Settings size={18} /> },
];

const adminLinks: SidebarLink[] = [
  { href: "/dashboard/admin", label: "Overview", icon: <Home size={18} /> },
  { href: "/dashboard/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/dashboard/admin/courses", label: "Courses", icon: <GraduationCap size={18} /> },
  { href: "/dashboard/admin/internships", label: "Internships", icon: <Briefcase size={18} /> },
  { href: "/dashboard/admin/freelancers", label: "Freelancers", icon: <UsersRound size={18} /> },
  { href: "/dashboard/admin/groups", label: "Groups", icon: <ShieldCheck size={18} /> },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { href: "/dashboard/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const dashboardSegment = pathname.split("/")[2];
  const routeRole = ["admin", "founder", "freelancer", "student"].includes(dashboardSegment)
    ? (dashboardSegment as UserRole)
    : null;

  const role = routeRole || profile?.role || "student";

  const links =
    role === "admin"
      ? adminLinks
      : role === "founder"
        ? founderLinks
        : role === "freelancer"
          ? freelancerLinks
          : studentLinks;

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-100 min-h-screen pt-6 hidden lg:block">
      <div className="px-5 mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {role} Dashboard
        </p>
      </div>
      <nav className="space-y-1 px-3">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-green-50 text-green-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
