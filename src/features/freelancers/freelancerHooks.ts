"use client";

import { useState, useEffect } from "react";
import { freelancerService } from "./freelancerService";
import { FreelancerProfile, ClientProject, Payment } from "@/types/freelancer";

export function useFreelancerProfile(userId: string) {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    freelancerService
      .getProfile(userId)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, loading };
}

export function useAvailableProjects() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    freelancerService
      .getAvailableProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}

export function useFreelancerProjects(freelancerId: string) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!freelancerId) return;
    freelancerService
      .getFreelancerProjects(freelancerId)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [freelancerId]);

  return { projects, loading };
}

export function useFreelancerPayments(freelancerId: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!freelancerId) return;
    freelancerService
      .getPayments(freelancerId)
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [freelancerId]);

  return { payments, loading };
}
