"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";

interface Line {
  type: "input" | "output" | "system";
  text: string;
}

const GREETING: Line[] = [
  { type: "system", text: "FinSight System Protocol v4.2 — Interactive Documentation" },
  {
    type: "system",
    text: "Type /help to list commands, or try /analyze risk",
  },
];

// Each command returns a list of output lines. Keep them short, factual,
// and link-friendly (mentioning Guide article slugs by name).
const commands: Record<string, string[]> = {
  "/help": [
    "Available commands:",
    "  /analyze risk           — How FinSight scores portfolio risk",
    "  /explain rebalance      — Why rebalancing compounds returns",
    "  /show savings-rate      — How your savings rate is calculated",
    "  /simulate compound      — Inside the compound-interest engine",
    "  /list tracks            — Guide learning tracks",
    "  /clear                  — Clear this terminal",
  ],
  "/analyze risk": [
    "→ Risk analyzer engaged.",
    "Pulls 24h volatility, 90d max drawdown, and sector concentration.",
    "Each holding is scored 0–100; above 65 triggers an amber warning.",
    "See: the-art-of-asset-allocation",
  ],
  "/explain rebalance": [
    "→ Rebalancing = selling what has grown to buy what has fallen.",
    "It forces you to 'buy low, sell high' automatically — no emotion.",
    "Best practice: review allocation annually or when any asset drifts >5%.",
    "See: the-art-of-asset-allocation",
  ],
  "/show savings-rate": [
    "→ savings_rate = (net_cash_flow / monthly_income) × 100",
    "where net_cash_flow = income − sum(expenses).",
    "Reactive: changes instantly when you log a new ledger event.",
    "See: 50-30-20-framework",
  ],
  "/simulate compound": [
    "→ FV = PV × (1 + r)^n",
    "where PV = current balance, r = monthly rate, n = months.",
    "Monthly compounding approximation used to keep the sim responsive.",
    "See: compound-interest",
  ],
  "/list tracks": [
    "→ Foundations   · Beginner    · 2 lessons",
    "→ Investing 101 · Intermediate · 2 lessons",
    "→ Advanced      · Advanced    · 2 lessons",
  ],
};

export default function GuideTerminal() {
  const [lines, setLines] = useState<Line[]>(GREETING);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);

    if (cmd === "/clear") {
      setLines(GREETING);
      return;
    }

    const output = commands[cmd];
    setLines((ls) => [
      ...ls,
      { type: "input", text: cmd },
      ...(output
        ? output.map((o) => ({ type: "output" as const, text: o }))
        : [
            {
              type: "output" as const,
              text: `unknown command: ${cmd}. Try /help`,
            },
          ]),
    ]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-slate-950/80 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-emerald-500/20 bg-slate-950 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <div className="ml-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <TerminalIcon className="h-3 w-3 text-emerald-400" />
          finsight@protocol:~
        </div>
      </div>

      {/* Scroll area */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-[300px] cursor-text overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className={
              l.type === "input"
                ? "text-emerald-300"
                : l.type === "system"
                ? "text-slate-500"
                : "text-slate-300"
            }
          >
            {l.type === "input" ? (
              <span>
                <span className="text-emerald-500">&gt; </span>
                {l.text}
              </span>
            ) : l.type === "system" ? (
              <span>// {l.text}</span>
            ) : (
              <span>{l.text}</span>
            )}
          </motion.div>
        ))}

        {/* Live input line */}
        <div className="flex items-center gap-2 pt-1 text-emerald-300">
          <span className="text-emerald-500">&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(input);
                setInput("");
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (history.length === 0) return;
                const next =
                  historyIndex === null
                    ? history.length - 1
                    : Math.max(0, historyIndex - 1);
                setHistoryIndex(next);
                setInput(history[next]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIndex === null) return;
                const next = historyIndex + 1;
                if (next >= history.length) {
                  setHistoryIndex(null);
                  setInput("");
                } else {
                  setHistoryIndex(next);
                  setInput(history[next]);
                }
              }
            }}
            className="flex-1 border-none bg-transparent text-emerald-300 outline-none caret-emerald-400"
            placeholder="type /help"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Quick-fire buttons */}
      <div className="flex flex-wrap gap-2 border-t border-emerald-500/20 bg-slate-950/60 p-3">
        {["/help", "/analyze risk", "/explain rebalance", "/simulate compound"].map(
          (cmd) => (
            <button
              key={cmd}
              onClick={() => {
                run(cmd);
                inputRef.current?.focus();
              }}
              className="rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-emerald-500/30 hover:text-emerald-300"
            >
              {cmd}
            </button>
          )
        )}
      </div>
    </div>
  );
}
