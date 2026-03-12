"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Briefcase, IndianRupee, Star, Clock, ArrowRight } from "lucide-react";

export default function FreelancerDashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const stats = [
    { icon: <Briefcase className="w-6 h-6" />, label: "Active Projects", value: 0, color: "text-green-600 bg-green-50 border-green-100" },
    { icon: <IndianRupee className="w-6 h-6" />, label: "Total Earnings", value: "₹0", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { icon: <Star className="w-6 h-6" />, label: "Rating", value: "N/A", color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
    { icon: <Clock className="w-6 h-6" />, label: "Pending Tasks", value: 0, color: "text-orange-600 bg-orange-50 border-orange-100" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard 👨‍💻</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your projects and track earnings</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl border ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Projects</h2>
          <div className="text-center py-10 text-gray-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No active projects</p>
            <p className="text-sm mt-1">Browse available projects to get started</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Skills</h2>
          <div>
            {profile?.skills?.length ? (
              <div className="flex gap-2 flex-wrap">
                {profile.skills.map((s) => (
                  <span key={s} className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Add skills to your profile to get matched with projects</p>
            )}
          </div>
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Availability</p>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">Available</span>
          </div>
        </motion.div>
      </div>

      {/* Available Projects */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Projects</h2>
        <div className="space-y-3">
          {[
            { title: "Landing Page Design", budget: "₹15,000", skill: "UI/UX", deadline: "2 weeks", color: "bg-purple-50 text-purple-700 border-purple-100" },
            { title: "API Integration", budget: "₹25,000", skill: "Backend", deadline: "3 weeks", color: "bg-blue-50 text-blue-700 border-blue-100" },
            { title: "Social Media Automation", budget: "₹10,000", skill: "AI", deadline: "1 week", color: "bg-orange-50 text-orange-700 border-orange-100" },
          ].map((p) => (
            <div key={p.title} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-50 transition-colors group">
              <div>
                <p className="font-semibold text-gray-900">{p.title}</p>
                <div className="flex gap-2 mt-1.5 items-center">
                  <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${p.color}`}>{p.skill}</span>
                  <span className="text-xs text-gray-500">{p.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">{p.budget}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
