"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { freelancerService } from "@/features/freelancers/freelancerService";
import { useAuth } from "@/context/AuthContext";

const categoryOptions = [
  { value: "website", label: "Website" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "marketing", label: "Marketing" },
  { value: "saas", label: "SaaS" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "other", label: "Other" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    skills: "",
    attachmentLink: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent("/projects/new")}`);
    }
  }, [loading, router, user]);

  const parsedSkills = useMemo(() => {
    return form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [form.skills]);

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.title || !form.description || !form.category || !form.budget) {
      setError("Please fill in title, description, category, and budget.");
      return;
    }

    const budgetValue = Number(form.budget);
    if (!Number.isFinite(budgetValue) || budgetValue <= 0) {
      setError("Budget must be a valid number.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const id = await freelancerService.createProject({
        clientId: user.uid,
        clientName: profile?.name || "",
        title: form.title.trim(),
        description: form.description.trim(),
        budget: budgetValue,
        category: form.category as "website" | "ai-automation" | "marketing" | "saas" | "mobile-app" | "other",
        skills: parsedSkills,
        deadline: form.deadline || undefined,
        attachmentLink: form.attachmentLink.trim() || undefined,
        status: "open",
        platformFee: 0,
        freelancerPay: budgetValue,
        bidsCount: 0,
        createdAt: new Date().toISOString(),
      });
      router.push(`/projects/${id}`);
    } catch {
      setError("Unable to post project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <section className="max-w-none mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm w-full"
        >
          <h1 className="text-3xl font-bold text-gray-900">Post a Project</h1>
          <p className="text-gray-500 mt-2">Share your project and receive bids from freelancers.</p>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <Input
              label="Project Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <Select
              label="Category"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            />
            <Input
              label="Budget (INR)"
              value={form.budget}
              onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
              placeholder="50000"
            />
            <Input
              label="Deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <Input
              label="Skills (comma-separated)"
              value={form.skills}
              onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
            />
            <Input
              label="Attachment Link (optional)"
              value={form.attachmentLink}
              onChange={(e) => setForm((prev) => ({ ...prev, attachmentLink: e.target.value }))}
              placeholder="https://docs.google.com/..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" onClick={() => router.push("/projects")}>Cancel</Button>
            <Button loading={saving} onClick={handleSubmit}>Post Project</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
