"use client";

import React, { Suspense, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProfileModal from "@/components/ProfileModal";
import CommandPalette from "@/components/CommandPalette";
import LiveTelemetry from "@/components/LiveTelemetry";
import { Menu, Command } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <span className="font-bold text-emerald-400">FinSight</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex">
        {/* Navigation Sidebar */}
        <div
          className={`
          fixed inset-y-0 left-0 z-[60] transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:block
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <Suspense fallback={null}>
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </Suspense>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen relative w-full lg:ml-0 pb-8 lg:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>

          {/* Floating Cmd-K hint */}
          <div className="pointer-events-none fixed bottom-12 right-4 z-40 hidden lg:block">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[11px] text-slate-500 backdrop-blur-md">
              <Command className="h-3 w-3" />
              <span className="font-mono">K</span>
              <span>for commands</span>
            </div>
          </div>
        </main>
      </div>

      {/* Globally-mounted overlays */}
      <Suspense fallback={null}>
        <ProfileModal />
      </Suspense>
      <CommandPalette />

      {/* Clickable telemetry ticker — mounted globally, fixed to bottom */}
      <LiveTelemetry />
    </>
  );
}
