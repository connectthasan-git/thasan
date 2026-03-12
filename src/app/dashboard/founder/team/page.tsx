"use client";

import { motion } from "framer-motion";
import { UsersRound, Plus } from "lucide-react";

export default function FounderTeamPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team</h1>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
            <UsersRound className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-600">No team members yet</p>
          <p className="text-sm mt-2 text-gray-400">Invite team members to collaborate on your startup</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Roles You Can Assign</h2>
        <div className="flex gap-2 flex-wrap">
          {[
            { role: "Co-Founder", color: "bg-green-50 text-green-700 border-green-100" },
            { role: "Developer", color: "bg-blue-50 text-blue-700 border-blue-100" },
            { role: "Designer", color: "bg-purple-50 text-purple-700 border-purple-100" },
            { role: "Marketing", color: "bg-orange-50 text-orange-700 border-orange-100" },
            { role: "Operations", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
            { role: "Finance", color: "bg-red-50 text-red-700 border-red-100" },
          ].map((r) => (
            <span key={r.role} className={`px-4 py-2 text-sm font-medium rounded-full border ${r.color}`}>{r.role}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
