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
import { CommunityCourse, CommunityCoursePurchase, CommunityGroup } from "@/types/community";

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

  // Groups
  async createGroup(data: Omit<CommunityGroup, "id">) {
    return createDocument("communityGroups", data as unknown as Record<string, unknown>);
  },

  async getGroup(id: string) {
    return getDocument<CommunityGroup>("communityGroups", id);
  },

  async getApprovedGroups() {
    return queryDocuments<CommunityGroup>("communityGroups", [
      where("status", "==", "approved"),
    ]);
  },

  async getGroupsByCreator(userId: string) {
    return queryDocuments<CommunityGroup>("communityGroups", [
      where("createdBy", "==", userId),
    ]);
  },

  async getAllGroups() {
    return queryDocuments<CommunityGroup>("communityGroups", []);
  },

  async updateGroup(id: string, data: Partial<CommunityGroup>) {
    return updateDocument("communityGroups", id, data as Record<string, unknown>);
  },

  // Courses inside groups
  async createCourse(data: Omit<CommunityCourse, "id">) {
    return createDocument("communityCourses", data as unknown as Record<string, unknown>);
  },

  async getCoursesByGroup(groupId: string) {
    return queryDocuments<CommunityCourse>("communityCourses", [
      where("groupId", "==", groupId),
    ]);
  },

  async getAllCourses() {
    return queryDocuments<CommunityCourse>("communityCourses", []);
  },

  async updateCourse(id: string, data: Partial<CommunityCourse>) {
    return updateDocument("communityCourses", id, data as Record<string, unknown>);
  },

  async deleteCourse(id: string) {
    return deleteDocument("communityCourses", id);
  },

  // Purchases
  async createPurchase(data: Omit<CommunityCoursePurchase, "id">) {
    return createDocument("communityCoursePurchases", data as unknown as Record<string, unknown>);
  },

  async getPurchasesByUser(userId: string) {
    return queryDocuments<CommunityCoursePurchase>("communityCoursePurchases", [
      where("userId", "==", userId),
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
