"use client";

import { motion } from "framer-motion";
import { Users, MessageCircle, Calendar, ArrowRight } from "lucide-react";

export default function StudentCommunityPage() {
  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900">Community</motion.h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xl font-semibold text-gray-900">Join the community</p>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Connect with peers, share projects, and attend events.</p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>Discussions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Events</span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all">
            Explore Community
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
