"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { queryDocuments } from "@/services/firestoreService";
import { Course } from "@/types/course";
import { GraduationCap, Plus } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await queryDocuments<Course>("courses", []);
        setCourses(data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const catColors: Record<string, string> = {
    development: "bg-blue-50 text-blue-700 border-blue-100",
    design: "bg-purple-50 text-purple-700 border-purple-100",
    business: "bg-orange-50 text-orange-700 border-orange-100",
    marketing: "bg-pink-50 text-pink-700 border-pink-100",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Create and manage platform courses</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow-lg shadow-green-600/25 hover:bg-green-700 transition-all">
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : courses.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Enrolled</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${catColors[c.category?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-100"}`}>{c.category}</span></td>
                    <td className="px-6 py-4 text-gray-600">{c.price === 0 ? "Free" : `₹${c.price}`}</td>
                    <td className="px-6 py-4 text-gray-600">{c.enrolledCount || 0}</td>
                    <td className="px-6 py-4"><span className="px-3 py-0.5 text-xs font-medium rounded-full border bg-green-50 text-green-700 border-green-100">Published</span></td>
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
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">No courses yet</p>
            <p className="text-sm text-gray-500 mt-1">Create your first course to get started</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
