"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useUser } from "@/lib/user";

export default function ProfileModal() {
  const pathname     = usePathname();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { name, email, hasProfile, updateUser } = useUser();

  const [open, setOpen]           = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [saving, setSaving]       = useState(false);
  // remember whether this is a brand-new profile so we can redirect after
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => { setNameDraft(name); },  [name]);
  useEffect(() => { setEmailDraft(email); }, [email]);

  useEffect(() => {
    if (searchParams?.get("profile") === "open") {
      setIsNewProfile(!hasProfile);
      setOpen(true);
    }
  }, [searchParams, hasProfile]);

  const stripParam = () => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    current.delete("profile");
    const qs = current.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const close = () => {
    setOpen(false);
    router.replace(stripParam(), { scroll: false });
  };

  const save = () => {
    const trimmedName = nameDraft.trim();
    if (!trimmedName) return;
    setSaving(true);
    updateUser({ name: trimmedName, email: emailDraft.trim() });

    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      // First-time setup → land on dashboard so greeting is instant
      if (isNewProfile) {
        router.push("/dashboard");
      } else {
        router.replace(stripParam(), { scroll: false });
        // Force a soft refresh so the greeting updates immediately
        router.refresh();
      }
    }, 350);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-slate-800">
              <button onClick={close}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="h-4 w-4" />
              </button>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
                {hasProfile ? "Your Profile" : "Welcome to FinSight"}
              </p>
              <h2 className="text-xl font-black text-white">
                {hasProfile ? "Edit profile" : "Let's get started"}
              </h2>
              {!hasProfile && (
                <p className="text-xs text-slate-400 mt-1">
                  Takes 10 seconds. We'll personalise your dashboard.
                </p>
              )}
            </div>

            {/* Fields */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <User className="h-3 w-3" /> Your name
                </label>
                <input
                  autoFocus type="text"
                  value={nameDraft}
                  onChange={e => setNameDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && save()}
                  placeholder="e.g. Alex"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50 placeholder-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <Mail className="h-3 w-3" /> Email
                  <span className="ml-1 font-normal normal-case tracking-normal text-slate-600">(optional)</span>
                </label>
                <input
                  type="email"
                  value={emailDraft}
                  onChange={e => setEmailDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && save()}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-emerald-500/50 placeholder-slate-600"
                />
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                <p className="text-xs leading-relaxed text-slate-500">
                  Stored locally on this device only. FinSight never sends your data anywhere.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 pb-6">
              <button onClick={close}
                className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors px-3 py-2">
                Cancel
              </button>
              <motion.button
                onClick={save}
                disabled={!nameDraft.trim() || saving}
                whileTap={{ scale: 0.97 }}
                className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_-6px_rgba(16,185,129,0.6)] transition-all hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                    Saving…
                  </span>
                ) : (
                  <>
                    {hasProfile ? "Save changes" : "Go to dashboard"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
