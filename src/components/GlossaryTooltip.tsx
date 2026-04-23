"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlossaryTooltipProps {
  /** Short title shown at top of the tooltip */
  term: string;
  /** One-line explanation shown in the popover */
  summary: string;
  /** Slug of the article inside /learn for the "Learn more" link */
  articleSlug: string;
}

/**
 * Small "?" button. Hover (desktop) or tap (mobile) to see a short explanation
 * with a deep-link into the Learning Hub. Use it anywhere a financial metric
 * might confuse the user — Volatility, Sharpe Ratio, Asset Allocation, etc.
 */
export default function GlossaryTooltip({
  term,
  summary,
  articleSlug,
}: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        aria-label={`What is ${term}?`}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            role="tooltip"
            className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-left shadow-xl backdrop-blur-md"
          >
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              {term}
            </div>
            <p className="mb-2 text-xs leading-relaxed text-slate-300">
              {summary}
            </p>
            <Link
              href={`/learn/${articleSlug}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Learn more →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
