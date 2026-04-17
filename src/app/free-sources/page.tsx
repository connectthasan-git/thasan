"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { freeResourceService } from "@/features/free-resources/freeResourceService";
import { FreeResource } from "@/types/freeResource";
import { Search, BookOpen, Code, Video, FileText, Download, ExternalLink, Star, Filter, Sparkles, Globe, Layers } from "lucide-react";

const defaultCategories = ["AI & ML", "Web Dev", "Mobile", "Design", "Data Science", "DevOps", "Business"];

const typeIcons: Record<string, typeof BookOpen> = {
  Tool: Code,
  Course: BookOpen,
  Dataset: Layers,
  Platform: Globe,
  Bundle: Download,
  Documentation: FileText,
  Tutorial: Video,
};

export default function FreeSourcesPage() {
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await freeResourceService.getPublishedResources();
        setResources(data);
      } catch {
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set(defaultCategories);
    resources.forEach((resource) => {
      if (resource.category) categorySet.add(resource.category);
    });
    return ["All", ...Array.from(categorySet)];
  }, [resources]);

  const types = useMemo(() => {
    const typeSet = new Set(resources.map((resource) => resource.type).filter(Boolean));
    return ["All", ...Array.from(typeSet)];
  }, [resources]);

  const filtered = resources.filter((resource) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      !lowerQuery ||
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery) ||
      (resource.tags || []).some((tag) => tag.toLowerCase().includes(lowerQuery));
    const matchesCat = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesType = selectedType === "All" || resource.type === selectedType;
    return matchesSearch && matchesCat && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[50%] bg-emerald-400 rounded-full blur-[100px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-6">
              <Sparkles size={16} /> Curated by Thasan AI Team
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Free <span className="text-green-200">Resources</span> for Learners
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
              Hand-picked collection of the best free tools, courses, datasets, and platforms. Everything you need to learn, build, and grow — without spending a penny.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resources, tools, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 border-0 shadow-xl focus:ring-2 focus:ring-green-300 outline-none text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Filter size={18} className="text-gray-400 mt-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${selectedCategory === cat ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${selectedType === type ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource, i) => {
              const TypeIcon = typeIcons[resource.type] || BookOpen;
              const usersLabel = resource.usersLabel || (resource.usersCount ? `${resource.usersCount}+` : "");
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-500">{resource.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{resource.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{resource.description}</p>
                  {(resource.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(resource.tags || []).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-green-50 text-xs font-medium text-green-700">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {typeof resource.rating === "number" && (
                        <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {resource.rating.toFixed(1)}</span>
                      )}
                      {usersLabel && <span>{usersLabel} users</span>}
                    </div>
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                      >
                        Access <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                        Unavailable
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No resources match your filters. Try different keywords or categories.</p>
          </div>
        )}
      </section>

      {/* Submit Resource CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[100px] opacity-30" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">Know a Great Free Resource?</h2>
          <p className="text-green-100 text-lg max-w-xl mx-auto mb-8 relative z-10">
            Help the community grow by suggesting free tools, courses, and resources. Our team reviews and adds the best ones.
          </p>
          <Link href="/community" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-700 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-xl relative z-10">
            <Sparkles size={18} /> Share on Community
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
