"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { freeResourceService } from "@/features/free-resources/freeResourceService";
import { uploadFreeResourceFile, deleteFile } from "@/services/storageService";
import { FreeResource } from "@/types/freeResource";

const categoryOptions = [
  { value: "AI & ML", label: "AI & ML" },
  { value: "Web Dev", label: "Web Dev" },
  { value: "Mobile", label: "Mobile" },
  { value: "Design", label: "Design" },
  { value: "Data Science", label: "Data Science" },
  { value: "DevOps", label: "DevOps" },
  { value: "Business", label: "Business" },
];

const typeOptions = [
  { value: "Tool", label: "Tool" },
  { value: "Course", label: "Course" },
  { value: "Dataset", label: "Dataset" },
  { value: "Platform", label: "Platform" },
  { value: "Bundle", label: "Bundle" },
  { value: "Documentation", label: "Documentation" },
  { value: "Tutorial", label: "Tutorial" },
];

const sourceOptions = [
  { value: "link", label: "External link" },
  { value: "file", label: "Upload file" },
];

const emptyForm = {
  title: "",
  description: "",
  category: "",
  type: "",
  url: "",
  tags: "",
  rating: "",
  usersLabel: "",
  usersCount: "",
  isPublished: true,
  sourceType: "link" as "link" | "file",
};

export default function AdminFreeSourcesPage() {
  const [resources, setResources] = useState<FreeResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<FreeResource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      const data = await freeResourceService.getAllResources();
      setResources(data);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditing(null);
    setError(null);
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (resource: FreeResource) => {
    setEditing(resource);
    setForm({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      url: resource.url || "",
      tags: (resource.tags || []).join(", "),
      rating: typeof resource.rating === "number" ? resource.rating.toString() : "",
      usersLabel: resource.usersLabel || "",
      usersCount: typeof resource.usersCount === "number" ? resource.usersCount.toString() : "",
      isPublished: resource.isPublished,
      sourceType: resource.sourceType || (resource.filePath ? "file" : "link"),
    });
    setFile(null);
    setError(null);
    setModalOpen(true);
  };

  const parsedTags = useMemo(() => {
    return form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [form.tags]);

  const handleSubmit = async () => {
    const requiresFile = form.sourceType === "file";
    if (!form.title || !form.description || !form.category || !form.type) {
      setError("Title, description, category, and type are required.");
      return;
    }
    if (!requiresFile && !form.url) {
      setError("Please provide a link URL.");
      return;
    }
    if (requiresFile && !file && !editing?.filePath) {
      setError("Please select a file to upload.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Omit<FreeResource, "id"> = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      url: requiresFile ? editing?.url || "" : form.url.trim(),
      tags: parsedTags,
      rating: form.rating ? Number(form.rating) : undefined,
      usersLabel: form.usersLabel.trim() || undefined,
      usersCount: form.usersCount ? Number(form.usersCount) : undefined,
      isPublished: form.isPublished,
      sourceType: form.sourceType,
      fileName: editing?.fileName,
      filePath: editing?.filePath,
      thumbnailUrl: editing?.thumbnailUrl,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined),
    ) as Omit<FreeResource, "id">;

    try {
      if (editing) {
        await freeResourceService.updateResource(editing.id, cleanedPayload);

        if (requiresFile && file) {
          if (editing.filePath) {
            await deleteFile(editing.filePath);
          }
          const newPath = `free-resources/${editing.id}/${file.name}`;
          const downloadUrl = await uploadFreeResourceFile(editing.id, file);
          await freeResourceService.updateResource(editing.id, {
            url: downloadUrl,
            fileName: file.name,
            filePath: newPath,
          });
        }

        if (!requiresFile && editing.filePath) {
          await deleteFile(editing.filePath);
          await freeResourceService.updateResource(editing.id, {
            fileName: "",
            filePath: "",
            sourceType: "link",
          });
        }
      } else {
        const newId = await freeResourceService.createResource(cleanedPayload);
        if (requiresFile && file) {
          const newPath = `free-resources/${newId}/${file.name}`;
          const downloadUrl = await uploadFreeResourceFile(newId, file);
          await freeResourceService.updateResource(newId, {
            url: downloadUrl,
            fileName: file.name,
            filePath: newPath,
            sourceType: "file",
          });
        }
      }
      setModalOpen(false);
      resetForm();
      await fetchResources();
    } catch {
      setError("Unable to save resource. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resource: FreeResource) => {
    const confirm = window.confirm(`Delete ${resource.title}?`);
    if (!confirm) return;
    try {
      if (resource.filePath) {
        await deleteFile(resource.filePath);
      }
      await freeResourceService.deleteResource(resource.id);
      setResources((prev) => prev.filter((item) => item.id !== resource.id));
    } catch {
      setError("Unable to delete resource. Please try again.");
    }
  };

  const togglePublish = async (resource: FreeResource) => {
    try {
      await freeResourceService.updateResource(resource.id, {
        isPublished: !resource.isPublished,
      });
      setResources((prev) =>
        prev.map((item) =>
          item.id === resource.id ? { ...item, isPublished: !item.isPublished } : item,
        ),
      );
    } catch {
      setError("Unable to update status. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Free Sources</h1>
          <p className="text-gray-500 mt-2 text-lg">Upload and manage free learning resources</p>
        </div>
        <Button onClick={openCreate} className="rounded-2xl">
          <Plus className="w-5 h-5 mr-2" />
          Add Resource
        </Button>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      ) : resources.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{resource.title}</td>
                    <td className="px-6 py-4 text-gray-600">{resource.category}</td>
                    <td className="px-6 py-4 text-gray-600">{resource.type}</td>
                    <td className="px-6 py-4">
                      {resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700"
                        >
                          Open <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(resource)}
                        className={`px-3 py-0.5 text-xs font-medium rounded-full border ${
                          resource.isPublished
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {resource.isPublished ? "Published" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(resource)}
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(resource)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="text-center py-16">
            <p className="font-semibold text-gray-900">No resources yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your first free resource to get started</p>
          </div>
        </motion.div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editing ? "Edit Resource" : "Add Resource"}
        size="lg"
      >
        <div className="space-y-5">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            />
            <Select
              label="Type"
              options={typeOptions}
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
            />
          </div>
          <Select
            label="Source Type"
            options={sourceOptions}
            value={form.sourceType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sourceType: e.target.value as "link" | "file",
              }))
            }
          />
          {form.sourceType === "link" ? (
            <Input
              label="Resource URL"
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
              />
              {editing?.fileName && !file && (
                <p className="text-xs text-gray-500 mt-2">Current file: {editing.fileName}</p>
              )}
            </div>
          )}
          <Input
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Rating"
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
              placeholder="4.8"
            />
            <Input
              label="Users Label"
              value={form.usersLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, usersLabel: e.target.value }))}
              placeholder="10M+"
            />
            <Input
              label="Users Count"
              value={form.usersCount}
              onChange={(e) => setForm((prev) => ({ ...prev, usersCount: e.target.value }))}
              placeholder="10000000"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            Publish on site
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button loading={saving} onClick={handleSubmit}>
              {editing ? "Save Changes" : "Create Resource"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
