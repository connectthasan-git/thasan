import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/services/firestoreService";
import { Course, Enrollment } from "@/types/course";

const COLLECTION = "courses";

export const courseService = {
  async createCourse(data: Omit<Course, "id">) {
    return createDocument(COLLECTION, data as unknown as Record<string, unknown>);
  },

  async getCourse(id: string) {
    return getDocument<Course>(COLLECTION, id);
  },

  async updateCourse(id: string, data: Partial<Course>) {
    return updateDocument(COLLECTION, id, data);
  },

  async deleteCourse(id: string) {
    return deleteDocument(COLLECTION, id);
  },

  async getPublishedCourses() {
    return queryDocuments<Course>(COLLECTION, [
      where("isPublished", "==", true),
      orderBy("createdAt", "desc"),
    ]);
  },

  async getCoursesByCategory(category: string) {
    return queryDocuments<Course>(COLLECTION, [
      where("isPublished", "==", true),
      where("category", "==", category),
    ]);
  },

  async enrollInCourse(courseId: string, userId: string) {
    const enrollment: Omit<Enrollment, "id"> = {
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      status: "active",
    };
    return createDocument("enrollments", enrollment as unknown as Record<string, unknown>);
  },

  async getEnrollment(courseId: string, userId: string) {
    const results = await queryDocuments<Enrollment>("enrollments", [
      where("courseId", "==", courseId),
      where("userId", "==", userId),
    ]);
    return results[0] || null;
  },

  async getUserEnrollments(userId: string) {
    return queryDocuments<Enrollment>("enrollments", [
      where("userId", "==", userId),
      orderBy("enrolledAt", "desc"),
    ]);
  },

  async updateProgress(enrollmentId: string, progress: number, completedLessons: string[]) {
    return updateDocument("enrollments", enrollmentId, {
      progress,
      completedLessons,
      ...(progress >= 100 ? { status: "completed", completedAt: new Date().toISOString() } : {}),
    });
  },
};
