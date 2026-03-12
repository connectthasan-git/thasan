"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { queryDocuments } from "@/services/firestoreService";
import type { CommunityPost, Event } from "@/types/startup";
import Navbar from "@/components/layout/Navbar";
import { Heart, MessageCircle, Calendar, UsersRound, Sparkles, ArrowRight, Plus, Phone, ShieldCheck, X, Users, Mic } from "lucide-react";

const samplePosts: CommunityPost[] = [
  { id: "1", authorId: "u1", authorName: "Arjun Kumar", title: "Just completed my first AI Automation project!", content: "Built a chatbot using GPT APIs and Firebase. The course was incredibly helpful. Here is what I learned...", type: "project", likes: 24, commentsCount: 8, createdAt: new Date().toISOString() },
  { id: "2", authorId: "u2", authorName: "Priya Sharma", title: "Tips for landing your first freelance client", content: "After completing the Freelancing Launchpad course, I got my first client within 2 weeks. Here are my tips...", type: "discussion", likes: 45, commentsCount: 12, createdAt: new Date().toISOString() },
  { id: "3", authorId: "u3", authorName: "Rahul Verma", title: "Weekend Hackathon Results", content: "Our team built a SaaS tool in 48 hours during the Thasan Hackathon. Amazing experience!", type: "hackathon", likes: 67, commentsCount: 15, createdAt: new Date().toISOString() },
];

const sampleEvents: Event[] = [
  { id: "1", title: "AI Tools Workshop", description: "Hands-on workshop on ChatGPT, Midjourney, and automation tools.", type: "workshop", date: "2026-03-20", location: "Online", maxAttendees: 100, registeredUsers: [], createdAt: new Date().toISOString() },
  { id: "2", title: "Startup Pitch Night", description: "Present your startup idea to mentors and investors.", type: "demo-day", date: "2026-04-05", location: "Thasan Hub, Chennai", maxAttendees: 50, registeredUsers: [], createdAt: new Date().toISOString() },
  { id: "3", title: "Hackathon 2026", description: "48-hour hackathon. Build, demo, and win prizes.", type: "hackathon", date: "2026-04-15", location: "Online", maxAttendees: 200, registeredUsers: [], createdAt: new Date().toISOString() },
];

const typeBadge: Record<string, string> = { project: "bg-purple-50 text-purple-700", discussion: "bg-blue-50 text-blue-700", hackathon: "bg-amber-50 text-amber-700", workshop: "bg-green-50 text-green-700", "demo-day": "bg-rose-50 text-rose-700" };

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: "study" | "project" | "social";
  members: number;
  maxMembers: number;
  status: "approved" | "pending";
  hasVoiceCall: boolean;
  createdBy: string;
}

