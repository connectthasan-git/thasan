"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { Search, Briefcase, MapPin, Clock, DollarSign, ArrowRight, Send, Bot, User, Sparkles, ExternalLink, Building2 } from "lucide-react";

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  tags: string[];
}

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

const sampleJobs: JobPost[] = [
  { id: "1", title: "AI/ML Engineer", company: "TechCorp", location: "Remote", type: "Full-time", salary: "₹8-15 LPA", posted: "2 days ago", tags: ["Python", "TensorFlow", "NLP"] },
  { id: "2", title: "Full Stack Developer", company: "StartupX", location: "Bangalore", type: "Full-time", salary: "₹6-12 LPA", posted: "3 days ago", tags: ["React", "Node.js", "MongoDB"] },
  { id: "3", title: "Data Analyst Intern", company: "DataWave", location: "Hybrid", type: "Internship", salary: "₹15-25K/mo", posted: "1 day ago", tags: ["SQL", "Python", "Tableau"] },
  { id: "4", title: "UI/UX Designer", company: "CreativeHub", location: "Remote", type: "Contract", salary: "₹4-8 LPA", posted: "5 days ago", tags: ["Figma", "User Research", "Prototyping"] },
  { id: "5", title: "DevOps Engineer", company: "CloudNine", location: "Chennai", type: "Full-time", salary: "₹10-18 LPA", posted: "1 day ago", tags: ["AWS", "Docker", "Kubernetes"] },
  { id: "6", title: "Mobile App Developer", company: "AppForge", location: "Remote", type: "Full-time", salary: "₹7-14 LPA", posted: "4 days ago", tags: ["React Native", "Flutter", "Firebase"] },
];

