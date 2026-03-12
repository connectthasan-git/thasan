"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { Rocket, Lightbulb, GraduationCap, Users, Presentation, ArrowRight, Sparkles } from "lucide-react";

const stages = [
  { icon: <Lightbulb size={28} />, step: "01", title: "Idea Submission", description: "Submit your startup idea, problem statement, target market, and solution concept.", color: "bg-amber-50 text-amber-600" },
  { icon: <GraduationCap size={28} />, step: "02", title: "Founder Training", description: "Learn startup fundamentals, MVP development, marketing, business models, and fundraising.", color: "bg-blue-50 text-blue-600" },
  { icon: <Users size={28} />, step: "03", title: "Incubation", description: "Get mentorship, tech development support, freelancer team, and community access.", color: "bg-purple-50 text-purple-600" },
  { icon: <Presentation size={28} />, step: "04", title: "Demo Day", description: "Pitch your startup to investors, mentors, and industry partners.", color: "bg-rose-50 text-rose-600" },
];

const clubs = [
  { name: "Thasan AI Club", desc: "AI workshops, tool sessions, and automation projects.", icon: <Sparkles size={24} />, color: "bg-purple-50 text-purple-600" },
  { name: "Thasan Tech Club", desc: "Hackathons, tech talks, and skill bootcamps.", icon: <Rocket size={24} />, color: "bg-blue-50 text-blue-600" },
  { name: "Thasan Startup Club", desc: "Startup ideation, founder meetups, and mentorship.", icon: <Lightbulb size={24} />, color: "bg-amber-50 text-amber-600" },
];

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-24">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-green-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[50%] bg-emerald-400 rounded-full blur-[100px] opacity-20" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <Rocket size={16} /> From idea to funded startup
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Innovation Clubs</h1>
          <p className="text-green-100 max-w-2xl mx-auto text-lg mb-10">
            Join or launch college innovation clubs. Learn, collaborate, and build amazing projects together.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-all shadow-lg">
            Apply Now <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Your Startup Journey</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Four steps from ideation to investor-ready startup.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stages.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-8 text-center">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-green-600 mb-2">Step {s.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* College Clubs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">College Innovation Clubs</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Bring innovation to your campus. Each club has a President, Technical Lead, Event Coordinator, and Community Manager.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clubs.map((club, i) => (
              <motion.div key={club.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gray-50/80 rounded-3xl border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 ${club.color} rounded-2xl flex items-center justify-center mb-5`}>
                  {club.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{club.name}</h3>
                <p className="text-gray-500 text-sm mb-5">{club.desc}</p>
                <button className="text-green-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white py-24">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-green-500 rounded-full blur-[100px] opacity-25" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready to Start a Club?</h2>
          <p className="text-green-100 text-lg mb-10">Apply to launch an innovation club at your campus and lead the next generation of builders.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-green-700 font-bold text-lg hover:bg-green-50 transition-all shadow-lg">
            Apply Now <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Thasan AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
