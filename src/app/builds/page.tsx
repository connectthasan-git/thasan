"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { queryDocuments, orderBy } from "@/services/firestoreService";
import type { StudentBuild } from "@/types/studentBuild";
import { ArrowUpRight, Code2, ExternalLink, Search, Sparkles } from "lucide-react";

const sampleBuilds: StudentBuild[] = [
  {
    id: "sample-1",
    userId: "demo-user-1",
    studentName: "Ananya Rao",
    title: "Career Resume Scorer",
    summary: "AI-powered resume scanner with role-fit scoring, keyword feedback, and ATS hints.",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/resume-scorer",
    tags: ["llm", "nextjs", "career"],
    createdAt: new Date().toISOString(),
    isFeatured: true,
  },
  {
    id: "sample-2",
    userId: "demo-user-2",
    studentName: "Harsh Patel",
    title: "Founder Idea Validator",
    summary: "Tool that validates startup ideas with market prompts, ICP checks, and launch tasks.",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/idea-validator",
    tags: ["startup", "ai", "product"],
    createdAt: new Date().toISOString(),
    isFeatured: true,
  },
  {
    id: "sample-3",
    userId: "demo-user-3",
    studentName: "Maya Thomas",
    title: "Prompt Workflow Builder",
    summary: "Visual builder to chain prompts and automate repetitive content workflows.",
    liveUrl: "https://example.com",
    tags: ["automation", "workflow", "ui"],
    createdAt: new Date().toISOString(),
  },
];

export default function BuildsPage() {
  const [builds, setBuilds] = useState<StudentBuild[]>(sampleBuilds);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const data = await queryDocuments<StudentBuild>("studentBuilds", [orderBy("createdAt", "desc")]);
        if (data.length > 0) {
          setBuilds(data);
        }
      } catch {
        setBuilds(sampleBuilds);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, []);

  const filteredBuilds = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return builds;

    return builds.filter((build) => {
      const haystack = `${build.title} ${build.summary} ${build.studentName} ${(build.tags || []).join(" ")}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [builds, search]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-20">
        <div className="absolute top-[-20%] right-[-8%] w-[38%] h-[56%] bg-amber-200 rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-[-30%] left-[-12%] w-[44%] h-[64%] bg-emerald-200 rounded-full blur-[120px] opacity-35" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 mb-6">
              <Sparkles size={14} /> Real student output
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 max-w-3xl leading-tight">
              Student Build Gallery
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl">
              Not testimonials. Actual products built by students. Open each one, test it live, and judge the quality yourself.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full md:w-[420px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, student, or stack"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
            </div>
          ) : filteredBuilds.length === 0 ? (
            <div className="text-center bg-white border border-gray-100 rounded-3xl p-16 shadow-sm">
              <Code2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900">No builds match your search</h2>
              <p className="text-gray-500 mt-2">Try a different keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilds.map((build, index) => (
                <motion.article
                  key={build.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.28 }}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">{build.title}</h2>
                    {build.isFeatured && (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Built by {build.studentName}</p>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-5">{build.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(build.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={build.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors"
                    >
                      View Live <ExternalLink size={15} />
                    </a>
                    {build.githubUrl ? (
                      <a
                        href={build.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
                      >
                        Code <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                        Build yours <ArrowUpRight size={15} />
                      </Link>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
