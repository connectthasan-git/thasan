"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, IndianRupee, Sparkles, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { freelancerService } from "@/features/freelancers/freelancerService";
import { useAuth } from "@/context/AuthContext";
import { ClientProject } from "@/types/freelancer";

const categoryLabels: Record<ClientProject["category"], string> = {
  website: "Website",
  "ai-automation": "AI Automation",
  marketing: "Marketing",
  saas: "SaaS",
  "mobile-app": "Mobile App",
  other: "Other",
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const fetchProjects = async () => {
    setLoading(true);
      try {
        const data = await freelancerService.getAvailableProjects();
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === "mine" && user) {
      return projects.filter((project) => project.clientId === user.uid);
    }
    return projects;
  }, [filter, projects, user]);

  const handleDelete = async (projectId: string) => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;
    try {
      await freelancerService.deleteProject(projectId);
      setProjects((prev) => prev.filter((item) => item.id !== projectId));
    } catch {
      // No-op: list stays the same
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Projects</h1>
            <p className="text-gray-500 mt-2">Find projects and start bidding today</p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Post a Project
          </Link>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "bg-white border border-gray-200 text-gray-600 hover:border-green-200"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter("mine")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "mine"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "bg-white border border-gray-200 text-gray-600 hover:border-green-200"
            }`}
            disabled={!user}
          >
            My Posted Projects
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.clientName || "Project Owner"}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-50 text-xs font-semibold text-green-700 border border-green-100">
                    {categoryLabels[project.category]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-5">
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {project.budget.toLocaleString("en-IN")}
                  </span>
                  {project.deadline && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {project.deadline}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {project.bidsCount || 0} bids
                  </span>
                </div>
                {(project.skills || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
                  >
                    View & Bid
                  </Link>
                  {user?.uid === project.clientId && (
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 mt-10 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-700">No projects yet</p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === "mine" ? "You have not posted any projects yet." : "Be the first to post a project for freelancers."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
