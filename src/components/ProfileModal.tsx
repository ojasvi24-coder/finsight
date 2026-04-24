"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, ShieldCheck, LogIn } from "lucide-react";
import { useUser } from "@/lib/user";

/**
 * Global profile / settings popup.
 *
 * Opens when the URL has ?profile=open.
 * Any page, any component, just call router.push('/whatever?profile=open')
 * or append the query string to any link.
 *
 * Closing scrubs the query param so a refresh doesn't reopen.
 */
export default function ProfileModal() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { name, email, hasProfile, updateUser } = useUser();

  const [open, setOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");

  // Sync drafts when profile loads from localStorage
  useEffect(() => {
    setNameDraft(name);
  }, [name]);
  useEffect(() => {
    setEmailDraft(email);
  }, [email]);

  // Open when the URL asks us to
  useEffect(() => {
    if (searchParams?.get("profile") === "open") setOpen(true);
  }, [searchParams]);

  const close = () => {
    setOpen(false);
    // Strip the query param without triggering a full navigation
    const current = new URLSearchParams(
      Array.from(searchParams?.entries() ?? [])
    );
    current.delete("profile");
    const qs = current.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const save = () => {
    updateUser({
      name: nameDraft.trim(),
      email: emailDraft.trim(),
    });
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#1E1E2E] shadow-2xl"
          >
            {/* Header */}
            <div className="relative border-b border-slate-800 bg-gradient-to-br from-emerald-500/[0.08] to-transparent px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                    {hasProfile ? "Operator Profile" : "Initialize Operator ID"}
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-white">
                    {hasProfile ? "Your profile" : "Welcome aboard"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {hasProfile
                      ? "Update the details FinSight uses to personalize your dashboard."
                      : "Tell us who you are. Takes 10 seconds."}
                  </p>
                </div>
                <button
                  onClick={close}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <User className="h-3 w-3" />
                  Full name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50 focus:shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <Mail className="h-3 w-3" />
                  Email
                  <span className="ml-1 font-normal normal-case tracking-normal text-slate-600">
                    (optional)
                  </span>
                </label>
                <input
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50 focus:shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]"
                />
              </div>

              {/* Security reassurance */}
              <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                <p className="text-xs leading-relaxed text-slate-400">
                  Stored locally on this device only. FinSight never transmits
                  this information and never sees your account credentials.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-950/30 px-6 py-4">
              <button
                onClick={close}
                className="text-sm font-semibold text-slate-400 transition-colors hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={!nameDraft.trim()}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-6px_rgba(16,185,129,0.7)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_28px_-4px_rgba(16,185,129,0.9)] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
              >
                <LogIn className="h-4 w-4" />
                {hasProfile ? "Save changes" : "Initialize"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
