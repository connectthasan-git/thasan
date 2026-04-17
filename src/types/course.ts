export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: "ai-automation" | "digital-skills" | "freelancing" | "startup" | "tech-development";
  modules: CourseModule[];
  duration: string;
  imageUrl: string;
  enrolledCount: number;
  rating: number;
  createdAt: string;
  isPublished?: boolean;
  previewModuleId?: string;
  previewLessonId?: string;
  previewTitle?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "text" | "assignment" | "quiz";
  content: string;
  videoUrl?: string;
  duration?: string;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
  completedAt?: string;
  status: "active" | "completed" | "paused";
}

export interface Assignment {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  submissionUrl: string;
  feedback?: string;
  grade?: number;
  status: "submitted" | "reviewed" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId?: string;
  internshipId?: string;
  type: "course" | "project" | "internship" | "skill-badge";
  title: string;
  issuedAt: string;
}
