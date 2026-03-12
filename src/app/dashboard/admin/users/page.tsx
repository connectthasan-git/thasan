"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { queryDocuments, where } from "@/services/firestoreService";
import { UserProfile } from "@/types/user";
import { Search, Users } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const conditions = roleFilter !== "all" ? [where("role", "==", roleFilter)] : [];
        const data = await queryDocuments<UserProfile>("users", conditions);
        setUsers(data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter]);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    student: "bg-green-50 text-green-700 border-green-100",
    freelancer: "bg-blue-50 text-blue-700 border-blue-100",
    founder: "bg-purple-50 text-purple-700 border-purple-100",
    admin: "bg-red-50 text-red-700 border-red-100",
    mentor: "bg-orange-50 text-orange-700 border-orange-100",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage platform users and roles</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "student", "freelancer", "founder", "admin", "mentor"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2.5 text-sm rounded-full capitalize font-medium transition-all ${
                roleFilter === role
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-green-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : filtered.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${roleColors[u.role] || "bg-gray-50 text-gray-700 border-gray-100"}`}>{u.role}</span></td>
                    <td className="px-6 py-4"><span className="px-3 py-0.5 text-xs font-medium rounded-full border bg-green-50 text-green-700 border-green-100">Active</span></td>
                    <td className="px-6 py-4 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">No users found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
