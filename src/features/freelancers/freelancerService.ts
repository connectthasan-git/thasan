import {
  createDocument,
  getDocument,
  updateDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/services/firestoreService";
import { FreelancerProfile, ClientProject, Payment } from "@/types/freelancer";

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
    return queryDocuments<ClientProject>("clientProjects", [
      where("status", "==", "open"),
      orderBy("createdAt", "desc"),
    ]);
  },

  async getFreelancerProjects(freelancerId: string) {
    return queryDocuments<ClientProject>("clientProjects", [
      where("assignedFreelancer", "==", freelancerId),
      orderBy("createdAt", "desc"),
    ]);
  },

  async updateProject(id: string, data: Partial<ClientProject>) {
    return updateDocument("clientProjects", id, data);
  },

  async getPayments(freelancerId: string) {
    return queryDocuments<Payment>("payments", [
      where("freelancerId", "==", freelancerId),
      orderBy("createdAt", "desc"),
    ]);
  },

  async createPayment(data: Omit<Payment, "id">) {
    return createDocument("payments", data as unknown as Record<string, unknown>);
  },
};
