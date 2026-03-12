"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthActions } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePhone, validatePassword } from "@/lib/validators";
import { CAREER_GOALS } from "@/lib/constants";
import toast from "react-hot-toast";
import Image from "next/image";
import { ArrowRight, User, Mail, Phone, MapPin, GraduationCap, Target, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { register, loading } = useAuthActions();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    college: "",
    degree: "",
    careerGoal: "" as "job" | "freelance" | "startup" | "",
    referralSource: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard/student");
    }
  }, [authLoading, router, user]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!form.name.trim()) errs.name = "Name is required";
    if (!validateEmail(form.email)) errs.email = "Invalid email";
    if (!validatePhone(form.phone)) errs.phone = "Invalid phone (10 digits)";
    const pwErr = validatePassword(form.password);
    if (pwErr) errs.password = pwErr;
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.college.trim()) errs.college = "College is required";
    if (!form.careerGoal) errs.careerGoal = "Select a career goal";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await register(
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          college: form.college,
          degree: form.degree,
          skillsInterest: [],
          careerGoal: form.careerGoal as "job" | "freelance" | "startup",
          referralSource: form.referralSource,
        },
        form.password,
      );
      toast.success("Registration successful! Welcome to Thasan.");
      router.push("/dashboard/student");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      toast.error(msg);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-11 pr-4 py-3 rounded-2xl border ${errors[field] ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-green-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 text-sm`;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[100px] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <Link href="/" className="flex items-center space-x-2 mb-12">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Image src="/assets/image.png" alt="Thasan AI" width={28} height={28} />
            </div>
            <span className="text-2xl font-bold">
              Thasan<span className="text-green-200">AI</span>
            </span>
          </Link>
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Start your journey to becoming a tech leader.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed max-w-md">
            Join 15,000+ students learning AI, building projects, and launching startups on Thasan AI.
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Industry-leading AI courses",
              "Real-world project experience",
              "Internship & job placement",
              "Startup incubation support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-green-100">
                <div className="w-5 h-5 rounded-full bg-green-400/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-300" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <Image src="/assets/image.png" alt="Thasan AI" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold text-gray-900">
              Thasan<span className="text-green-600">AI</span>
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass("name")} />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass("email")} />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="9876543210" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass("phone")} />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="City, State" value={form.location} onChange={(e) => update("location", e.target.value)} className={inputClass("location")} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">College / School *</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="Your institution" value={form.college} onChange={(e) => update("college", e.target.value)} className={inputClass("college")} />
                </div>
                {errors.college && <p className="mt-1 text-xs text-red-500">{errors.college}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Degree / Course</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input placeholder="B.Tech, BCA, etc." value={form.degree} onChange={(e) => update("degree", e.target.value)} className={inputClass("degree")} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Career Goal *</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={form.careerGoal}
                  onChange={(e) => update("careerGoal", e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${errors.careerGoal ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 text-sm appearance-none`}
                >
                  <option value="">Select career goal</option>
                  {CAREER_GOALS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              {errors.careerGoal && <p className="mt-1 text-xs text-red-500">{errors.careerGoal}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">How did you hear about us?</label>
              <input
                placeholder="Social media, friend, etc."
                value={form.referralSource}
                onChange={(e) => update("referralSource", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} className={inputClass("password")} />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className={inputClass("confirmPassword")} />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
