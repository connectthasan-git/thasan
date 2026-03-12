"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { registerWithEmail, loginWithEmail, loginWithGoogle, logout } from "@/services/authService";
import { createDocument } from "@/services/firestoreService";
import type { RegistrationData } from "@/types/user";

export function useAuthActions() {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: RegistrationData, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerWithEmail(data.email, password, data.name);
      await createDocument("users", user.uid, {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        college: data.college,
        degree: data.degree,
        role: "student",
        skills: data.skillsInterest,
        careerGoal: data.careerGoal,
        enrolledCourses: [],
        internshipStatus: "none",
        referralSource: data.referralSource,
      });
      await refreshProfile(user.uid);
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithEmail(email, password);
      await refreshProfile(user.uid);
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const googleLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      // Check if profile exists, if not create one
      await createDocument("users", user.uid, {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        role: "student",
        skills: [],
        enrolledCourses: [],
        internshipStatus: "none",
      });
      await refreshProfile(user.uid);
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await logout();
  }, []);

  return { register, login, googleLogin, signOut, loading, error };
}
