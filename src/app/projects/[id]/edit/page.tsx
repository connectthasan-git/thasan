"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { freelancerService } from "@/features/freelancers/freelancerService";
import { useAuth } from "@/context/AuthContext";
import { ClientProject } from "@/types/freelancer";

const categoryOptions = [
  { value: "website", label: "Website" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "marketing", label: "Marketing" },
  { value: "saas", label: "SaaS" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "other", label: "Other" },
];

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [project, setProject] = useState<ClientProject | null>(null);
  const [fetching, setFetching] = useState(true);
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
      router.replace(`/login?redirect=${encodeURIComponent(`/projects/${id}/edit`)}`);
    }
  }, [id, loading, router, user]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await freelancerService.getProject(id);
        if (!data) {
          setProject(null);
          return;
        }
        if (user && data.clientId !== user.uid) {
          router.replace(`/projects/${id}`);
          return;
        }
        setProject(data);
        setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          budget: data.budget.toString(),
          deadline: data.deadline || "",
          skills: (data.skills || []).join(", "),
          attachmentLink: data.attachmentLink || "",
        });
      } catch {
        setProject(null);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchProject();
    }
  }, [id, router, user]);

  const parsedSkills = useMemo(() => {
    return form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [form.skills]);

  const handleSubmit = async () => {
    if (!project || !user) return;
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
      await freelancerService.updateProject(project.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category as ClientProject["category"],
        budget: budgetValue,
        deadline: form.deadline || undefined,
        skills: parsedSkills,
        attachmentLink: form.attachmentLink.trim() || undefined,
      });
      router.push(`/projects/${project.id}`);
    } catch {
      setError("Unable to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetching) {
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

      <section className="max-w-none mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm w-full"
        >
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-500 mt-2">Update your project details and requirements.</p>

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
            <Button variant="ghost" onClick={() => router.push(`/projects/${project.id}`)}>Cancel</Button>
            <Button loading={saving} onClick={handleSubmit}>Save Changes</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
