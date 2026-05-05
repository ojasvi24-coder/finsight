"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Home, BarChart3, BookOpen, LogOut, LogIn, X, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/user";

interface SidebarProps {
  onNavigate?: () => void;
}

const navStatus: Record<string, { color: string; label: string } | undefined> = {
  "/dashboard": { color: "bg-emerald-400", label: "On track" },
  "/learn":     { color: "bg-blue-400",    label: "6 articles" },
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname    = usePathname();
  const router      = useRouter();
  const searchParams = useSearchParams();
  const { firstName, initials, hasProfile, email, updateUser } = useUser();

  const menuItems = [
    { name: "Home",      path: "/",          icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Learn",     path: "/learn",     icon: BookOpen },
  ];

  const handleLinkClick = () => { if (onNavigate) onNavigate(); };

  const openProfile = () => {
    handleLinkClick();
    const current = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    current.set("profile", "open");
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleSignOut = () => {
    updateUser({ name: "", email: "" });
    handleLinkClick();
    router.push("/");
  };

  return (
    <aside className="relative flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl">
      <div>
        <div className="mb-10 flex items-center justify-between pl-2">
          <h2 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-2xl font-black text-transparent">
            FinSight
          </h2>
          <button onClick={handleLinkClick}
            className="p-1 text-slate-400 transition-colors hover:text-white lg:hidden" aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map(item => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const status = navStatus[item.path];
            return (
              <Link key={item.name} href={item.path} onClick={handleLinkClick}>
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_-10px_rgba(16,185,129,0.6)]"
                      : "border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  }`}>
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="flex-1 font-medium">{item.name}</span>
                  {status && (
                    <span className="relative flex h-2 w-2 flex-shrink-0" title={status.label}>
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.color} opacity-40`} />
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${status.color}`} />
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          <button onClick={openProfile}
            className="flex w-full items-center gap-3.5 rounded-lg border border-transparent px-3.5 py-2.5 text-sm text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100">
            <Settings className="h-[18px] w-[18px]" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>
      </div>

      <div className="space-y-3">
        {hasProfile ? (
          <>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/20">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-200">{firstName}</p>
                <p className="truncate text-[11px] text-slate-500">{email || "Signed in"}</p>
              </div>
            </div>
            <button onClick={handleSignOut}
              className="group flex w-full items-center gap-3.5 rounded-lg border border-transparent px-3.5 py-2.5 text-sm text-slate-400 transition-colors hover:border-rose-500/20 hover:bg-rose-500/5 hover:text-rose-300">
              <LogOut className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-0.5" />
              <span className="font-medium">Log out</span>
            </button>
          </>
        ) : (
          <button onClick={openProfile}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]">
            <LogIn className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
            <span>Set up profile</span>
          </button>
        )}
      </div>
    </aside>
  );
}

