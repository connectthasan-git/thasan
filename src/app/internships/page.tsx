"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { INTERNSHIP_CATEGORIES } from "@/lib/constants";
import { useInternships } from "@/features/internships/internshipHooks";
import { Briefcase, Search, MapPin, Clock, ArrowRight, Laptop2 } from "lucide-react";

const categoryColors: Record<string, string> = {
  automation: "bg-purple-50 text-purple-700 border-purple-100",
  "social-media": "bg-pink-50 text-pink-700 border-pink-100",
  "ai-tools": "bg-blue-50 text-blue-700 border-blue-100",
  research: "bg-orange-50 text-orange-700 border-orange-100",
  community: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "product-dev": "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export default function PublicInternshipsPage() {
  const { internships, loading } = useInternships();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredInternships = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return internships.filter((internship) => {
      const matchesCategory = !category || internship.category === category;
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm) ||
        internship.description.toLowerCase().includes(searchTerm) ||
        internship.project.toLowerCase().includes(searchTerm) ||
        (internship.company || "").toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [category, internships, search]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-900 text-white py-20">
        <div className="absolute top-[-20%] right-[-8%] w-[36%] h-[54%] bg-emerald-400 rounded-full blur-[110px] opacity-20" />
        <div className="absolute bottom-[-25%] left-[-10%] w-[40%] h-[60%] bg-cyan-400 rounded-full blur-[120px] opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Briefcase size={16} /> Open internships from the Thasan ecosystem
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold max-w-3xl leading-tight">
            Public Internship Board
          </h1>
          <p className="text-slate-200 mt-4 max-w-2xl text-lg">
            Browse internships before signing up. Discover real roles, real projects, and the skills each opportunity demands.
          </p>
        </motion.div>
      </section>

      <section className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by role, project, or company..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategory("")}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  !category ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {INTERNSHIP_CATEGORIES.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCategory(option.value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    category === option.value ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
              <h2 className="text-xl font-bold text-gray-900">No internships found</h2>
              <p className="text-gray-500 mt-2">Try a different keyword or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship, index) => (
                <motion.article
                  key={internship.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${categoryColors[internship.category] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {internship.category.replace("-", " ")}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${internship.status === "open" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                      {internship.status}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2">{internship.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-5">{internship.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{internship.duration}</span>
                    </div>
                    {(internship.location || internship.isRemote !== undefined) && (
                      <div className="flex items-center gap-2">
                        {internship.isRemote ? <Laptop2 size={14} /> : <MapPin size={14} />}
                        <span>{internship.isRemote ? "Remote" : internship.location}</span>
                      </div>
                    )}
                    {internship.company && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} />
                        <span>{internship.company}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mb-6 line-clamp-2">
                    <span className="font-semibold">Project:</span> {internship.project}
                  </p>

                  <button className="mt-auto w-full py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2">
                    View Details <ArrowRight size={16} />
                  </button>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Thasan AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
