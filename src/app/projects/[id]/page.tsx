"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ExternalLink, IndianRupee, Users, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { freelancerService } from "@/features/freelancers/freelancerService";
import { useAuth } from "@/context/AuthContext";
import { ClientProject, ProjectBid } from "@/types/freelancer";

const statusColors: Record<ProjectBid["status"], string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  accepted: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [project, setProject] = useState<ClientProject | null>(null);
  const [bids, setBids] = useState<ProjectBid[]>([]);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ amount: "", proposal: "" });

  const fetchProject = async () => {
    try {
      const data = await freelancerService.getProject(id);
      setProject(data);
    } catch {
      setProject(null);
    }
  };

  const fetchBids = async () => {
    try {
      const data = await freelancerService.getBidsForProject(id);
      setBids(data);
    } catch {
      setBids([]);
    }
  };

  useEffect(() => {
    const run = async () => {
      setFetching(true);
      await Promise.all([fetchProject(), fetchBids()]);
      setFetching(false);
    };
    run();
  }, [id]);

  const bidCount = useMemo(() => bids.length, [bids.length]);

  const submitBid = async () => {
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/projects/${id}`)}`);
      return;
    }
    if (!form.amount || !form.proposal) {
      setError("Please provide both bid amount and proposal.");
      return;
    }
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Bid amount must be a valid number.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await freelancerService.createBid({
        projectId: id,
        projectTitle: project?.title,
        bidderId: user.uid,
        bidderName: profile?.name || "",
        amount,
        proposal: form.proposal.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      setForm({ amount: "", proposal: "" });
      await fetchBids();
      if (project) {
        await freelancerService.updateProject(project.id, {
          bidsCount: bidCount + 1,
        });
      }
    } catch {
      setError("Unable to submit bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
          <p className="text-gray-500 mt-2">The project may have been removed.</p>
          <Button className="mt-6" onClick={() => router.push("/projects")}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-500 mt-2">Posted by {project.clientName || "Project Owner"}</p>
            </div>
            <div className="flex items-center gap-3">
              {user?.uid === project.clientId && (
                <div className="flex items-center gap-3">
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm("Delete this project?");
                      if (!confirmed) return;
                      try {
                        await freelancerService.deleteProject(project.id);
                        router.push("/projects");
                      } catch {
                        setError("Unable to delete project. Please try again.");
                      }
                    }}
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
              <span className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
                {project.status}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-6">
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
              <Users className="w-4 h-4" />
              {bidCount} bids
            </span>
          </div>
          {(project.skills || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {project.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                  {skill}
                </span>
              ))}
            </div>
          )}
          {project.attachmentLink && (
            <a
              href={project.attachmentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 mt-5"
            >
              View Attachment <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bids</h2>
            {bids.length === 0 ? (
              <p className="text-gray-500 text-sm">No bids yet. Be the first to bid.</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{bid.bidderName || "Freelancer"}</p>
                        <p className="text-xs text-gray-400">{new Date(bid.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[bid.status]}`}>
                        {bid.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{bid.proposal}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-3">₹ {bid.amount.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Place Your Bid</h2>
            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                label="Bid Amount (INR)"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="45000"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proposal</label>
                <textarea
                  value={form.proposal}
                  onChange={(e) => setForm((prev) => ({ ...prev, proposal: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                />
              </div>
              <Button loading={submitting} onClick={submitBid} className="w-full">
                Submit Bid
              </Button>
              {!loading && !user && (
                <p className="text-xs text-gray-500 text-center">Login required to submit a bid.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
