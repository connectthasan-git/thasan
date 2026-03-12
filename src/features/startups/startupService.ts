import {
  createDocument,
  getDocument,
  updateDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/services/firestoreService";
import { Startup } from "@/types/startup";

export const startupService = {
  async createStartup(data: Omit<Startup, "id">) {
    return createDocument("startups", data as unknown as Record<string, unknown>);
  },

  async getStartup(id: string) {
    return getDocument<Startup>("startups", id);
  },

  async updateStartup(id: string, data: Partial<Startup>) {
    return updateDocument("startups", id, data);
  },

  async getStartupByFounder(founderId: string) {
    const results = await queryDocuments<Startup>("startups", [
      where("founderId", "==", founderId),
    ]);
    return results[0] || null;
  },

  async getAllStartups() {
    return queryDocuments<Startup>("startups", [
      orderBy("createdAt", "desc"),
    ]);
  },

  async getStartupsByStage(stage: string) {
    return queryDocuments<Startup>("startups", [
      where("stage", "==", stage),
    ]);
  },
};