const sampleGroups: CommunityGroup[] = [
  { id: "g1", name: "AI Builders Hub", description: "Collaborate on AI/ML projects and share knowledge.", type: "project", members: 45, maxMembers: 100, status: "approved", hasVoiceCall: true, createdBy: "Arjun Kumar" },
  { id: "g2", name: "Web Dev Study Circle", description: "Weekly study sessions on React, Next.js, and modern web technologies.", type: "study", members: 32, maxMembers: 50, status: "approved", hasVoiceCall: true, createdBy: "Priya Sharma" },
  { id: "g3", name: "Startup Founders Network", description: "Connect with fellow founders, share ideas, and find co-founders.", type: "social", members: 28, maxMembers: 75, status: "approved", hasVoiceCall: false, createdBy: "Rahul Verma" },
  { id: "g4", name: "Data Science Lab", description: "Practice data analysis, ML modeling, and Kaggle competitions together.", type: "project", members: 0, maxMembers: 40, status: "pending", hasVoiceCall: true, createdBy: "Sneha Patel" },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(samplePosts);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [groups, setGroups] = useState<CommunityGroup[]>(sampleGroups);
  const [tab, setTab] = useState<"discussions" | "events" | "groups">("discussions");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", type: "study" as "study" | "project" | "social", maxMembers: 50, hasVoiceCall: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, eventsData] = await Promise.all([
          queryDocuments<CommunityPost>("community_posts", []),
          queryDocuments<Event>("events", []),
        ]);
        if (postsData.length > 0) setPosts(postsData);
        if (eventsData.length > 0) setEvents(eventsData);
      } catch { /* sample fallback */ }
    };
    fetchData();
  }, []);

  const handleCreateGroup = () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) return;
    const group: CommunityGroup = {
      id: `g${groups.length + 1}`,
      name: newGroup.name,
      description: newGroup.description,
      type: newGroup.type,
      members: 0,
      maxMembers: newGroup.maxMembers,
      status: "pending",
      hasVoiceCall: newGroup.hasVoiceCall,
      createdBy: "You",
    };
    setGroups((prev) => [...prev, group]);
    setNewGroup({ name: "", description: "", type: "study", maxMembers: 50, hasVoiceCall: false });
    setShowCreateGroup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[50%] bg-emerald-400 rounded-full blur-[100px] opacity-20" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles size={16} /> Connect, learn, and grow together
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Community</h1>
          <p className="text-green-100 max-w-2xl mx-auto text-lg">Connect, learn, and grow with fellow students, freelancers, and founders.</p>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {(["discussions", "events", "groups"] as const).map((t) => (
              <button
                key={t}
                className={`py-4 border-b-2 font-semibold text-sm transition-colors ${tab === t ? "border-green-600 text-green-600" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                onClick={() => setTab(t)}
              >
                {t === "discussions" ? "Discussions" : t === "events" ? "Events & Hackathons" : "Groups & Voice Calls"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tab === "discussions" ? (
            <div className="space-y-5">
              {posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {post.authorName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{post.authorName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeBadge[post.type] || "bg-gray-100 text-gray-600"}`}>{post.type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-5 mt-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer transition-colors"><Heart size={16} /> {post.likes}</span>
                        <span className="flex items-center gap-1.5"><MessageCircle size={16} /> {post.commentsCount} comments</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : tab === "events" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeBadge[event.type] || "bg-green-50 text-green-700"}`}>{event.type}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
                    <span className="flex items-center gap-1.5"><Calendar size={15} /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><UsersRound size={15} /> {event.maxAttendees} spots</span>
                  </div>
                  <button className="w-full py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-green-300 transition-all flex items-center justify-center gap-2">
                    Register <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              {/* Groups Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Community Groups</h2>
                  <p className="text-gray-500 text-sm mt-1">Create or join groups for study, projects, and voice calls. New groups require admin approval.</p>
                </div>
                <button onClick={() => setShowCreateGroup(true)} className="px-5 py-2.5 bg-green-600 text-white rounded-2xl font-semibold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2">
                  <Plus size={16} /> Create Group
                </button>
              </div>

              {/* Admin Approval Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
                <ShieldCheck size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Admin Approval Required</p>
                  <p className="text-xs text-amber-600 mt-0.5">All new groups and voice call features require admin approval before they become active. This ensures quality and safety for all members.</p>
                </div>
              </div>

              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map((group, i) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all p-6 ${group.status === "pending" ? "border-amber-200 opacity-75" : "border-gray-100"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${group.type === "study" ? "bg-blue-50" : group.type === "project" ? "bg-purple-50" : "bg-green-50"}`}>
                          <Users size={22} className={`${group.type === "study" ? "text-blue-600" : group.type === "project" ? "text-purple-600" : "text-green-600"}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                          <span className="text-xs text-gray-400">by {group.createdBy}</span>
                        </div>
                      </div>
                      {group.status === "pending" ? (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1">
                          <ShieldCheck size={12} /> Pending Approval
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{group.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1.5"><UsersRound size={14} /> {group.members}/{group.maxMembers} members</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${group.type === "study" ? "bg-blue-50 text-blue-700" : group.type === "project" ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}>{group.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={group.status === "pending"}
                        className={`flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${group.status === "pending" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-green-300"}`}
                      >
                        {group.status === "pending" ? "Awaiting Approval" : "Join Group"}
                      </button>
                      {group.hasVoiceCall && group.status === "approved" && (
                        <button className="px-4 py-3 rounded-2xl bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-all flex items-center gap-2">
                          <Mic size={16} /> Voice Call
                        </button>
                      )}
                      {group.hasVoiceCall && group.status === "pending" && (
                        <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-400 text-sm flex items-center gap-2">
                          <Mic size={16} /> Voice (Pending)
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Create New Group</h3>
              <button onClick={() => setShowCreateGroup(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="e.g., AI Research Circle"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What's your group about?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Group Type</label>
                  <select
                    value={newGroup.type}
                    onChange={(e) => setNewGroup({ ...newGroup, type: e.target.value as "study" | "project" | "social" })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="study">Study Group</option>
                    <option value="project">Project Group</option>
                    <option value="social">Social Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Members</label>
                  <input
                    type="number"
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup({ ...newGroup, maxMembers: Number(e.target.value) })}
                    min={2}
                    max={500}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                <input
                  type="checkbox"
                  id="voiceCall"
                  checked={newGroup.hasVoiceCall}
                  onChange={(e) => setNewGroup({ ...newGroup, hasVoiceCall: e.target.checked })}
                  className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="voiceCall" className="flex items-center gap-2 text-sm font-medium text-green-800 cursor-pointer">
                  <Phone size={16} /> Enable Voice Call Feature
                </label>
                <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Requires License</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
                <ShieldCheck size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Your group will be submitted for admin review. You&apos;ll be notified once approved.</p>
              </div>

              <button
                onClick={handleCreateGroup}
                className="w-full py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Submit for Approval
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Thasan AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
