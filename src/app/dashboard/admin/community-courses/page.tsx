"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Filter, Search, XCircle } from "lucide-react";
import { communityService } from "@/features/community/communityService";
import { CommunityCourse, CommunityGroup } from "@/types/community";

export default function AdminCommunityCoursesPage() {
  const [courses, setCourses] = useState<CommunityCourse[]>([]);
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [courseData, groupData] = await Promise.all([
        communityService.getAllCourses(),
        communityService.getAllGroups(),
      ]);
      setCourses(courseData);
      setGroups(groupData);
    } catch {
      setCourses([]);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupMap = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((group) => map.set(group.id, group.name));
    return map;
  }, [groups]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesStatus = filterStatus === "all" || course.status === filterStatus;
      const searchTarget = `${course.title} ${groupMap.get(course.groupId) || ""}`.toLowerCase();
      const matchesSearch = !searchQuery || searchTarget.includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [courses, filterStatus, groupMap, searchQuery]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await communityService.updateCourse(id, { status });
      setCourses((prev) => prev.map((course) => (course.id === id ? { ...course, status } : course)));
    } catch {
      // no-op
    }
  };

  const pendingCount = courses.filter((course) => course.status === "pending").length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-gray-900">Community Course Moderation</h1>
        <p className="text-gray-500 mt-1">Approve or reject community course submissions.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search courses or communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all capitalize ${
                filterStatus === status
                  ? "bg-green-600 text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
              }`}
            >
              {status === "all" ? "All" : status} {status === "pending" && pendingCount > 0 ? `(${pendingCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-3xl p-6 border shadow-sm ${course.status === "pending" ? "border-amber-200" : "border-gray-100"}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {groupMap.get(course.groupId) || "Community"} • {course.instructorName || "Creator"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {course.isPaid ? `Paid • ${course.currency || "INR"} ${course.price?.toLocaleString("en-IN")}` : "Free"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {course.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(course.id, "approved")}
                        className="px-5 py-2.5 rounded-2xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(course.id, "rejected")}
                        className="px-5 py-2.5 rounded-2xl bg-white text-red-600 font-semibold text-sm border border-red-200 hover:bg-red-50 transition-all flex items-center gap-2"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  )}
                  {course.status !== "pending" && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      course.status === "approved"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {course.status}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
