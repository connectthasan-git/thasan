"use client";

import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Download } from "lucide-react";

export default function FreelancerEarningsPage() {
  const earningStats = [
    { icon: <IndianRupee className="w-6 h-6" />, label: "Total Earned", value: "₹0", color: "text-green-600 bg-green-50 border-green-100" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "This Month", value: "₹0", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { icon: <Download className="w-6 h-6" />, label: "Pending", value: "₹0", color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900">Earnings</motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {earningStats.map((s, i) => (
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>
        <div className="text-center py-10 text-gray-400">
          <IndianRupee className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No transactions yet</p>
          <p className="text-sm mt-2">Your payment history will appear here</p>
        </div>
      </motion.div>
    </div>
  );
}
