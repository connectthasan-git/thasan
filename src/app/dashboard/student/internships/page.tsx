"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, ArrowRight } from "lucide-react";

export default function StudentInternshipsPage() {
  const { profile } = useAuth();
  const isEligible = profile?.internshipStatus === "eligible" || profile?.internshipStatus === "active";

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900">Internships</motion.h1>

      {/* Eligibility Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${isEligible ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Internship Status</p>
            <span className={`inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full border ${isEligible ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>
              {profile?.internshipStatus || "Not Eligible"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Requirements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Eligibility Requirements</h2>
        <ul className="space-y-3">
          {[
            "Complete at least one course",
            "Submit a real-world project",
            "Pass skill assessment test",
            "Maintain good performance rating",
          ].map((req) => (
            <li key={req} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl">
              <CheckCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{req}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Available Internships */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Internships</h2>
        <div className="space-y-3">
          {[
            { title: "AI Automation Development", duration: "8 weeks", category: "automation", color: "bg-purple-50 text-purple-700 border-purple-100" },
            { title: "Community Building Intern", duration: "4 weeks", category: "community", color: "bg-blue-50 text-blue-700 border-blue-100" },
            { title: "Research & Analysis", duration: "6 weeks", category: "research", color: "bg-orange-50 text-orange-700 border-orange-100" },
          ].map((i) => (
            <div key={i.title} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-50 transition-colors group">
              <div>
                <p className="font-semibold text-gray-900">{i.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{i.duration}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${i.color}`}>{i.category}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
