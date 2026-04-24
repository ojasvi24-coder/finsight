"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface KnowledgeCheckProps {
  title?: string;
  questions: QuizQuestion[];
}

/**
 * Drop-in quiz component. Pass 3 questions, it tracks state, grades,
 * and lets the user retry. No persistence — by design, learning quizzes
 * should feel fresh each time.
 */
export default function KnowledgeCheck({
  title = "Knowledge Check",
  questions,
}: KnowledgeCheckProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  const finished = answers.length === questions.length;
  const correctCount = answers.reduce(
    (acc, a, i) => (a === questions[i].correctIndex ? acc + 1 : acc),
    0
  );

  const submit = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const next = () => {
    if (selected === null) return;
    setAnswers((a) => [...a, selected]);
    setSelected(null);
    setRevealed(false);
    setCurrent((c) => c + 1);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setRevealed(false);
  };

  if (finished) {
    const perfect = correctCount === questions.length;
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-slate-900/60 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              perfect
                ? "border border-amber-500/30 bg-amber-500/15"
                : "border border-emerald-500/20 bg-emerald-500/15"
            }`}
          >
            <Trophy
              className={`h-5 w-5 ${
                perfect ? "text-amber-400" : "text-emerald-400"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {perfect ? "Perfect score!" : "Nice work!"}
            </h3>
            <p className="text-sm text-slate-300">
              You got {correctCount} of {questions.length} correct.
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-2">
          {questions.map((q, i) => {
            const ok = answers[i] === q.correctIndex;
            return (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-lg border p-2.5 text-xs ${
                  ok
                    ? "border-emerald-500/20 bg-emerald-500/5 text-slate-300"
                    : "border-rose-500/20 bg-rose-500/5 text-slate-300"
                }`}
              >
                {ok ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
                )}
                <span className="leading-relaxed">{q.question}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-900"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = revealed && selected === q.correctIndex;
  const isWrong = revealed && selected !== null && selected !== q.correctIndex;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            {title}
          </div>
          <h3 className="mt-1 text-lg font-bold text-white">{q.question}</h3>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {current + 1} / {questions.length}
        </div>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const active = selected === i;
          const showCorrect = revealed && i === q.correctIndex;
          const showWrong = revealed && active && i !== q.correctIndex;

          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                showCorrect
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : showWrong
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : active
                  ? "border-emerald-500/30 bg-emerald-500/5 text-white"
                  : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
            >
              <span>{opt}</span>
              {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {showWrong && <XCircle className="h-4 w-4 text-rose-400" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && q.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 overflow-hidden rounded-lg border p-3 text-xs leading-relaxed ${
              isCorrect
                ? "border-emerald-500/20 bg-emerald-500/5 text-slate-300"
                : "border-slate-800 bg-slate-950/40 text-slate-400"
            }`}
          >
            <span className="font-semibold text-slate-200">
              {isCorrect ? "Correct. " : "Not quite. "}
            </span>
            {q.explanation}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex justify-end">
        {!revealed ? (
          <button
            onClick={submit}
            disabled={selected === null}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500"
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={next}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            {current + 1 === questions.length ? "See results" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}

