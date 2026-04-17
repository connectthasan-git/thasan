"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";

export default function FreelancerProjectsPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all"
        >
          Browse Projects
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 flex-wrap">
        {["All", "Active", "Completed", "Pending"].map((tab, i) => (
          <button key={tab} className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${i === 0 ? "bg-green-600 text-white shadow-lg shadow-green-600/25" : "bg-white border border-gray-200 text-gray-600 hover:border-green-200 hover:text-green-600"}`}>
            {tab}
          </button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="text-center py-6 text-gray-400">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-600">No projects yet</p>
          <p className="text-sm mt-2">Apply to available projects and start earning</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">How It Works</h2>
        <div className="flex items-center gap-3 mt-4 text-sm flex-wrap">
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-medium border border-blue-100">Browse Projects</span>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <span className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-2xl font-medium border border-yellow-100">Apply</span>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-2xl font-medium border border-purple-100">Get Assigned</span>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <span className="px-4 py-2 bg-green-50 text-green-700 rounded-2xl font-medium border border-green-100">Deliver & Earn</span>
        </div>
      </motion.div>
    </div>
  );
}
