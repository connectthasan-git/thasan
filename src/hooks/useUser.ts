"use client";

import { useState, useEffect } from "react";
import { getDocument, updateDocument } from "@/services/firestoreService";
import { useAuth } from "@/context/AuthContext";
import type { UserProfile } from "@/types/user";

export function useUser() {
  const { user, profile, loading } = useAuth();
  return { user, profile, loading };
}

export function useUserById(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      const data = await getDocument<UserProfile>("users", userId);
      setProfile(data);
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  return { profile, loading };
}

export function useUpdateProfile() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDocument("users", user.uid, data as Record<string, unknown>);
      await refreshProfile();
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
}
