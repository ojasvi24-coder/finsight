"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  BarChart3,
  BookOpen,
  Settings,
  Plus,
  Target,
  Command,
  Terminal,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
}

/**
 * Cmd/Ctrl-K command palette. Mounted globally in ClientLayout.
 * Open: Cmd+K (Mac) / Ctrl+K (Windows). Navigate: arrows + enter. Close: Esc.
 */
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: "home",
      label: "Go to Home",
      hint: "G then H",
      icon: Home,
      action: () => router.push("/"),
      keywords: ["dashboard", "landing"],
    },
    {
      id: "dashboard",
      label: "Open Dashboard",
      hint: "G then D",
      icon: BarChart3,
      action: () => router.push("/dashboard"),
      keywords: ["portfolio", "finance"],
    },
    {
      id: "guide",
      label: "Open System Protocol",
      hint: "G then L",
      icon: BookOpen,
      action: () => router.push("/learn"),
      keywords: ["learn", "guide", "protocol", "help"],
    },
    {
      id: "settings",
      label: "Open Profile / Settings",
      hint: "G then S",
      icon: Settings,
      action: () => router.push("/dashboard?profile=open"),
      keywords: ["account", "name"],
    },
    {
      id: "add",
      label: "Add Transaction",
      hint: "N",
      icon: Plus,
      action: () => router.push("/dashboard#add-transaction"),
      keywords: ["expense", "new"],
    },
    {
      id: "scenario",
      label: "Run What-If Scenario",
      hint: "W",
      icon: Target,
      action: () => router.push("/dashboard#scenario"),
      keywords: ["simulate", "projection"],
    },
    {
      id: "terminal",
      label: "Open Guide Terminal",
      hint: "T",
      icon: Terminal,
      action: () => router.push("/learn#terminal"),
      keywords: ["console", "query"],
    },
  ];

  const filtered = query
    ? items.filter((i) => {
        const haystack = (
          i.label +
          " " +
          (i.keywords || []).join(" ")
        ).toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : items;

  // Global keybindings
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K toggles
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "?" shows palette (when not typing)
      if (
        e.key === "?" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(filtered.length - 1, s + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(0, s - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const pick = filtered[selected];
        if (pick) {
          pick.action();
          setOpen(false);
          setQuery("");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selected]);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-700 bg-[#1E1E2E] shadow-2xl"
          >
            {/* Search */}
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
              <Search className="h-4 w-4 flex-shrink-0 text-slate-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 border-none bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">
                  No commands match that search.
                </p>
              ) : (
                filtered.map((item, i) => {
                  const Icon = item.icon;
                  const isSelected = i === selected;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "text-slate-300 hover:bg-slate-900/50"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isSelected ? "text-emerald-400" : "text-slate-500"
                        }`}
                      />
                      <span className="flex-1 font-medium">{item.label}</span>
                      <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                        {item.hint}
                      </kbd>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-4 py-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono">
                    ↵
                  </kbd>
                  select
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="h-3 w-3" />
                <span className="font-mono">K</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
