import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  where,
} from "@/services/firestoreService";
import { FreelancerProfile, ClientProject, Payment, ProjectBid } from "@/types/freelancer";

const toMillis = (value: unknown) => {
  if (!value) return 0;
  if (typeof value === "string") return new Date(value).getTime();
  if (typeof value === "object" && value && "toDate" in value) {
    const maybeTimestamp = value as { toDate?: () => Date };
    if (typeof maybeTimestamp.toDate === "function") {
      return maybeTimestamp.toDate().getTime();
    }
  }
  return 0;
};

const sortByCreatedAtDesc = <T extends { createdAt?: unknown }>(items: T[]) => {
  return [...items].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
};

export const freelancerService = {
  async createProfile(data: Omit<FreelancerProfile, "id">) {
    return createDocument("freelancerProfiles", data as unknown as Record<string, unknown>);
  },

  async getProfile(userId: string) {
    const results = await queryDocuments<FreelancerProfile>("freelancerProfiles", [
      where("userId", "==", userId),
    ]);
    return results[0] || null;
  },

  async updateProfile(id: string, data: Partial<FreelancerProfile>) {
    return updateDocument("freelancerProfiles", id, data);
  },

  async getAvailableFreelancers() {
    return queryDocuments<FreelancerProfile>("freelancerProfiles", [
      where("availability", "==", "available"),
    ]);
  },

  async createProject(data: Omit<ClientProject, "id">) {
    return createDocument("clientProjects", data as unknown as Record<string, unknown>);
  },

  async getProject(id: string) {
    return getDocument<ClientProject>("clientProjects", id);
  },

  async getAvailableProjects() {
    const results = await queryDocuments<ClientProject>("clientProjects", [
      where("status", "==", "open"),
    ]);
    return sortByCreatedAtDesc(results);
  },

  async getFreelancerProjects(freelancerId: string) {
    const results = await queryDocuments<ClientProject>("clientProjects", [
      where("assignedFreelancer", "==", freelancerId),
    ]);
    return sortByCreatedAtDesc(results);
  },

  async updateProject(id: string, data: Partial<ClientProject>) {
    return updateDocument("clientProjects", id, data);
  },

  async deleteProject(id: string) {
    return deleteDocument("clientProjects", id);
  },

  async createBid(data: Omit<ProjectBid, "id">) {
    return createDocument("projectBids", data as unknown as Record<string, unknown>);
  },

  async getBidsForProject(projectId: string) {
    const results = await queryDocuments<ProjectBid>("projectBids", [
      where("projectId", "==", projectId),
    ]);
    return sortByCreatedAtDesc(results);
  },

  async getBidsByUser(bidderId: string) {
    const results = await queryDocuments<ProjectBid>("projectBids", [
      where("bidderId", "==", bidderId),
    ]);
    return sortByCreatedAtDesc(results);
  },

  async getPayments(freelancerId: string) {
    const results = await queryDocuments<Payment>("payments", [
      where("freelancerId", "==", freelancerId),
    ]);
    return sortByCreatedAtDesc(results);
  },

  async createPayment(data: Omit<Payment, "id">) {
    return createDocument("payments", data as unknown as Record<string, unknown>);
  },
};
