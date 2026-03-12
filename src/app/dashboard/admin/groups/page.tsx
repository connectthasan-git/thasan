"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, CheckCircle, XCircle, Phone, Search, Filter } from "lucide-react";

interface GroupRequest {
  id: string;
  name: string;
  description: string;
  type: "study" | "project" | "social";
  maxMembers: number;
  hasVoiceCall: boolean;
  createdBy: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

const sampleRequests: GroupRequest[] = [
  { id: "g1", name: "Data Science Lab", description: "Practice data analysis, ML modeling, and Kaggle competitions together.", type: "project", maxMembers: 40, hasVoiceCall: true, createdBy: "Sneha Patel", createdAt: "2026-01-15", status: "pending" },
  { id: "g2", name: "Freelancer Mastermind", description: "Weekly calls to share tips, accountability, and client strategies.", type: "social", maxMembers: 25, hasVoiceCall: true, createdBy: "Vikram Singh", createdAt: "2026-01-14", status: "pending" },
  { id: "g3", name: "React Study Group", description: "Learn React, hooks, and Next.js together with collaborative coding.", type: "study", maxMembers: 30, hasVoiceCall: false, createdBy: "Aisha Khan", createdAt: "2026-01-13", status: "pending" },
  { id: "g4", name: "AI Builders Hub", description: "Collaborate on AI/ML projects and share knowledge.", type: "project", maxMembers: 100, hasVoiceCall: true, createdBy: "Arjun Kumar", createdAt: "2026-01-10", status: "approved" },
  { id: "g5", name: "Web Dev Study Circle", description: "Weekly study sessions on React, Next.js, and modern web technologies.", type: "study", maxMembers: 50, hasVoiceCall: true, createdBy: "Priya Sharma", createdAt: "2026-01-08", status: "approved" },
];

export default function AdminGroupsPage() {
  const [requests, setRequests] = useState<GroupRequest[]>(sampleRequests);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = requests.filter((r) => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-gray-900">Group Management</h1>
        <p className="text-gray-500 mt-1">Review and approve community group requests and voice call licenses.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Pending Requests", value: pendingCount, color: "text-amber-600 bg-amber-50", icon: ShieldCheck },
          { label: "Active Groups", value: requests.filter((r) => r.status === "approved").length, color: "text-green-600 bg-green-50", icon: Users },
          { label: "Voice Call Licensed", value: requests.filter((r) => r.status === "approved" && r.hasVoiceCall).length, color: "text-blue-600 bg-blue-50", icon: Phone },
          { label: "Total Requests", value: requests.length, color: "text-gray-600 bg-gray-50", icon: Filter },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-2xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search groups or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all capitalize ${filterStatus === status ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"}`}
            >
              {status === "all" ? "All" : status} {status === "pending" && pendingCount > 0 ? `(${pendingCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Group Requests List */}
      <div className="space-y-4">
        {filtered.map((request, i) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-3xl p-6 border shadow-sm ${request.status === "pending" ? "border-amber-200" : "border-gray-100"}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${request.type === "study" ? "bg-blue-50" : request.type === "project" ? "bg-purple-50" : "bg-green-50"}`}>
                    <Users size={20} className={`${request.type === "study" ? "text-blue-600" : request.type === "project" ? "text-purple-600" : "text-green-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{request.name}</h3>
                    <span className="text-xs text-gray-400">by {request.createdBy} • {request.createdAt}</span>
                  </div>
                  {request.status === "pending" && <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Pending</span>}
                  {request.status === "approved" && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Approved</span>}
                  {request.status === "rejected" && <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Rejected</span>}
                </div>
                <p className="text-sm text-gray-500 mb-2">{request.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Max: {request.maxMembers} members</span>
                  <span className={`px-2 py-0.5 rounded-full ${request.type === "study" ? "bg-blue-50 text-blue-600" : request.type === "project" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"}`}>{request.type}</span>
                  {request.hasVoiceCall && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      <Phone size={10} /> Voice Call License
                    </span>
                  )}
                </div>
              </div>
              {request.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(request.id, "approved")}
                    className="px-5 py-2.5 rounded-2xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(request.id, "rejected")}
                    className="px-5 py-2.5 rounded-2xl bg-white text-red-600 font-semibold text-sm border border-red-200 hover:bg-red-50 transition-all flex items-center gap-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No group requests found.</p>
        </div>
      )}
    </div>
  );
}
