"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDocument } from "@/services/firestoreService";
import { formatCurrency } from "@/lib/helpers";
import type { Course } from "@/types/course";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { Clock, Users, Star, GraduationCap, CheckCircle, ShieldCheck } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getDocument<Course>("courses", courseId);
      setCourse(data);
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  const handleEnroll = () => {
    if (!user) { toast.error("Please login to enroll"); return; }
    toast.success("Enrolled successfully! Check your dashboard.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center">
        <GraduationCap className="text-gray-300 mb-4" size={64} />
        <h1 className="text-2xl font-extrabold text-gray-900">Course Not Found</h1>
        <p className="text-gray-500 mt-2">This course may not exist or has been removed.</p>
        <Link href="/courses" className="mt-6 px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-200">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[50%] bg-emerald-400 rounded-full blur-[100px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-4">{course.category.replace("-", " ")}</span>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{course.title}</h1>
              <p className="text-green-100 text-lg mb-8 max-w-xl">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-green-200 text-sm">
                <span className="flex items-center gap-2"><GraduationCap size={18} /> {course.instructor}</span>
                <span className="flex items-center gap-2"><Clock size={18} /> {course.duration}</span>
                <span className="flex items-center gap-2"><Users size={18} /> {course.enrolledCount} students</span>
                <span className="flex items-center gap-2"><Star size={18} /> {course.rating}</span>
              </div>
            </motion.div>

            {/* Enroll Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl">
              <div className="text-4xl font-extrabold text-green-600 mb-6">
                {course.price === 0 ? "Free" : formatCurrency(course.price)}
              </div>
              <button onClick={handleEnroll} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-green-200 mb-6">
                Enroll Now
              </button>
              <ul className="space-y-3">
                {["modules included", "Real project experience", "Certificate on completion", "Mentor support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    {i === 0 ? `${course.modules.length || 5} ${item}` : item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Will Learn */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-extrabold text-gray-900 mb-10">What You Will Learn</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {["Build real-world projects", "Hands-on practice with tools", "Industry-relevant skills", "Portfolio development", "Peer collaboration", "Certification & skill badges"].map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="mx-auto text-green-600 mb-4" size={40} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Learn with Confidence</h3>
          <p className="text-gray-500 max-w-md mx-auto">All courses include project work, mentor support, and industry-recognized certification.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Thasan AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
