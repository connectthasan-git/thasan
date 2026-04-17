"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { queryDocuments } from "@/services/firestoreService";
import { courseService } from "@/features/courses/courseService";
import type { Course, CourseModule, Lesson } from "@/types/course";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

const categoryOptions = [
  { value: "ai-automation", label: "AI Automation" },
  { value: "digital-skills", label: "Digital Skills" },
  { value: "freelancing", label: "Freelancing" },
  { value: "startup", label: "Startup" },
  { value: "tech-development", label: "Tech Development" },
];

const lessonTypes = [
  { value: "video", label: "Video" },
  { value: "text", label: "Text" },
  { value: "assignment", label: "Assignment" },
  { value: "quiz", label: "Quiz" },
];

type DraftLesson = Lesson;
type DraftModule = CourseModule;

const makeLesson = (order: number): DraftLesson => ({
  id: crypto.randomUUID(),
  title: "",
  type: "video",
  content: "",
  videoUrl: "",
  duration: "",
  order,
});

const makeModule = (order: number): DraftModule => ({
  id: crypto.randomUUID(),
  title: "",
  lessons: [makeLesson(1)],
  order,
});

const emptyForm = {
  title: "",
  description: "",
  instructor: "Thasan Team",
  price: "",
  category: "ai-automation",
  duration: "",
  imageUrl: "",
  enrolledCount: "0",
  rating: "4.8",
  isPublished: true,
  previewTitle: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [modules, setModules] = useState<DraftModule[]>([makeModule(1)]);
  const [previewModuleId, setPreviewModuleId] = useState("");
  const [previewLessonId, setPreviewLessonId] = useState("");

  useEffect(() => {
    if (modules.length > 0 && !previewModuleId) {
      setPreviewModuleId(modules[0].id);
    }
  }, [modules, previewModuleId]);

  useEffect(() => {
    const selectedModule = modules.find((module) => module.id === previewModuleId);
    if (!selectedModule) return;
    if (!previewLessonId || !selectedModule.lessons.some((lesson) => lesson.id === previewLessonId)) {
      setPreviewLessonId(selectedModule.lessons[0]?.id || "");
    }
  }, [modules, previewLessonId, previewModuleId]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await queryDocuments<Course>("courses", []);
        setCourses(data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const selectedPreviewModule = useMemo(
    () => modules.find((module) => module.id === previewModuleId) || modules[0],
    [modules, previewModuleId],
  );

  const selectedPreviewLessons = selectedPreviewModule?.lessons || [];

  const resetForm = () => {
    setForm(emptyForm);
    setModules([makeModule(1)]);
    setPreviewModuleId("");
    setPreviewLessonId("");
    setError(null);
  };

  const openCreate = () => {
    resetForm();
    setBuilderOpen(true);
  };

  const addModule = () => {
    setModules((prev) => [...prev, makeModule(prev.length + 1)]);
  };

  const removeModule = (moduleId: string) => {
    setModules((prev) => {
      const next = prev.filter((module) => module.id !== moduleId).map((module, index) => ({
        ...module,
        order: index + 1,
      }));
      return next.length > 0 ? next : [makeModule(1)];
    });
  };

  const updateModule = (moduleId: string, patch: Partial<DraftModule>) => {
    setModules((prev) => prev.map((module) => (module.id === moduleId ? { ...module, ...patch } : module)));
  };

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: [...module.lessons, makeLesson(module.lessons.length + 1)],
        };
      }),
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module;
        const nextLessons = module.lessons.filter((lesson) => lesson.id !== lessonId).map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        }));
        return {
          ...module,
          lessons: nextLessons.length > 0 ? nextLessons : [makeLesson(1)],
        };
      }),
    );
  };

  const updateLesson = (moduleId: string, lessonId: string, patch: Partial<DraftLesson>) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          lessons: module.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...patch } : lesson)),
        };
      }),
    );
  };

  const handleCreateCourse = async () => {
    if (!form.title || !form.description || !form.duration || !form.imageUrl) {
      setError("Title, description, duration, and image URL are required.");
      return;
    }

    const normalizedModules = modules.map((module, moduleIndex) => ({
      ...module,
      title: module.title.trim(),
      order: Number.isFinite(Number(module.order)) ? Number(module.order) : moduleIndex + 1,
      lessons: module.lessons
        .map((lesson, lessonIndex) => ({
          ...lesson,
          title: lesson.title.trim(),
          content: lesson.content.trim(),
          videoUrl: lesson.videoUrl?.trim() || undefined,
          duration: lesson.duration?.trim() || undefined,
          order: Number.isFinite(Number(lesson.order)) ? Number(lesson.order) : lessonIndex + 1,
        }))
        .filter((lesson) => lesson.title && lesson.content),
    })).filter((module) => module.title && module.lessons.length > 0);

    if (normalizedModules.length === 0) {
      setError("Add at least one module with one lesson.");
      return;
    }

    const previewModule = normalizedModules.find((module) => module.id === previewModuleId) || normalizedModules[0];
    const previewLesson = previewModule?.lessons.find((lesson) => lesson.id === previewLessonId) || previewModule?.lessons[0];

    setSaving(true);
    setError(null);
    try {
      await courseService.createCourse({
        title: form.title.trim(),
        description: form.description.trim(),
        instructor: form.instructor.trim(),
        price: Number(form.price || 0),
        category: form.category as Course["category"],
        modules: normalizedModules,
        duration: form.duration.trim(),
        imageUrl: form.imageUrl.trim(),
        enrolledCount: Number(form.enrolledCount || 0),
        rating: Number(form.rating || 0),
        createdAt: new Date().toISOString(),
        isPublished: form.isPublished,
        previewModuleId: previewModule?.id,
        previewLessonId: previewLesson?.id,
        previewTitle: form.previewTitle.trim() || undefined,
      });

      const data = await queryDocuments<Course>("courses", []);
      setCourses(data);
      setBuilderOpen(false);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create course.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const catColors: Record<string, string> = {
    "ai-automation": "bg-purple-50 text-purple-700 border-purple-100",
    "digital-skills": "bg-blue-50 text-blue-700 border-blue-100",
    freelancing: "bg-amber-50 text-amber-700 border-amber-100",
    startup: "bg-orange-50 text-orange-700 border-orange-100",
    "tech-development": "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Create and manage platform courses</p>
        </div>
        {!builderOpen ? (
          <button onClick={openCreate} className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow-lg shadow-green-600/25 hover:bg-green-700 transition-all">
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        ) : (
          <button
            onClick={() => {
              setBuilderOpen(false);
              resetForm();
            }}
            className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Close Builder
          </button>
        )}
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
      ) : courses.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Enrolled</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${catColors[c.category?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-100"}`}>{c.category}</span></td>
                    <td className="px-6 py-4 text-gray-600">{c.price === 0 ? "Free" : `₹${c.price}`}</td>
                    <td className="px-6 py-4 text-gray-600">{c.enrolledCount || 0}</td>
                    <td className="px-6 py-4"><span className="px-3 py-0.5 text-xs font-medium rounded-full border bg-green-50 text-green-700 border-green-100">Published</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">No courses yet</p>
            <p className="text-sm text-gray-500 mt-1">Create your first course to get started</p>
          </div>
        </motion.div>
      )}

      {builderOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Course</h2>
            <p className="text-sm text-gray-500">Simple scroll form</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Course Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
              <Input label="Instructor" value={form.instructor} onChange={(e) => setForm((prev) => ({ ...prev, instructor: e.target.value }))} />
              <Select label="Category" options={categoryOptions} value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
              <Input label="Duration" value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))} placeholder="8 weeks" />
              <Input label="Price (INR)" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="2999" />
              <Input label="Image URL" value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://..." />
              <Input label="Enrolled Count" value={form.enrolledCount} onChange={(e) => setForm((prev) => ({ ...prev, enrolledCount: e.target.value }))} />
              <Input label="Rating" value={form.rating} onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))} />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
              />
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl p-4 bg-gray-50/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Course Content</h3>
              <Button variant="ghost" onClick={addModule}>
                <Plus className="w-4 h-4 mr-1" /> Add Module
              </Button>
            </div>

            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="border border-gray-200 rounded-2xl p-4 bg-white space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <Input
                      label={`Module ${moduleIndex + 1} Title`}
                      value={module.title}
                      onChange={(e) => updateModule(module.id, { title: e.target.value })}
                    />
                    <Input
                      label="Order"
                      value={String(module.order)}
                      onChange={(e) => updateModule(module.id, { order: Number(e.target.value) || moduleIndex + 1 })}
                    />
                  </div>
                  {modules.length > 1 && (
                    <button onClick={() => removeModule(module.id)} className="mt-6 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="border border-gray-100 rounded-2xl p-3 bg-gray-50/80 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-gray-700">Lesson {lessonIndex + 1}</h4>
                        {module.lessons.length > 1 && (
                          <button onClick={() => removeLesson(module.id, lesson.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="Title"
                          value={lesson.title}
                          onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                        />
                        <Select
                          label="Type"
                          options={lessonTypes}
                          value={lesson.type}
                          onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value as Lesson["type"] })}
                        />
                        <Input
                          label="Order"
                          value={String(lesson.order)}
                          onChange={(e) => updateLesson(module.id, lesson.id, { order: Number(e.target.value) || lessonIndex + 1 })}
                        />
                        <Input
                          label="Duration"
                          value={lesson.duration || ""}
                          onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                          placeholder="12 min"
                        />
                        <Input
                          label="Video URL"
                          value={lesson.videoUrl || ""}
                          onChange={(e) => updateLesson(module.id, lesson.id, { videoUrl: e.target.value })}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          value={lesson.content}
                          onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" onClick={() => addLesson(module.id)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Lesson
                </Button>
              </div>
            ))}
          </div>

          <div className="border border-gray-100 rounded-3xl p-4 bg-white space-y-4">
            <h3 className="font-semibold text-gray-900">Publishing and Preview</h3>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Publish immediately
              </label>
              <Input
                label="Preview Label"
                value={form.previewTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, previewTitle: e.target.value }))}
                placeholder="Editor-selected preview"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Preview Module"
                options={modules.map((module) => ({ value: module.id, label: module.title || `Module ${module.order}` }))}
                value={previewModuleId}
                onChange={(e) => setPreviewModuleId(e.target.value)}
              />
              <Select
                label="Preview Lesson"
                options={selectedPreviewLessons.map((lesson) => ({ value: lesson.id, label: lesson.title || `Lesson ${lesson.order}` }))}
                value={previewLessonId}
                onChange={(e) => setPreviewLessonId(e.target.value)}
              />
              <div className="flex items-end">
                <p className="text-xs text-gray-500">Anonymous visitors will see this lesson first.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setBuilderOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleCreateCourse}>
              Create Course
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
