export interface FreeResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
  tags: string[];
  rating?: number;
  usersLabel?: string;
  usersCount?: number;
  isPublished: boolean;
  sourceType?: "link" | "file";
  fileName?: string;
  filePath?: string;
  thumbnailUrl?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}
