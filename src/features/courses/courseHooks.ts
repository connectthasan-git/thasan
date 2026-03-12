"use client";

import { useState, useEffect } from "react";
import { courseService } from "./courseService";
import { Course, Enrollment } from "@/types/course";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService
      .getPublishedCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}

export function useCourse(id: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    courseService
      .getCourse(id)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { course, loading };
}

export function useEnrollments(userId: string) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    courseService
      .getUserEnrollments(userId)
      .then(setEnrollments)
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { enrollments, loading };
}

export function useEnroll() {
  const [loading, setLoading] = useState(false);

  const enroll = async (courseId: string, userId: string) => {
    setLoading(true);
    try {
      const existing = await courseService.getEnrollment(courseId, userId);
      if (existing) throw new Error("Already enrolled");
      await courseService.enrollInCourse(courseId, userId);
    } finally {
      setLoading(false);
    }
  };

  return { enroll, loading };
}
