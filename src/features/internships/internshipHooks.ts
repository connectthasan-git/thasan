"use client";

import { useState, useEffect } from "react";
import { internshipService } from "./internshipService";
import { Internship, InternshipApplication } from "@/types/internship";

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    internshipService
      .getActiveInternships()
      .then(setInternships)
      .catch(() => setInternships([]))
      .finally(() => setLoading(false));
  }, []);

  return { internships, loading };
}

export function useInternship(id: string) {
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    internshipService
      .getInternship(id)
      .then(setInternship)
      .catch(() => setInternship(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { internship, loading };
}

export function useMyApplications(userId: string) {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    internshipService
      .getUserApplications(userId)
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { applications, loading };
}

export function useApplyInternship() {
  const [loading, setLoading] = useState(false);

  const apply = async (internshipId: string, userId: string) => {
    setLoading(true);
    try {
      await internshipService.applyForInternship(internshipId, userId);
    } finally {
      setLoading(false);
    }
  };

  return { apply, loading };
}
