"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LineChart,
  TrendingUp,
  Activity,
  FlaskConical,
  Scan,
  Lock,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

/**
 * Dashboard section nav — pinned right side on desktop, slides in from bottom
 * on mobile. Uses IntersectionObserver to highlight the active section as
 * the user scrolls. Smooth-scrolls via #id anchors.
 *
 * Section ids (must match what's rendered in the dashboard):
 *   #snapshot, #asset-architecture, #wealth-projection, #market-pulse,
 *   #stress-test, #tax-scanner, #security-vault
 */

interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: Section[] = [
  { id: "snapshot", label: "Snapshot", icon: LayoutDashboard },
  { id: "asset-architecture", label: "Asset Architecture", icon: LineChart },
  { id: "wealth-projection", label: "Wealth Projection", icon: TrendingUp },
  { id: "market-pulse", label: "Market Pulse", icon: Activity },
  { id: "stress-test", label: "Stress Test", icon: FlaskConical },
  { id: "tax-scanner", label: "Tax Scanner", icon: Scan },
  { id: "security-vault", label: "Security Vault", icon: Lock },
];

// Neon accent, per the spec
const NEON = "#00ffa3";

export default function SectionNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Observe which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry closest to the middle of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight / 3) -
              Math.abs(b.boundingClientRect.top - window.innerHeight / 3)
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when the section is in the middle third of the viewport
        rootMargin: "-30% 0px -50% 0px",
        threshold: 0,
      }
    );

    // Retry observation after a tick — some sections mount dynamically
    const attach = () => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };
    attach();
    const retryTimer = setTimeout(attach, 500);

    return () => {
      clearTimeout(retryTimer);
      observer.disconnect();
    };
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
    // Optimistically update the active marker for instant feedback
    setActiveId(id);
  };

  return (
    <>
      {/* ==================== DESKTOP — pinned right rail ==================== */}
      <nav
        className={`fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block`}
        aria-label="Dashboard sections"
      >
        <motion.div
          initial={false}
          animate={{ width: collapsed ? 48 : 200 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-2 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(0,255,163,0.15)]"
        >
          {/* Collapse toggle */}
          <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.15 }}
                  className="pl-2 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                >
                  Sections
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-900 hover:text-slate-200"
              aria-label={collapsed ? "Expand section nav" : "Collapse section nav"}
            >
              <ChevronLeft
                className={`h-3.5 w-3.5 transition-transform ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Links */}
          <ul className="space-y-0.5">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => handleClick(section.id)}
                    className="group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors"
                    style={{
                      color: isActive ? NEON : "#94a3b8",
                      backgroundColor: isActive
                        ? "rgba(0, 255, 163, 0.08)"
                        : "transparent",
                    }}
                    title={collapsed ? section.label : undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {/* Active rail indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="section-active-rail"
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                        style={{
                          backgroundColor: NEON,
                          boxShadow: `0 0 8px ${NEON}`,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    <Icon
                      className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        color: isActive ? NEON : undefined,
                        filter: isActive
                          ? `drop-shadow(0 0 4px ${NEON})`
                          : undefined,
                      }}
                    />

                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          key="label"
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                          className="truncate text-xs font-medium"
                        >
                          {section.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Hover glow for non-active items (collapsed mode) */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${NEON}20`,
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </nav>

      {/* ==================== MOBILE — floating pill + bottom sheet ==================== */}

      {/* FAB toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 text-slate-300 shadow-lg backdrop-blur-md transition-all active:scale-95 lg:hidden"
        style={{
          boxShadow: `0 0 20px -6px ${NEON}40, 0 4px 20px rgba(0,0,0,0.4)`,
        }}
        aria-label="Open section nav"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-[75] rounded-t-2xl border-t border-slate-800 bg-slate-950 p-4 lg:hidden"
              style={{
                boxShadow: `0 -10px 40px -10px ${NEON}20`,
              }}
            >
              {/* Drag handle */}
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700" />

              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Jump to section
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ul className="grid grid-cols-2 gap-2 pb-safe">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeId === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => handleClick(section.id)}
                        className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors"
                        style={{
                          borderColor: isActive ? `${NEON}40` : "#1e293b",
                          backgroundColor: isActive
                            ? "rgba(0, 255, 163, 0.06)"
                            : "#0f172a80",
                          color: isActive ? NEON : "#cbd5e1",
                        }}
                      >
                        <Icon
                          className="h-4 w-4 flex-shrink-0"
                          style={{
                            color: isActive ? NEON : undefined,
                            filter: isActive
                              ? `drop-shadow(0 0 4px ${NEON})`
                              : undefined,
                          }}
                        />
                        <span className="truncate text-xs font-semibold">
                          {section.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
