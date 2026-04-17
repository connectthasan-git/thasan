export type UserRole = "student" | "freelancer" | "founder" | "admin" | "mentor";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  college?: string;
  degree?: string;
  role: UserRole;
  skills: string[];
  careerGoal?: "job" | "freelance" | "startup";
  enrolledCourses: string[];
  internshipStatus?: "none" | "eligible" | "active" | "completed";
  referralSource?: string;
  avatarUrl?: string;
  isCourseCreatorApproved?: boolean;
  coachTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  location: string;
  college: string;
  degree: string;
  skillsInterest: string[];
  careerGoal: "job" | "freelance" | "startup";
  referralSource: string;
}
