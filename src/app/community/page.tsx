"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { queryDocuments } from "@/services/firestoreService";
import type { Event } from "@/types/startup";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { communityService } from "@/features/community/communityService";
import type { CommunityGroup } from "@/types/community";
import { Calendar, UsersRound, Sparkles, ArrowRight, Plus, Phone, ShieldCheck, X, Users, Mic } from "lucide-react";
import { useSearchParams } from "next/navigation";

const sampleEvents: Event[] = [
  { id: "1", title: "AI Tools Workshop", description: "Hands-on workshop on ChatGPT, Midjourney, and automation tools.", type: "workshop", date: "2026-03-20", location: "Online", maxAttendees: 100, registeredUsers: [], createdAt: new Date().toISOString() },
  { id: "2", title: "Startup Pitch Night", description: "Present your startup idea to mentors and investors.", type: "demo-day", date: "2026-04-05", location: "Thasan Hub, Chennai", maxAttendees: 50, registeredUsers: [], createdAt: new Date().toISOString() },
  { id: "3", title: "Hackathon 2026", description: "48-hour hackathon. Build, demo, and win prizes.", type: "hackathon", date: "2026-04-15", location: "Online", maxAttendees: 200, registeredUsers: [], createdAt: new Date().toISOString() },
];

const typeBadge: Record<string, string> = { hackathon: "bg-amber-50 text-amber-700", workshop: "bg-green-50 text-green-700", "demo-day": "bg-rose-50 text-rose-700" };

export default function CommunityPage() {
  const { user, profile } = useAuth();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [tab, setTab] = useState<"events" | "groups">("groups");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", type: "study" as "study" | "project" | "social", maxMembers: 50, hasVoiceCall: false, unlimitedMembers: false });
  const [groupError, setGroupError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData] = await Promise.all([
          queryDocuments<Event>("events", []),
        ]);
        if (eventsData.length > 0) setEvents(eventsData);
      } catch { /* sample fallback */ }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const approved = await communityService.getApprovedGroups();
        if (user) {
          const mine = await communityService.getGroupsByCreator(user.uid);
          const pendingMine = mine.filter((group) => group.status !== "approved");
          const map = new Map<string, CommunityGroup>();
          approved.forEach((group) => map.set(group.id, group));
          pendingMine.forEach((group) => map.set(group.id, group));
          setGroups(Array.from(map.values()));
        } else {
          setGroups(approved);
        }
      } catch {
        setGroups([]);
      }
    };
    fetchGroups();
  }, [user]);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setTab("groups");
      setShowCreateGroup(true);
    }
  }, [searchParams]);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const aPending = a.status !== "approved" ? 0 : 1;
      const bPending = b.status !== "approved" ? 0 : 1;
      return aPending - bPending;
    });
  }, [groups]);

  const handleCreateGroup = async () => {
    if (!user) {
      setGroupError("Please login to create a community.");
      return;
    }
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      setGroupError("Name and description are required.");
      return;
    }
    setGroupError(null);
    try {
      const id = await communityService.createGroup({
        name: newGroup.name.trim(),
        description: newGroup.description.trim(),
        type: newGroup.type,
        members: 0,
        maxMembers: newGroup.unlimitedMembers ? 0 : newGroup.maxMembers,
        status: "pending",
        hasVoiceCall: newGroup.hasVoiceCall,
        createdBy: user.uid,
        createdByName: profile?.name || "",
      });
      setGroups((prev) => [
        {
          id,
          name: newGroup.name.trim(),
          description: newGroup.description.trim(),
          type: newGroup.type,
          members: 0,
          maxMembers: newGroup.unlimitedMembers ? 0 : newGroup.maxMembers,
          status: "pending",
          hasVoiceCall: newGroup.hasVoiceCall,
          createdBy: user.uid,
          createdByName: profile?.name || "",
        },
        ...prev,
      ]);
      setNewGroup({ name: "", description: "", type: "study", maxMembers: 50, hasVoiceCall: false, unlimitedMembers: false });
      setShowCreateGroup(false);
    } catch {
      setGroupError("Unable to submit group. Please try again.");
    }
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
            {(["groups", "events"] as const).map((t) => (
              <button
                key={t}
                className={`py-4 border-b-2 font-semibold text-sm transition-colors ${tab === t ? "border-green-600 text-green-600" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                onClick={() => setTab(t)}
              >
                {t === "events" ? "Events & Hackathons" : "Communities"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tab === "events" ? (
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
                  <h2 className="text-2xl font-extrabold text-gray-900">Communities</h2>
                  <p className="text-gray-500 text-sm mt-1">Create a community and share your YouTube-based courses. New communities require admin approval.</p>
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
                {sortedGroups.map((group, i) => (
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
                          <span className="text-xs text-gray-400">by {group.createdByName || "Community Member"}</span>
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
                      <span className="flex items-center gap-1.5"><UsersRound size={14} /> {group.members}/{group.maxMembers === 0 ? "Unlimited" : group.maxMembers} members</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${group.type === "study" ? "bg-blue-50 text-blue-700" : group.type === "project" ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}>{group.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {group.status === "approved" ? (
                        <Link
                          href={`/community/groups/${group.id}`}
                          className="flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-green-300"
                        >
                          Enter Community
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
                        >
                          Awaiting Approval
                        </button>
                      )}
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

            {groupError && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-2xl text-sm">
                {groupError}
              </div>
            )}

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
                    disabled={newGroup.unlimitedMembers}
                    className={`w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none ${newGroup.unlimitedMembers ? "bg-gray-100 text-gray-400" : ""}`}
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={newGroup.unlimitedMembers}
                  onChange={(e) => setNewGroup({ ...newGroup, unlimitedMembers: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Unlimited members
              </label>
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
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link href="/community?create=1" className="text-green-600 font-semibold hover:text-green-700">
              Create a Community
            </Link>
            <Link href="/community" className="text-gray-500 hover:text-gray-700">
              Browse Communities
            </Link>
          </div>
          <div>© {new Date().getFullYear()} Thasan AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
