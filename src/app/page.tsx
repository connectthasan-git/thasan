"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { SOCIAL_LINKS } from "@/lib/constants";
import {
  BookOpen,
  Code,
  Briefcase,
  Rocket,
  Users,
  Zap,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
} from "lucide-react";

/* ─── Sub-components ─── */

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number }>;
  value: string;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center"
    >
      <div className="bg-green-50 p-3 rounded-xl mb-4 text-green-600">
        <Icon size={24} />
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">
        {label}
      </p>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300"
    >
      <div className="bg-gray-50 group-hover:bg-green-600 group-hover:text-white p-4 rounded-2xl w-fit transition-colors duration-300 mb-6 text-green-600">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Step({
  number,
  title,
  icon: Icon,
  isLast,
}: {
  number: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isLast?: boolean;
}) {
  return (
    <div className="flex flex-col items-center relative group flex-1">
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-1/2 w-full h-[2px] bg-gray-100 -z-10">
          <div className="h-full bg-green-200 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      )}
      <div className="bg-white border-4 border-gray-50 shadow-sm group-hover:border-green-500 w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300">
        <Icon size={32} className="text-green-600" />
      </div>
      <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
        Step {number}
      </span>
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
    </div>
  );
}

function CourseCard({
  title,
  instructor,
  duration,
  category,
  level,
}: {
  title: string;
  instructor: string;
  duration: string;
  category: string;
  level: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative">
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-green-600 shadow-sm">
          {category}
        </div>
        <Zap className="text-green-600/30 w-16 h-16" />
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs font-medium text-gray-400">{level}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-xs font-medium text-gray-400">{duration}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 h-14 overflow-hidden">
          {title}
        </h3>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <span className="text-sm font-medium text-gray-700">{instructor}</span>
          </div>
          <ArrowRight size={20} className="text-green-600" />
        </div>
      </div>
    </div>
  );
}

