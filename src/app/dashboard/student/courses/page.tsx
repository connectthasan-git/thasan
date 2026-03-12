"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles, ArrowRight } from "lucide-react";

export default function StudentCoursesPage() {
  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900">My Courses</motion.h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="text-center py-6 text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold text-gray-600">No courses enrolled</p>
            <p className="text-sm mt-2">Browse our course catalog and start learning</p>
          </div>
        </div>
      </motion.div>

      {/* Recommended */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
        </div>
        <div className="space-y-3">
          {[
            { title: "AI Automation Masterclass", category: "AI", price: "₹2,999", color: "bg-purple-50 text-purple-700 border-purple-100" },
            { title: "Freelancing Launchpad", category: "Freelancing", price: "Free", color: "bg-green-50 text-green-700 border-green-100" },
            { title: "Startup Fundamentals", category: "Startup", price: "₹3,499", color: "bg-orange-50 text-orange-700 border-orange-100" },
          ].map((c) => (
            <div key={c.title} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-50 transition-colors group">
              <div>
                <p className="font-semibold text-gray-900">{c.title}</p>
                <span className={`inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full border ${c.color}`}>{c.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">{c.price}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
