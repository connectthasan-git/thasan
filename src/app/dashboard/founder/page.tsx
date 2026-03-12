"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Lightbulb, UsersRound, BarChart3, Flag, Rocket, ArrowRight } from "lucide-react";

export default function FounderDashboard() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const stats = [
    { icon: <Lightbulb className="w-6 h-6" />, label: "Startup Stage", value: "Ideation", color: "text-green-600 bg-green-50 border-green-100" },
    { icon: <UsersRound className="w-6 h-6" />, label: "Team Members", value: 0, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Milestones", value: "0/10", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { icon: <Flag className="w-6 h-6" />, label: "Mentors", value: 0, color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Founder Dashboard 🚀</h1>
        <p className="text-gray-500 mt-2 text-lg">Build, launch, and scale your startup</p>
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

      {/* Startup Journey */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Startup Journey</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {["Ideation", "Validation", "MVP Build", "Launch"].map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${i === 0 ? "bg-green-600 text-white shadow-lg shadow-green-600/25" : "bg-gray-100 text-gray-500"}`}>
                {stage}
              </div>
              {i < 3 && <ArrowRight className="w-4 h-4 text-gray-300 mx-2 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Startup</h2>
          <div className="text-center py-10 text-gray-400">
            <Rocket className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No startup registered yet</p>
            <p className="text-sm mt-1">Register your idea to get started with incubation</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mentorship</h2>
          <div className="space-y-3">
            {[
              { name: "Business Strategy", status: "Available", color: "bg-green-50 text-green-700 border-green-100" },
              { name: "Technical Mentoring", status: "Available", color: "bg-green-50 text-green-700 border-green-100" },
              { name: "Pitch Practice", status: "Coming Soon", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                <span className="text-sm font-medium text-gray-700">{m.name}</span>
                <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${m.color}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
