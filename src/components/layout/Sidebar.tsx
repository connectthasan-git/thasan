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
  { href: "/dashboard/freelancer/bids", label: "My Bids", icon: <Briefcase size={18} /> },
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
  { href: "/dashboard/admin/free-sources", label: "Free Sources", icon: <ClipboardList size={18} /> },
  { href: "/dashboard/admin/groups", label: "Groups", icon: <ShieldCheck size={18} /> },
  { href: "/dashboard/admin/community-courses", label: "Community Courses", icon: <GraduationCap size={18} /> },
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

  const roleLabel: Record<UserRole, string> = {
    admin: "Admin Workspace",
    founder: "Founder Studio",
    freelancer: "Freelancer Desk",
    mentor: "Mentor Console",
    student: "Student Hub",
  };

  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-green-100 bg-green-50/40">
      <div className="sticky top-16 h-[calc(100vh-4rem)]">
        <div className="bg-green-50/40 h-full overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-green-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-green-700/80">Workspace</p>
            <h2 className="mt-0.5 text-xs font-semibold text-green-900">{roleLabel[role]}</h2>
          </div>

          <nav className="px-2 py-1.5 space-y-0.5 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-sm text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-900"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-900"
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-green-600" />}
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
                      isActive
                        ? "bg-white text-green-700"
                        : "bg-transparent text-gray-500 group-hover:text-green-700"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-3 pb-2 pt-1">
            <div className="border-t border-green-100 pt-2">
              <p className="text-[10px] uppercase tracking-wide text-gray-400">Role</p>
              <p className="text-xs font-medium text-green-800 capitalize">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
