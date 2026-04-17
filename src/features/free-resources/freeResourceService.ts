import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/services/firestoreService";
import { FreeResource } from "@/types/freeResource";

const COLLECTION = "freeResources";

export const freeResourceService = {
  async createResource(data: Omit<FreeResource, "id">) {
    return createDocument(COLLECTION, data as unknown as Record<string, unknown>);
  },

  async getResource(id: string) {
    return getDocument<FreeResource>(COLLECTION, id);
  },

  async updateResource(id: string, data: Partial<FreeResource>) {
    return updateDocument(COLLECTION, id, data as Record<string, unknown>);
  },

  async deleteResource(id: string) {
    return deleteDocument(COLLECTION, id);
  },

  async getPublishedResources() {
    return queryDocuments<FreeResource>(COLLECTION, [
      where("isPublished", "==", true),
      orderBy("createdAt", "desc"),
    ]);
  },

  async getAllResources() {
    return queryDocuments<FreeResource>(COLLECTION, [orderBy("createdAt", "desc")]);
  },
};
