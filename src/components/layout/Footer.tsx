import Link from "next/link";
import Image from "next/image";
import { APP_NAME, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/assets/image.png" alt="Thasan AI" width={36} height={36} className="rounded-lg" />
              <span className="text-xl font-bold text-gray-900">{APP_NAME}<span className="text-green-600">AI</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Transform from Student to Skilled Professional to Freelancer to Startup Founder.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Learn</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/courses" className="hover:text-green-600 transition-colors">All Courses</Link></li>
              <li><Link href="/courses" className="hover:text-green-600 transition-colors">AI Automation</Link></li>
              <li><Link href="/courses" className="hover:text-green-600 transition-colors">Freelancing Skills</Link></li>
              <li><Link href="/courses" className="hover:text-green-600 transition-colors">Startup Fundamentals</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/community" className="hover:text-green-600 transition-colors">Discussions</Link></li>
              <li><Link href="/community" className="hover:text-green-600 transition-colors">Events</Link></li>
              <li><Link href="/community" className="hover:text-green-600 transition-colors">Hackathons</Link></li>
              <li><Link href="/careers" className="hover:text-green-600 transition-colors">Careers</Link></li>
              <li><Link href="/free-sources" className="hover:text-green-600 transition-colors">Free Sources</Link></li>
              <li><Link href="/clubs" className="hover:text-green-600 transition-colors">Clubs</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-green-600 transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-green-600 transition-colors">Contact</Link></li>
              <li><Link href="/" className="hover:text-green-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-green-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {APP_NAME} Organization. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-green-600 transition-colors">WhatsApp</a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