const botResponses: Record<string, string> = {
  default: "I can help you find jobs! Try asking about specific roles like 'AI jobs', 'remote positions', 'internships', or 'salary expectations'. I scan hiring posts across platforms to bring you the latest opportunities.",
  ai: "🤖 Great choice! Here are trending AI/ML roles:\n\n• AI/ML Engineer at TechCorp — ₹8-15 LPA (Remote)\n• Data Scientist at AnalyticsPro — ₹10-20 LPA (Bangalore)\n• NLP Researcher at LangTech — ₹12-22 LPA (Remote)\n\nTip: Build projects on Thasan AI courses to stand out! Shall I filter by experience level?",
  remote: "🌍 Remote positions are booming! Current openings:\n\n• AI/ML Engineer — TechCorp (₹8-15 LPA)\n• UI/UX Designer — CreativeHub (₹4-8 LPA)\n• Mobile App Developer — AppForge (₹7-14 LPA)\n\nRemote roles have 3x more applicants — make sure your portfolio stands out!",
  intern: "🎓 Internship opportunities found:\n\n• Data Analyst Intern — DataWave (₹15-25K/mo, Hybrid)\n• Frontend Intern — WebStudio (₹10-20K/mo, Remote)\n• AI Research Intern — DeepLab (₹20-30K/mo, Bangalore)\n\nThasan AI students get priority referrals. Complete your profile to get matched!",
  salary: "💰 Current salary trends in tech:\n\n• Entry Level (0-2 yrs): ₹4-8 LPA\n• Mid Level (2-5 yrs): ₹8-18 LPA\n• Senior (5+ yrs): ₹18-35 LPA\n• AI/ML roles: 20-40% premium over general dev roles\n\nWant me to find jobs in a specific salary range?",
  frontend: "⚡ Frontend Developer roles:\n\n• React Developer — StartupX (₹6-12 LPA, Bangalore)\n• Frontend Engineer — WebCraft (₹8-15 LPA, Remote)\n• Next.js Developer — CloudApps (₹7-14 LPA, Hyderabad)\n\nReact & Next.js are the most in-demand frameworks right now!",
  backend: "🔧 Backend roles available:\n\n• Node.js Developer — APIHub (₹7-13 LPA, Remote)\n• Python Backend — DataFlow (₹8-16 LPA, Pune)\n• Go Developer — MicroServ (₹10-20 LPA, Bangalore)\n\nTip: System design knowledge can boost your offer by 30%!",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("machine learning")) return botResponses.ai;
  if (lower.includes("remote") || lower.includes("work from home")) return botResponses.remote;
  if (lower.includes("intern") || lower.includes("fresher") || lower.includes("entry")) return botResponses.intern;
  if (lower.includes("salary") || lower.includes("pay") || lower.includes("compensation") || lower.includes("lpa")) return botResponses.salary;
  if (lower.includes("frontend") || lower.includes("react") || lower.includes("ui")) return botResponses.frontend;
  if (lower.includes("backend") || lower.includes("node") || lower.includes("python") || lower.includes("api")) return botResponses.backend;
  return botResponses.default;
}

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "bot", content: "👋 Hi! I'm Thasan's Hiring Bot. I scan thousands of hiring posts to find the best opportunities for you. Ask me about jobs, salaries, or career advice!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filteredJobs = sampleJobs.filter((job) => {
    const matchesSearch = !searchQuery || job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase()) || job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || job.type.toLowerCase().replace("-", "") === filterType.toLowerCase().replace("-", "");
    return matchesSearch && matchesType;
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", content: getBotResponse(userMsg) }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[50%] bg-emerald-400 rounded-full blur-[100px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-6">
              <Bot size={16} /> AI-Powered Hiring Bot Active
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Find Your Dream <span className="text-green-200">Career</span>
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
              Our AI hiring bot scans thousands of job posts across platforms to bring you the most relevant opportunities. Get matched, get hired.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setChatOpen(true)} className="px-8 py-3 bg-white text-green-700 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-xl flex items-center gap-2">
                <Bot size={18} /> Talk to Hiring Bot
              </button>
              <a href="#jobs" className="px-8 py-3 bg-white/15 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-white/25 transition-all flex items-center gap-2">
                <Search size={18} /> Browse Jobs
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "5,000+", label: "Jobs Scanned Daily", icon: Search },
            { value: "1,200+", label: "Students Placed", icon: Briefcase },
            { value: "500+", label: "Partner Companies", icon: Building2 },
            { value: "95%", label: "Success Rate", icon: Sparkles },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
              <stat.icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Job Listings */}
      <section id="jobs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Latest Opportunities</h2>
          <p className="text-gray-500 mb-8">Found by our AI bot scanning hiring posts across platforms</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "Full-time", "Internship", "Contract"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all ${filterType === type ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"}`}
                >
                  {type === "all" ? "All Types" : type}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards */}
          <div className="grid gap-4">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                      <span className="text-gray-400">{job.posted}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-2xl bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-all flex items-center gap-2 whitespace-nowrap">
                    Apply Now <ExternalLink size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No jobs match your search. Try different keywords.</p>
              <button onClick={() => setChatOpen(true)} className="mt-4 text-green-600 font-semibold hover:underline flex items-center gap-1 mx-auto">
                <Bot size={16} /> Ask the Hiring Bot instead
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* How Bot Works */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">How Our Hiring Bot Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Powered by AI to give you the best career opportunities</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Scans Hiring Posts", desc: "Our bot continuously scans job boards, LinkedIn, company websites, and social media for the latest hiring posts.", icon: Search },
              { step: "02", title: "Matches Your Profile", desc: "Based on your skills, experience, and preferences, the bot ranks and recommends the most relevant opportunities.", icon: Sparkles },
              { step: "03", title: "Instant Notifications", desc: "Get real-time alerts when new jobs match your profile. Apply directly through our platform with one click.", icon: ArrowRight },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-gray-50 rounded-3xl p-8 text-center"
              >
                <div className="text-6xl font-black text-green-100 mb-4">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[100px] opacity-30" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">Ready to Land Your Dream Job?</h2>
          <p className="text-green-100 text-lg max-w-xl mx-auto mb-8 relative z-10">
            Let our AI hiring bot do the hard work. Get personalized job matches and career guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <button onClick={() => setChatOpen(true)} className="px-8 py-3 bg-white text-green-700 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-xl flex items-center gap-2">
              <Bot size={18} /> Chat with Hiring Bot
            </button>
            <Link href="/register" className="px-8 py-3 bg-white/15 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-white/25 transition-all flex items-center gap-2">
              Create Profile <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Hiring Bot Chat Widget */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-48px)] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm">Thasan Hiring Bot</div>
                  <div className="text-xs text-green-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" /> Online — Scanning jobs
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white text-xl font-bold">✕</button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} className="text-green-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${msg.role === "user" ? "bg-green-600 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"}`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about jobs, salaries, roles..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-11 h-11 rounded-2xl bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["AI Jobs", "Remote", "Internships", "Salary"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q); setTimeout(() => { setChatMessages((prev) => [...prev, { role: "user", content: q }]); setChatInput(""); setTimeout(() => setChatMessages((prev) => [...prev, { role: "bot", content: getBotResponse(q) }]), 800); }, 100); }}
                    className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bot Button */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-300 hover:bg-green-700 transition-all z-50"
        >
          <Bot size={24} />
        </motion.button>
      )}
    </div>
  );
}
