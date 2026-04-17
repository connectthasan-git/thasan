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
    const internships = await queryDocuments<Internship>(COLLECTION, [
      orderBy("createdAt", "desc"),
    ]);

    return internships.filter(
      (internship) => internship.isActive !== false && internship.isPublished !== false,
    );
  },

  async getInternshipsByCategory(category: string) {
    const internships = await internshipService.getActiveInternships();
    return internships.filter((internship) => internship.category === category);
  },

  async getPublicInternships() {
    return internshipService.getActiveInternships();
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
