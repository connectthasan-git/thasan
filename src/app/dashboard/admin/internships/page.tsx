"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { queryDocuments } from "@/services/firestoreService";
import { Internship } from "@/types/internship";
import { Briefcase, Plus } from "lucide-react";

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await queryDocuments<Internship>("internships", []);
        setInternships(data);
      } catch {
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internship Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage internship programs for students</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow-lg shadow-green-600/25 hover:bg-green-700 transition-all">
          <Plus className="w-5 h-5" />
          Create Internship
        </button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : internships.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Applicants</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {internships.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{i.title}</td>
                    <td className="px-6 py-4"><span className="px-3 py-0.5 text-xs font-medium rounded-full border bg-blue-50 text-blue-700 border-blue-100">{i.category}</span></td>
                    <td className="px-6 py-4 text-gray-600">{i.duration}</td>
                    <td className="px-6 py-4 text-gray-600">{i.maxSlots || 0}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${i.status === "open" ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}>{i.status}</span></td>
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
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">No internships yet</p>
            <p className="text-sm text-gray-500 mt-1">Create internship programs for your students</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
