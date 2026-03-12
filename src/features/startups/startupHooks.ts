"use client";

import { useState, useEffect } from "react";
import { startupService } from "./startupService";
import { Startup } from "@/types/startup";

export function useStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startupService
      .getAllStartups()
      .then(setStartups)
      .catch(() => setStartups([]))
      .finally(() => setLoading(false));
  }, []);

  return { startups, loading };
}

export function useStartup(id: string) {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    startupService
      .getStartup(id)
      .then(setStartup)
      .catch(() => setStartup(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { startup, loading };
}

export function useFounderStartup(founderId: string) {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!founderId) return;
    startupService
      .getStartupByFounder(founderId)
      .then(setStartup)
      .catch(() => setStartup(null))
      .finally(() => setLoading(false));
  }, [founderId]);

  return { startup, loading };
}
