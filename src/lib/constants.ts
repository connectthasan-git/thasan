export const APP_NAME = "Thasan";
export const APP_DESCRIPTION = "Learn → Build → Work → Earn → Launch";

export const COURSE_CATEGORIES = [
  { value: "ai-automation", label: "AI Automation" },
  { value: "digital-skills", label: "Digital Skills" },
  { value: "freelancing", label: "Freelancing Skills" },
  { value: "startup", label: "Startup Fundamentals" },
  { value: "tech-development", label: "Tech Development" },
] as const;

export const USER_ROLES = [
  { value: "student", label: "Student" },
  { value: "freelancer", label: "Freelancer" },
  { value: "founder", label: "Founder" },
  { value: "mentor", label: "Mentor" },
  { value: "admin", label: "Admin" },
] as const;

export const CAREER_GOALS = [
  { value: "job", label: "Get a Job" },
  { value: "freelance", label: "Freelancing" },
  { value: "startup", label: "Start a Startup" },
] as const;

export const INTERNSHIP_CATEGORIES = [
  { value: "automation", label: "Automation Projects" },
  { value: "social-media", label: "Social Media Systems" },
  { value: "ai-tools", label: "AI Tool Development" },
  { value: "research", label: "Research Tasks" },
  { value: "community", label: "Community Projects" },
  { value: "product-dev", label: "Product Development" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/careers", label: "Careers" },
  { href: "/free-sources", label: "Free Sources" },
  { href: "/community", label: "Community" },
  { href: "/clubs", label: "Clubs" },
] as const;

export const SOCIAL_LINKS = {
  whatsapp: "https://chat.whatsapp.com/HpFpVgks4ei5e8JtUaqago",
  instagram: "https://www.instagram.com/thasan_organization",
} as const;
