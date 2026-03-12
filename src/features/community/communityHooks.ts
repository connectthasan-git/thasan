"use client";

import { useState, useEffect } from "react";
import { communityService } from "./communityService";
import { CommunityPost, CommunityComment, Event, Club } from "@/types/startup";

export function usePosts(category?: string) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = category
      ? communityService.getPostsByCategory(category)
      : communityService.getPosts();

    fetch
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category]);

  return { posts, loading };
}

export function usePostComments(postId: string) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    communityService
      .getPostComments(postId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [postId]);

  return { comments, loading };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityService
      .getAllEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
}

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communityService
      .getClubs()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  }, []);

  return { clubs, loading };
}
