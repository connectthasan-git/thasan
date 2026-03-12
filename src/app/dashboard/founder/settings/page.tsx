"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useUser";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function FounderSettingsPage() {
  const { profile } = useAuth();
  const { updateProfile, loading } = useUpdateProfile();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [location, setLocation] = useState(profile?.location || "");

  const handleSave = async () => {
    await updateProfile({ name, phone, location });
    toast.success("Profile updated!");
  };

  const fields = [
    { label: "Name", value: name, onChange: setName, icon: <User className="w-5 h-5" />, disabled: false },
    { label: "Email", value: profile?.email || "", onChange: () => {}, icon: <Mail className="w-5 h-5" />, disabled: true },
    { label: "Phone", value: phone, onChange: setPhone, icon: <Phone className="w-5 h-5" />, disabled: false },
    { label: "Location", value: location, onChange: setLocation, icon: <MapPin className="w-5 h-5" />, disabled: false },
  ];

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900">Settings</motion.h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
        <div className="space-y-4 max-w-lg">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{f.icon}</div>
                <input
                  type="text"
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  disabled={f.disabled}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
