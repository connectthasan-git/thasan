import {
  createDocument,
  getDocument,
  updateDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/services/firestoreService";
import { Internship, InternshipApplication } from "@/types/internship";

const COLLECTION = "internships";

export const internshipService = {
  async createInternship(data: Omit<Internship, "id">) {
    return createDocument(COLLECTION, data as unknown as Record<string, unknown>);
  },

  async getInternship(id: string) {
    return getDocument<Internship>(COLLECTION, id);
  },

  async updateInternship(id: string, data: Partial<Internship>) {
    return updateDocument(COLLECTION, id, data);
  },

  async getActiveInternships() {
    return queryDocuments<Internship>(COLLECTION, [
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
    ]);
  },

  async getInternshipsByCategory(category: string) {
    return queryDocuments<Internship>(COLLECTION, [
      where("isActive", "==", true),
      where("category", "==", category),
    ]);
  },

  async applyForInternship(internshipId: string, userId: string) {
    const application: Omit<InternshipApplication, "id"> = {
      internshipId,
      userId,
      coursePerformance: 0,
      projectQuality: 0,
      skillScore: 0,
      appliedAt: new Date().toISOString(),
      status: "pending",
    };
    return createDocument("internshipApplications", application as unknown as Record<string, unknown>);
  },

  async getUserApplications(userId: string) {
    return queryDocuments<InternshipApplication>("internshipApplications", [
      where("userId", "==", userId),
      orderBy("appliedAt", "desc"),
    ]);
  },

  async updateApplicationStatus(applicationId: string, status: InternshipApplication["status"]) {
    return updateDocument("internshipApplications", applicationId, { status });
  },
};
