"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, Briefcase, IndianRupee, BarChart3, Clock } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { icon: <Users className="w-6 h-6" />, label: "Total Users", value: "0", color: "text-green-600 bg-green-50 border-green-100" },
    { icon: <GraduationCap className="w-6 h-6" />, label: "Active Courses", value: "0", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { icon: <Briefcase className="w-6 h-6" />, label: "Internships", value: "0", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { icon: <IndianRupee className="w-6 h-6" />, label: "Revenue", value: "₹0", color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard 🛡️</h1>
        <p className="text-gray-500 mt-2 text-lg">Platform overview and management</p>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: "New user registered", time: "Just now", type: "user", color: "bg-green-50 text-green-700 border-green-100" },
              { action: "Course submitted for review", time: "2h ago", type: "course", color: "bg-blue-50 text-blue-700 border-blue-100" },
              { action: "Internship completed", time: "5h ago", type: "internship", color: "bg-orange-50 text-orange-700 border-orange-100" },
              { action: "Payment processed", time: "1d ago", type: "payment", color: "bg-purple-50 text-purple-700 border-purple-100" },
            ].map((a) => (
              <div key={a.action} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{a.action}</p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${a.color}`}>{a.type}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Actions</h2>
          <div className="space-y-3">
            {[
              { action: "Review course submissions", count: 0 },
              { action: "Approve internship applications", count: 0 },
              { action: "Process payments", count: 0 },
              { action: "Review project submissions", count: 0 },
            ].map((a) => (
              <div key={a.action} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                <span className="text-sm font-medium text-gray-700">{a.action}</span>
                <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${a.count > 0 ? "bg-yellow-50 text-yellow-700 border-yellow-100" : "bg-green-50 text-green-700 border-green-100"}`}>{a.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Platform Health */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Platform Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "User Growth", value: "0%", icon: <BarChart3 className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
            { label: "Course Completion", value: "0%", icon: <GraduationCap className="w-5 h-5" />, color: "text-blue-600 bg-blue-50" },
            { label: "Employment Rate", value: "0%", icon: <Briefcase className="w-5 h-5" />, color: "text-orange-600 bg-orange-50" },
            { label: "Satisfaction", value: "N/A", icon: <Users className="w-5 h-5" />, color: "text-purple-600 bg-purple-50" },
          ].map((m) => (
            <div key={m.label} className="text-center p-5 bg-gray-50/80 rounded-2xl">
              <div className={`w-10 h-10 rounded-2xl ${m.color} flex items-center justify-center mx-auto mb-3`}>{m.icon}</div>
              <p className="text-xl font-bold text-gray-900">{m.value}</p>
              <p className="text-xs text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
