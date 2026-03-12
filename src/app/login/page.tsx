"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthActions } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/lib/validators";
import toast from "react-hot-toast";
import Image from "next/image";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { login, googleLogin, loading } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const redirectTo = searchParams.get("redirect") || "/dashboard/student";

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo);
    }
  }, [authLoading, redirectTo, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!validateEmail(email)) errs.email = "Invalid email address";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push(redirectTo);
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Welcome!");
      router.push(redirectTo);
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
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
            Welcome back to your learning journey.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed max-w-md">
            Continue building your skills, growing your network, and shaping your future with Thasan AI.
          </p>
          <div className="flex items-center gap-8 mt-12 text-green-200 text-sm font-medium">
            <div>
              <div className="text-3xl font-bold text-white">15k+</div>
              Students
            </div>
            <div>
              <div className="text-3xl font-bold text-white">2.4k+</div>
              Projects
            </div>
            <div>
              <div className="text-3xl font-bold text-white">120+</div>
              Startups
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <Image src="/assets/image.png" alt="Thasan AI" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-bold text-gray-900">
              Thasan<span className="text-green-600">AI</span>
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-500 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors mb-6 font-medium text-gray-700"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${errors.email ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-green-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${errors.password ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-green-500"} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50`}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  Sign In
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
