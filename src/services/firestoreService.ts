import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  serverTimestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

// Generic Firestore operations
export const createDocument = async (collectionName: string, dataOrDocId: string | Record<string, unknown>, maybeData?: Record<string, unknown>) => {
  const timestamp = { createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (typeof dataOrDocId === "string" && maybeData) {
    // createDocument(collection, docId, data)
    const docRef = doc(db, collectionName, dataOrDocId);
    await setDoc(docRef, { ...maybeData, ...timestamp });
    return docRef.id;
  }
  // createDocument(collection, data) — auto-generate ID
  const data = dataOrDocId as Record<string, unknown>;
  const docRef = await addDoc(collection(db, collectionName), { ...data, ...timestamp });
  return docRef.id;
};

export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

export const updateDocument = async (collectionName: string, docId: string, data: Record<string, unknown>) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

export const queryDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[],
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
};

export const getPaginatedDocuments = async <T>(
  collectionName: string,
  pageSize: number,
  lastDoc?: DocumentSnapshot,
  sortField: string = "createdAt",
  filters: QueryConstraint[] = [],
): Promise<{ data: T[]; lastVisible: DocumentSnapshot | null }> => {
  const constraints: QueryConstraint[] = [
    ...filters,
    orderBy(sortField, "desc"),
    limit(pageSize),
  ];

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { data, lastVisible };
};

// Exported query helpers
export { where, orderBy, limit };
