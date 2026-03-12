export interface Internship {
  id: string;
  title: string;
  description: string;
  project: string;
  mentorId: string;
  duration: string;
  category: "automation" | "social-media" | "ai-tools" | "research" | "community" | "product-dev";
  maxSlots: number;
  assignedStudents: string[];
  status: "open" | "in-progress" | "completed";
  createdAt: string;
}

export interface InternshipTask {
  id: string;
  internshipId: string;
  assignedTo: string;
  title: string;
  description: string;
  week: number;
  status: "pending" | "in-progress" | "submitted" | "reviewed";
  submissionUrl?: string;
  mentorFeedback?: string;
  rating?: number;
  dueDate: string;
  submittedAt?: string;
}

export interface InternshipApplication {
  id: string;
  userId: string;
  internshipId: string;
  coursePerformance: number;
  projectQuality: number;
  skillScore: number;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}
