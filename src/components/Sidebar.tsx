"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, BookOpen, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Learning Hub", path: "/learn", icon: BookOpen },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col justify-between z-50">
      {/* Top Section: Logo & Links */}
      <div>
        {/* App Logo/Brand */}
        <div className="mb-10 pl-2">
          <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            FinSight
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Exit/Logout Button */}
      <div>
        <button 
          onClick={() => alert("Add your logout logic here!")}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Exit</span>
        </button>
      </div>
    </aside>
  );
}
