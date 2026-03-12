import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/services/firestoreService";
import { CommunityPost, CommunityComment, Event, Club } from "@/types/startup";

export const communityService = {
  // Posts
  async createPost(data: Omit<CommunityPost, "id">) {
    return createDocument("communityPosts", data as unknown as Record<string, unknown>);
  },

  async getPost(id: string) {
    return getDocument<CommunityPost>("communityPosts", id);
  },

  async getPosts() {
    return queryDocuments<CommunityPost>("communityPosts", [
      orderBy("createdAt", "desc"),
    ]);
  },

  async getPostsByCategory(category: string) {
    return queryDocuments<CommunityPost>("communityPosts", [
      where("category", "==", category),
      orderBy("createdAt", "desc"),
    ]);
  },

  async deletePost(id: string) {
    return deleteDocument("communityPosts", id);
  },

  // Comments
  async addComment(data: Omit<CommunityComment, "id">) {
    return createDocument("communityComments", data as unknown as Record<string, unknown>);
  },

  async getPostComments(postId: string) {
    return queryDocuments<CommunityComment>("communityComments", [
      where("postId", "==", postId),
      orderBy("createdAt", "asc"),
    ]);
  },

  // Events
  async createEvent(data: Omit<Event, "id">) {
    return createDocument("events", data as unknown as Record<string, unknown>);
  },

  async getUpcomingEvents() {
    return queryDocuments<Event>("events", [
      where("date", ">=", new Date().toISOString()),
      orderBy("date", "asc"),
    ]);
  },

  async getAllEvents() {
    return queryDocuments<Event>("events", [
      orderBy("date", "desc"),
    ]);
  },

  // Clubs
  async createClub(data: Omit<Club, "id">) {
    return createDocument("clubs", data as unknown as Record<string, unknown>);
  },

  async getClubs() {
    return queryDocuments<Club>("clubs", [
      orderBy("name", "asc"),
    ]);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async joinClub(clubId: string, _userId: string) {
    const club = await getDocument<Club>("clubs", clubId);
    if (club) {
      return updateDocument("clubs", clubId, {
        memberCount: (club.memberCount || 0) + 1,
      });
    }
  },
};
