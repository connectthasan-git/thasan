"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, IndianRupee, BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  const metrics = [
    {
      title: "User Registration Trend",
      icon: <Users className="w-5 h-5" />,
      color: "text-green-600 bg-green-50 border-green-100",
      data: [
        { label: "This Week", value: 0 },
        { label: "This Month", value: 0 },
        { label: "Total", value: 0 },
      ],
    },
    {
      title: "Course Engagement",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      data: [
        { label: "Active Learners", value: 0 },
        { label: "Completion Rate", value: "0%" },
        { label: "Avg Rating", value: "N/A" },
      ],
    },
    {
      title: "Revenue Analytics",
      icon: <IndianRupee className="w-5 h-5" />,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      data: [
        { label: "This Month", value: "₹0" },
        { label: "Last Month", value: "₹0" },
        { label: "Total", value: "₹0" },
      ],
    },
    {
      title: "Platform Growth",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-orange-600 bg-orange-50 border-orange-100",
      data: [
        { label: "Freelancers", value: 0 },
        { label: "Startups", value: 0 },
        { label: "Mentors", value: 0 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-2 text-lg">Platform metrics and insights</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2.5 rounded-2xl border ${m.color}`}>{m.icon}</div>
              <h2 className="font-bold text-gray-900">{m.title}</h2>
            </div>
            <div className="space-y-3">
              {m.data.map((d) => (
                <div key={d.label} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                  <span className="text-sm text-gray-600">{d.label}</span>
                  <span className="font-bold text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
