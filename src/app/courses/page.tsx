"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { COURSE_CATEGORIES } from "@/lib/constants";
import { queryDocuments, where } from "@/services/firestoreService";
import type { Course } from "@/types/course";
import Navbar from "@/components/layout/Navbar";
import { Search, BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react";

const sampleCourses: Course[] = [
  { id: "1", title: "AI Automation Masterclass", description: "Learn to build AI-powered automation systems from scratch. Cover chatbots, workflow automation, and AI tools.", instructor: "Thasan Team", price: 2999, category: "ai-automation", modules: [], duration: "8 weeks", imageUrl: "", enrolledCount: 245, rating: 4.8, createdAt: new Date().toISOString() },
  { id: "2", title: "Digital Skills Bootcamp", description: "Master essential digital skills including marketing, design thinking, analytics, and content creation.", instructor: "Thasan Team", price: 1999, category: "digital-skills", modules: [], duration: "6 weeks", imageUrl: "", enrolledCount: 189, rating: 4.6, createdAt: new Date().toISOString() },
  { id: "3", title: "Freelancing Launchpad", description: "Start your freelancing career. Learn client acquisition, project management, proposals, and pricing strategies.", instructor: "Thasan Team", price: 0, category: "freelancing", modules: [], duration: "4 weeks", imageUrl: "", enrolledCount: 320, rating: 4.9, createdAt: new Date().toISOString() },
  { id: "4", title: "Startup Fundamentals", description: "From idea to MVP. Learn startup thinking, business models, fundraising basics, and go-to-market strategies.", instructor: "Thasan Team", price: 3499, category: "startup", modules: [], duration: "10 weeks", imageUrl: "", enrolledCount: 156, rating: 4.7, createdAt: new Date().toISOString() },
  { id: "5", title: "Full-Stack Web Development", description: "Build modern web applications with React, Next.js, Firebase, and Tailwind CSS. Deploy real projects.", instructor: "Thasan Team", price: 4999, category: "tech-development", modules: [], duration: "12 weeks", imageUrl: "", enrolledCount: 278, rating: 4.8, createdAt: new Date().toISOString() },
  { id: "6", title: "AI Tools for Productivity", description: "Master ChatGPT, automation tools, and AI-powered workflows to 10x your productivity and output.", instructor: "Thasan Team", price: 999, category: "ai-automation", modules: [], duration: "3 weeks", imageUrl: "", enrolledCount: 412, rating: 4.9, createdAt: new Date().toISOString() },
];

const categoryIcons: Record<string, string> = { "ai-automation": "bg-purple-100 text-purple-600", "digital-skills": "bg-blue-100 text-blue-600", freelancing: "bg-amber-100 text-amber-600", startup: "bg-rose-100 text-rose-600", "tech-development": "bg-green-100 text-green-600" };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const constraints = category ? [where("category", "==", category)] : [];
        const data = await queryDocuments<Course>("courses", constraints);
        if (data.length > 0) setCourses(data);
      } catch { /* sample fallback */ }
    };
    fetchCourses();
  }, [category]);

  const filtered = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[50%] bg-emerald-400 rounded-full blur-[100px] opacity-20" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <BookOpen size={16} /> Expert-led courses for every career path
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Explore Courses</h1>
          <p className="text-green-100 max-w-2xl mx-auto text-lg">Build real-world skills with our expert-led courses in AI, tech, freelancing, and startups.</p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${!category ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                onClick={() => setCategory("")}
              >All</button>
              {COURSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${category === cat.value ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  onClick={() => setCategory(cat.value)}
                >{cat.label}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No courses found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                  <Link href={`/courses/${course.id}`}>
                    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className={`h-40 ${categoryIcons[course.category]?.split(" ")[0] || "bg-green-100"} flex items-center justify-center`}>
                        <BookOpen className={`${categoryIcons[course.category]?.split(" ")[1] || "text-green-600"}`} size={48} />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">{course.category.replace("-", " ")}</span>
                          {course.price === 0 && <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">Free</span>}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{course.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                          <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                          <span className="flex items-center gap-1"><Users size={14} /> {course.enrolledCount}</span>
                          <span className="flex items-center gap-1"><Star size={14} /> {course.rating}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-green-600">{course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}</span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:gap-2 transition-all">View <ArrowRight size={16} /></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
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
