"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { queryDocuments } from "@/services/firestoreService";
import { Code } from "lucide-react";

interface FreelancerData {
  id: string;
  name: string;
  skills: string[];
  availability: string;
  rating: number;
  projectsCompleted: number;
}

export default function AdminFreelancersPage() {
  const [freelancers, setFreelancers] = useState<FreelancerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await queryDocuments<FreelancerData>("freelancerProfiles", []);
        setFreelancers(data);
      } catch {
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const skillColors = ["bg-blue-50 text-blue-700 border-blue-100", "bg-purple-50 text-purple-700 border-purple-100", "bg-orange-50 text-orange-700 border-orange-100"];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Management</h1>
        <p className="text-gray-500 mt-2 text-lg">Monitor freelancer profiles and activity</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : freelancers.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Skills</th>
                  <th className="px-6 py-4 font-medium">Availability</th>
                  <th className="px-6 py-4 font-medium">Projects</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {freelancers.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {f.skills?.slice(0, 3).map((s, idx) => <span key={s} className={`px-3 py-0.5 text-xs font-medium rounded-full border ${skillColors[idx % skillColors.length]}`}>{s}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${f.availability === "available" ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>{f.availability}</span></td>
                    <td className="px-6 py-4 text-gray-600">{f.projectsCompleted || 0}</td>
                    <td className="px-6 py-4 text-gray-600">{f.rating || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">No freelancers registered</p>
            <p className="text-sm text-gray-500 mt-1">Freelancer profiles will appear here</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
