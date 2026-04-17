"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import LessonPlayer from "@/components/course/LessonPlayer";
import { getDocument } from "@/services/firestoreService";
import type { Course, Lesson } from "@/types/course";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";

function getPreviewLesson(course: Course): { lesson: Lesson | null; moduleTitle: string } {
  const sortedModules = [...(course.modules || [])].sort((a, b) => a.order - b.order);
  const firstModule = sortedModules[0];

  if (!firstModule || !firstModule.lessons || firstModule.lessons.length === 0) {
    return { lesson: null, moduleTitle: "" };
  }

  const firstLesson = [...firstModule.lessons].sort((a, b) => a.order - b.order)[0];
  return { lesson: firstLesson || null, moduleTitle: firstModule.title };
}

export default function CoursePreviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getDocument<Course>("courses", courseId);
        setCourse(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const preview = useMemo(() => {
    if (!course) return { lesson: null as Lesson | null, moduleTitle: "" };
    return getPreviewLesson(course);
  }, [course]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <p className="text-gray-500 mt-2">This preview is unavailable.</p>
        <Link href="/courses" className="mt-6 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
          Explore Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Navbar />

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
              <BookOpen size={14} /> Free first lesson preview
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4">{course.title}</h1>
            <p className="text-gray-600 mt-3 max-w-2xl">{course.description}</p>
            <div className="flex flex-wrap items-center gap-5 mt-5 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2"><GraduationCap size={15} /> {course.instructor}</span>
              <span className="inline-flex items-center gap-2"><Clock size={15} /> {course.duration}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {preview.lesson ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">{preview.moduleTitle}</p>
              <LessonPlayer videoUrl={preview.lesson.videoUrl} title={preview.lesson.title} />
              {preview.lesson.type !== "video" && (
                <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Lesson content</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{preview.lesson.content}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Preview coming soon</h2>
              <p className="text-gray-500 mt-2">This course does not have a lesson preview yet.</p>
            </div>
          )}

          <div className="mt-8 bg-gray-900 text-white rounded-3xl p-7 md:p-9">
            <h3 className="text-2xl font-extrabold">Continue with the full course</h3>
            <p className="text-gray-300 mt-2 max-w-2xl">
              This is lesson one. Enroll to unlock all modules, projects, and mentor feedback.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors">
                View full course <ArrowRight size={16} />
              </Link>
              <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors">
                Browse more courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
