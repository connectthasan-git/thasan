import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export const uploadFile = async (
  path: string,
  file: File,
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Upload helpers for different content types
export const uploadCourseVideo = (courseId: string, file: File) =>
  uploadFile(`courses/videos/${courseId}/${file.name}`, file);

export const uploadProjectFile = (projectId: string, file: File) =>
  uploadFile(`projects/uploads/${projectId}/${file.name}`, file);

export const uploadProfileImage = (userId: string, file: File) =>
  uploadFile(`users/profile/${userId}/${file.name}`, file);

export const uploadCertificate = (certId: string, file: File) =>
  uploadFile(`certificates/${certId}/${file.name}`, file);

export const uploadFreeResourceFile = (resourceId: string, file: File) =>
  uploadFile(`free-resources/${resourceId}/${file.name}`, file);
