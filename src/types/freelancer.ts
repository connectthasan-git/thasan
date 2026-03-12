export interface FreelancerProfile {
  id: string;
  userId: string;
  portfolio: string[];
  skills: string[];
  completedProjects: string[];
  availability: "available" | "busy" | "unavailable";
  verified: boolean;
  rating: number;
  totalEarnings: number;
  joinedAt: string;
}

export interface ClientProject {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  category: "website" | "ai-automation" | "marketing" | "saas" | "mobile-app" | "other";
  skills: string[];
  assignedFreelancer?: string;
  status: "open" | "assigned" | "in-progress" | "completed" | "cancelled";
  platformFee: number;
  freelancerPay: number;
  createdAt: string;
  completedAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  courseId?: string;
  projectId?: string;
  amount: number;
  type: "course-payment" | "freelancer-earning" | "platform-fee";
  status: "pending" | "completed" | "failed" | "refunded";
  gateway: "razorpay" | "stripe" | "paypal";
  transactionId?: string;
  createdAt: string;
}
