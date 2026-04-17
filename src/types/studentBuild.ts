export interface StudentBuild {
  id: string;
  userId: string;
  studentName: string;
  title: string;
  summary: string;
  liveUrl: string;
  githubUrl?: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  isFeatured?: boolean;
}
