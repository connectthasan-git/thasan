"use client";

import { motion } from "framer-motion";
import { Settings, ShieldCheck, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const sections = [
    {
      title: "General Settings",
      icon: <Settings className="w-5 h-5" />,
      color: "text-green-600 bg-green-50 border-green-100",
      items: [
        { label: "Platform Name", desc: "Thasan Platform", action: "button", actionLabel: "Edit" },
        { label: "Maintenance Mode", desc: "Platform is live", action: "badge", actionLabel: "Off", badgeColor: "bg-green-50 text-green-700 border-green-100" },
      ],
    },
    {
      title: "Security",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      items: [
        { label: "Two-Factor Authentication", desc: "Additional security for admin accounts", action: "badge", actionLabel: "Disabled", badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-100" },
        { label: "Firebase Security Rules", desc: "Manage database access rules", action: "button", actionLabel: "Configure" },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      color: "text-orange-600 bg-orange-50 border-orange-100",
      items: [
        { label: "Email Notifications", desc: "Send emails for important events", action: "badge", actionLabel: "Enabled", badgeColor: "bg-green-50 text-green-700 border-green-100" },
        { label: "Push Notifications", desc: "Browser push notifications via FCM", action: "badge", actionLabel: "Disabled", badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-100" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-500 mt-2 text-lg">Configure platform preferences</p>
      </motion.div>

      <div className="space-y-6 max-w-2xl">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className={`p-2.5 rounded-2xl border ${section.color}`}>{section.icon}</div>
              <h2 className="font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  {item.action === "button" ? (
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:border-green-200 transition-all">{item.actionLabel}</button>
                  ) : (
                    <span className={`px-3 py-0.5 text-xs font-medium rounded-full border ${item.badgeColor}`}>{item.actionLabel}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