function Testimonial({
  name,
  role,
  quote,
  delay,
}: {
  name: string;
  role: string;
  quote: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative"
    >
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard Simulation ─── */

const SIDEBAR_ITEMS = ["Dashboard", "My Courses", "Projects", "Internships", "Community"];
const CHART_HEIGHTS = [40, 65, 50, 80, 55, 90, 70];
const METRIC_CARDS = [
  { label: "Active Users", value: "1,284", change: "+12%", color: "green" },
  { label: "Courses Done", value: "847", change: "+8%", color: "blue" },
  { label: "Revenue", value: "₹4.2L", change: "+23%", color: "purple" },
];

function DashboardSimulation() {
  const [activeSidebar, setActiveSidebar] = useState(0);
  const [chartPhase, setChartPhase] = useState(0);
  const [typingWidth, setTypingWidth] = useState(0);
  const [notification, setNotification] = useState(false);
  const [progressValues, setProgressValues] = useState([0, 0, 0]);

  useEffect(() => {
    // cycle active sidebar item
    const sidebarTimer = setInterval(() => setActiveSidebar((p) => (p + 1) % SIDEBAR_ITEMS.length), 2200);
    // animate chart bars
    const chartTimer = setInterval(() => setChartPhase((p) => p + 1), 1800);
    // typing simulation
    const typingTimer = setInterval(() => {
      setTypingWidth(0);
      let w = 0;
      const typeStep = setInterval(() => {
        w += Math.random() * 15 + 5;
        if (w >= 100) { clearInterval(typeStep); setTypingWidth(100); }
        else setTypingWidth(w);
      }, 80);
    }, 4000);
    // notification pulse
    const notifTimer = setInterval(() => {
      setNotification(true);
      setTimeout(() => setNotification(false), 1500);
    }, 5000);
    // progress bars
    const progressTimer = setInterval(() => {
      setProgressValues([
        Math.min(30 + Math.random() * 70, 100),
        Math.min(20 + Math.random() * 60, 100),
        Math.min(40 + Math.random() * 50, 100),
      ]);
    }, 3000);

    // kick off initial animations
    setTimeout(() => setProgressValues([72, 45, 88]), 500);
    setTimeout(() => setTypingWidth(60), 300);

    return () => {
      clearInterval(sidebarTimer);
      clearInterval(chartTimer);
      clearInterval(typingTimer);
      clearInterval(notifTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="relative aspect-[16/9] rounded-3xl bg-gray-900 overflow-hidden shadow-2xl border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="h-4 sm:h-5 w-32 sm:w-48 bg-white/5 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/10 rounded-full transition-all duration-300 ease-out" style={{ width: `${typingWidth}%` }} />
            </div>
          </div>
          {/* Notification dot */}
          <div className="relative">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/10 rounded-md" />
            {notification && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
            {notification && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-6 h-[calc(100%-40px)] sm:h-[calc(100%-52px)]">
          {/* Sidebar */}
          <div className="col-span-1 space-y-2 sm:space-y-3">
            <div className="h-6 sm:h-8 w-16 sm:w-20 bg-green-500/20 rounded-lg" />
            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              {SIDEBAR_ITEMS.map((item, i) => (
                <div
                  key={item}
                  className={`h-5 sm:h-6 rounded-lg transition-all duration-500 ease-out flex items-center px-1.5 sm:px-2 ${
                    activeSidebar === i
                      ? "bg-green-500/30 border border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.15)]"
                      : "bg-white/5"
                  }`}
                >
                  <div
                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
                      activeSidebar === i ? "bg-green-400/80 w-3/4" : "bg-white/15 w-1/2"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="col-span-3 space-y-2 sm:space-y-4 overflow-hidden">
            {/* Metric cards */}
            <div className="flex gap-2 sm:gap-4">
              {METRIC_CARDS.map((card, i) => {
                const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                  green: { bg: "bg-green-500/20", border: "border-green-500/20", text: "text-green-400" },
                  blue: { bg: "bg-blue-500/20", border: "border-blue-500/20", text: "text-blue-400" },
                  purple: { bg: "bg-purple-500/20", border: "border-purple-500/20", text: "text-purple-400" },
                };
                const c = colorMap[card.color];
                return (
                  <motion.div
                    key={card.label}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className={`flex-1 h-14 sm:h-20 ${c.bg} rounded-lg sm:rounded-xl border ${c.border} p-2 sm:p-3 flex flex-col justify-between`}
                  >
                    <div className="h-1.5 sm:h-2 w-1/2 bg-white/20 rounded-full" />
                    <div className="flex items-end justify-between">
                      <div className="h-4 sm:h-6 w-1/3 bg-white/15 rounded-md sm:rounded-lg" />
                      <div className={`text-[8px] sm:text-[10px] font-bold ${c.text}`}>{card.change}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Chart + progress area */}
            <div className="flex-1 bg-white/5 rounded-lg sm:rounded-xl border border-white/5 p-2 sm:p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <div className="h-2 sm:h-3 w-1/4 bg-white/15 rounded-full" />
                <div className="flex gap-1 sm:gap-2">
                  {["bg-green-400/40", "bg-blue-400/40", "bg-purple-400/40"].map((c) => (
                    <div key={c} className={`h-2 w-4 sm:h-2.5 sm:w-6 ${c} rounded-full`} />
                  ))}
                </div>
              </div>

              <div className="flex-1 flex gap-1 sm:gap-2">
                {/* Bar chart */}
                <div className="flex-1 flex items-end gap-0.5 sm:gap-1.5">
                  {CHART_HEIGHTS.map((h, i) => {
                    const animH = ((h + (chartPhase * 13 * (i + 1))) % 80) + 20;
                    return (
                      <div key={i} className="flex-1 flex flex-col justify-end h-full">
                        <div
                          className={`rounded-t-sm sm:rounded-t transition-all duration-1000 ease-in-out ${
                            i % 3 === 0 ? "bg-green-400/40" : i % 3 === 1 ? "bg-blue-400/30" : "bg-purple-400/30"
                          }`}
                          style={{ height: `${animH}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Progress section */}
                <div className="w-1/3 space-y-1.5 sm:space-y-3 pl-2 sm:pl-4 border-l border-white/5">
                  {["AI Course", "Projects", "Internship"].map((label, i) => (
                    <div key={label} className="space-y-0.5 sm:space-y-1">
                      <div className="flex justify-between">
                        <div className="h-1.5 sm:h-2 w-2/3 bg-white/10 rounded-full" />
                        <span className="text-[7px] sm:text-[9px] text-white/40 font-mono">{Math.round(progressValues[i])}%</span>
                      </div>
                      <div className="h-1 sm:h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            i === 0 ? "bg-green-400/60" : i === 1 ? "bg-blue-400/60" : "bg-purple-400/60"
                          }`}
                          style={{ width: `${progressValues[i]}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Activity indicator */}
                  <div className="pt-1 sm:pt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <div className="h-1 sm:h-1.5 w-2/3 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50/60 via-white to-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-200/40 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-15%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-green-300/20 rounded-full blur-[80px]" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 lg:pt-20 lg:pb-16">
          {/* Top Badge Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-600/10 text-green-700 text-sm font-semibold border border-green-200/60 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              Next Enrollment Open — Limited Seats
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6">
              <span className="text-gray-900">Learn AI. Build Projects.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-[size:200%_auto] animate-[gradient_3s_ease-in-out_infinite]">
                Launch Your Future.
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center text-lg md:text-xl text-gray-500 mb-10 leading-relaxed"
          >
            The ultimate ecosystem for the next generation of tech leaders.
            From zero to founder — skills, network, and real opportunities to dominate the AI era.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto group relative px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-300 flex items-center justify-center overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Learning
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/community"
              className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 text-gray-900 rounded-2xl font-bold text-lg transition-all duration-300 text-center"
            >
              Join Community
            </Link>
          </motion.div>

          {/* Inline Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-14"
          >
            {[
              { value: "15k+", label: "Students" },
              { value: "2.4k+", label: "Projects" },
              { value: "850+", label: "Internships" },
              { value: "120+", label: "Startups" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i !== 0 && <div className="w-px h-8 bg-gray-200 hidden md:block" />}
                <div className={i !== 0 ? "md:pl-4" : ""}>
                  <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Glow behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 via-emerald-300/20 to-green-400/20 rounded-[2.5rem] blur-2xl opacity-60" />

            <DashboardSimulation />

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-5 -right-5 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 items-center gap-3 hidden lg:flex"
            >
              <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                <Award size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900">Top AI Academy</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                  Ranked #1 for Projects
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 items-center gap-3 hidden lg:flex"
            >
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                <TrendingUp size={22} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900">95% Placement</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
                  Within 3 Months
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} value="15k+" label="Students Trained" />
            <StatCard icon={Code} value="2.4k+" label="Projects Built" />
            <StatCard icon={Briefcase} value="850+" label="Internships Provided" />
            <StatCard icon={Rocket} value="120+" label="Startups Launched" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-green-600 uppercase tracking-widest mb-3">
              The Ecosystem
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Everything you need to succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="AI Courses"
              description="Learn industry-standard AI tools, LLM fine-tuning, and prompt engineering from world-class experts."
            />
            <FeatureCard
              icon={Code}
              title="Real Projects"
              description="Ditch tutorials. Build production-grade applications with mentors and get hands-on experience."
            />
            <FeatureCard
              icon={Briefcase}
              title="Internships"
              description="Exclusive access to internship roles at leading AI labs and top-tier tech startups worldwide."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Freelancer Marketplace"
              description="Monetize your AI skills immediately. Connect with businesses looking for AI automation solutions."
            />
            <FeatureCard
              icon={Zap}
              title="Startup Incubation"
              description="Got a big idea? We provide the resources, cloud credits, and network to help you launch your SaaS."
            />
            <FeatureCard
              icon={Globe}
              title="Community Network"
              description="Join thousands of builders, researchers, and founders in our global private Discord server."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-20">
            Your Journey to Success
          </h2>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 justify-between">
            <Step number="1" title="Join Courses" icon={BookOpen} />
            <Step number="2" title="Build Projects" icon={Code} />
            <Step number="3" title="Get Certified" icon={Award} />
            <Step number="4" title="Secure Internship" icon={Briefcase} />
            <Step number="5" title="Launch Startup" icon={Rocket} isLast />
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-base font-bold text-green-600 uppercase tracking-widest mb-3">
                Course Catalog
              </h2>
              <p className="text-4xl font-extrabold text-gray-900">
                Learn from the best.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-green-600 font-bold flex items-center hover:translate-x-2 transition-transform"
            >
              View All Courses <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <CourseCard
              category="Automation"
              level="Intermediate"
              title="AI Automation Mastery: No-Code to Pro"
              instructor="Alex Chen"
              duration="12 Hours"
            />
            <CourseCard
              category="Business"
              level="Beginner"
              title="Freelancing with Generative AI"
              instructor="Sarah Miller"
              duration="8 Hours"
            />
            <CourseCard
              category="Entrepreneurship"
              level="Advanced"
              title="Startup Fundamentals for AI Founders"
              instructor="David Thasan"
              duration="16 Hours"
            />
            <CourseCard
              category="Engineering"
              level="Beginner"
              title="Full Stack Web Dev for AI Apps"
              instructor="Kevin Park"
              duration="24 Hours"
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-green-600 rounded-[3rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Users size={300} strokeWidth={1} />
            </div>
            <div className="relative z-10 max-w-xl text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                More than just a platform. A Movement.
              </h2>
              <p className="text-green-100 text-lg mb-10 leading-relaxed">
                Join a global network of ambitious individuals. Our community
                members run hackathons, organize localized learning groups, and
                form the backbone of the next generation of founders.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Monthly Global Hackathons",
                  "24/7 Founder Support Hub",
                  "Exclusive Job Board",
                  "Local Chapter Meetups",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center space-x-2 text-green-50 font-medium"
                  >
                    <CheckCircle2 size={18} className="text-green-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg"
              >
                Join the Community
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-1/3 relative z-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From learning the basics to leading their own ventures—see how our
              students are changing the world.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              name="Liam Reynolds"
              role="Founder, Echo AI"
              quote="The Startup Incubation program at Thasan AI was the catalyst for my company. I went from an idea to raising my first $200k in 4 months."
              delay={0}
            />
            <Testimonial
              name="Sofia Gupta"
              role="Senior AI Engineer"
              quote="The internship placement was life-changing. I'm now working on LLMs at a top lab, something I couldn't have done without the project portfolio I built here."
              delay={0.1}
            />
            <Testimonial
              name="Marcus Thorne"
              role="Freelance Consultant"
              quote="I replaced my 9-5 income in just 3 months of finishing the Freelance AI Automation course. The marketplace connection is incredibly valuable."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-green-600 rounded-[3rem] p-12 md:p-20 shadow-xl shadow-green-100"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Start Building Your Future Today
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Don&apos;t just watch the AI revolution—lead it. Join 15,000+
              students building the future on Thasan AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-xl shadow-lg transition-all text-center"
              >
                Get Started Now
              </Link>
              <Link
                href="/courses"
                className="w-full sm:w-auto px-10 py-5 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-2xl font-bold text-xl transition-all text-center"
              >
                Explore Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Image src="/assets/image.png" alt="Thasan AI" width={36} height={36} className="rounded-lg" />
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  Thasan<span className="text-green-600">AI</span>
                </span>
              </Link>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                The leading educational ecosystem for AI builders, freelancers,
                and entrepreneurs.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-900">Platform</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li>
                  <Link href="/courses" className="hover:text-green-600">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-green-600">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-green-600">
                    Internships
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-green-600">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-900">Ecosystem</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li>
                  <Link href="/community" className="hover:text-green-600">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/clubs" className="hover:text-green-600">
                    Clubs
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-green-600">
                    Freelance Portal
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-green-600">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-900">Company</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li>
                  <Link href="/" className="hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-green-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-green-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-green-600">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm">
              &copy; 2026 Thasan AI Platform. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors">
                WhatsApp
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
