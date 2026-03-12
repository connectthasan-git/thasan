import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";
import type { Notification } from "@/types/startup";

export const sendNotification = async (
  userId: string,
  message: string,
  type: Notification["type"],
) => {
  await addDoc(collection(db, "notifications"), {
    userId,
    message,
    type,
    read: false,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void,
): Unsubscribe => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
    callback(notifications);
  });
};
