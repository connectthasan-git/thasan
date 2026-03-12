"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Pencil, Save, FileText, ArrowRight } from "lucide-react";

export default function FounderStartupPage() {
  const [editing, setEditing] = useState(false);
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Startup</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-2xl transition-all ${editing ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white border border-gray-200 text-gray-700 hover:border-green-200 hover:text-green-600"}`}
        >
          <Pencil className="w-4 h-4" />
          {editing ? "Cancel" : "Edit"}
        </button>
      </motion.div>

      {editing ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Register / Update Startup</h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Startup Name</label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all mt-2">
              <Save className="w-4 h-4" />
              Save Startup
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-5">
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-600">No startup registered</p>
            <p className="text-sm mt-2 text-gray-400">Click Edit to register your startup idea</p>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-900">Incubation Resources</h2>
        </div>
        <div className="space-y-3">
          {[
            { title: "Business Model Canvas Template", type: "Document", color: "bg-blue-50 text-blue-700 border-blue-100" },
            { title: "Pitch Deck Framework", type: "Template", color: "bg-purple-50 text-purple-700 border-purple-100" },
            { title: "Market Research Toolkit", type: "Tool", color: "bg-orange-50 text-orange-700 border-orange-100" },
            { title: "Legal & Compliance Guide", type: "Guide", color: "bg-green-50 text-green-700 border-green-100" },
          ].map((r) => (
            <div key={r.title} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-50 transition-colors group">
              <span className="text-sm font-medium text-gray-700">{r.title}</span>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${r.color}`}>{r.type}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
