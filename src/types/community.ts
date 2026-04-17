export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: "study" | "project" | "social";
  members: number;
  maxMembers: number;
  status: "approved" | "pending" | "rejected";
  hasVoiceCall: boolean;
  createdBy: string;
  createdByName?: string;
  createdAt?: unknown;
}

export interface CommunityCourseModule {
  title: string;
  youtubeUrl: string;
}

export interface CommunityCourse {
  id: string;
  groupId: string;
  title: string;
  description: string;
  isPaid: boolean;
  price?: number;
  currency?: string;
  instructorId: string;
  instructorName?: string;
  instructorStage?: "applicant" | "coach";
  status: "pending" | "approved" | "rejected";
  brandName?: string;
  modules: CommunityCourseModule[];
  createdAt?: unknown;
}

export interface CommunityCoursePurchase {
  id: string;
  courseId: string;
  groupId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "completed" | "failed";
  paymentProvider: "razorpay";
  paymentId?: string;
  orderId?: string;
  createdAt?: unknown;
}
