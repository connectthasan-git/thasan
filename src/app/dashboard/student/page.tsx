"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { GraduationCap, ClipboardList, Briefcase, Award, BookOpen, Target } from "lucide-react";

export default function StudentDashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const stats = [
    { icon: <GraduationCap className="w-6 h-6" />, label: "Enrolled Courses", value: profile?.enrolledCourses?.length || 0, color: "text-green-600 bg-green-50 border-green-100" },
    { icon: <ClipboardList className="w-6 h-6" />, label: "Projects", value: 0, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { icon: <Briefcase className="w-6 h-6" />, label: "Internship", value: profile?.internshipStatus === "active" ? "Active" : "None", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { icon: <Award className="w-6 h-6" />, label: "Certificates", value: 0, color: "text-purple-600 bg-purple-50 border-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.name || "Student"} 👋
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Here is your learning progress overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl border ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Courses</h2>
          {profile?.enrolledCourses && profile.enrolledCourses.length > 0 ? (
            <ul className="space-y-3">
              {profile.enrolledCourses.map((courseId) => (
                <li key={courseId} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                  <span className="text-sm font-medium text-gray-700">Course: {courseId}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">In Progress</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No courses enrolled yet</p>
              <p className="text-sm mt-1">Explore courses to get started!</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="text-center py-10 text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No tasks yet</p>
            <p className="text-sm mt-1">Your assignments and tasks will appear here.</p>
          </div>
        </motion.div>
      </div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100 capitalize">{profile?.role || "student"}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Career Goal</p>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <p className="font-medium text-gray-900 capitalize">{profile?.careerGoal || "Not set"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Skills</p>
            <div className="flex gap-2 flex-wrap">
              {profile?.skills?.length ? (
                profile.skills.map((s) => (
                  <span key={s} className="px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">{s}</span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No skills added</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
