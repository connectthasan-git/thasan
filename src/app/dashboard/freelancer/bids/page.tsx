"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { freelancerService } from "@/features/freelancers/freelancerService";
import { ProjectBid } from "@/types/freelancer";

const statusStyles: Record<ProjectBid["status"], string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  accepted: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

export default function FreelancerBidsPage() {
  const { user } = useAuth();
  const [bids, setBids] = useState<ProjectBid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    freelancerService
      .getBidsByUser(user.uid)
      .then(setBids)
      .catch(() => setBids([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
        <p className="text-gray-500 mt-2 text-lg">Track the bids you have submitted</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : bids.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{bid.projectTitle || "Project"}</td>
                    <td className="px-6 py-4 text-gray-600">₹ {bid.amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${statusStyles[bid.status]}`}>
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(bid.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="font-semibold text-gray-900">No bids yet</p>
            <p className="text-sm text-gray-500 mt-1">Browse projects and submit your first bid</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
