"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, BookOpen, LogOut, X, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import useUser from "@/app/user/page";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { firstName, initials, hasProfile, email } = useUser();

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Guide", path: "/learn", icon: BookOpen },
  ];

  const handleLinkClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="relative flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl">
      {/* Top Section */}
      <div>
        <div className="mb-10 flex items-center justify-between pl-2">
          <h2 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-2xl font-black text-transparent">
            FinSight
          </h2>
          <button
            onClick={handleLinkClick}
            className="p-1 text-slate-400 transition-colors hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.path} onClick={handleLinkClick}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section — Dynamic profile strip (no "Pro account" label) */}
      <div className="space-y-3">
        {hasProfile ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/20"
              aria-label={`Avatar for ${firstName}`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-200">
                {firstName}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {email || "Signed in"}
              </p>
            </div>
          </div>
        ) : (
          // Empty state — prompt the user to set their name via Dashboard Settings
          <Link href="/dashboard" onClick={handleLinkClick}>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-900/30 p-3 transition-colors hover:border-slate-600 hover:bg-slate-900/60">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <UserPlus className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-300">
                  Set your name
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Open Settings →
                </p>
              </div>
            </div>
          </Link>
        )}

        <button
          onClick={() => alert("Logging out...")}
          className="group flex w-full items-center gap-3.5 rounded-lg border border-transparent px-3.5 py-2.5 text-sm text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100"
          aria-label="Sign out"
        >
          <LogOut className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
}

