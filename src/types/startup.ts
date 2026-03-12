export interface Startup {
  id: string;
  founderId: string;
  name: string;
  idea: string;
  problemStatement: string;
  targetMarket: string;
  solutionConcept: string;
  stage: "idea" | "training" | "incubation" | "demo-ready" | "launched";
  mentorId?: string;
  teamMembers: string[];
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  type: "discussion" | "project" | "event" | "hackathon" | "announcement";
  likes: number;
  commentsCount: number;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: "workshop" | "hackathon" | "talk" | "bootcamp" | "demo-day" | "networking";
  date: string;
  location: string;
  maxAttendees: number;
  registeredUsers: string[];
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  college: string;
  type: "ai" | "tech" | "startup";
  president: string;
  technicalLead: string;
  eventCoordinator: string;
  communityManager: string;
  memberCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "course" | "internship" | "freelance" | "community" | "system";
  read: boolean;
  createdAt: string;
}
