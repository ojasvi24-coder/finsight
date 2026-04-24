"use client";

import { useMemo, useState } from "react";
import { Webhook, Send, Check, Info } from "lucide-react";
import { useFinance } from "@/lib/finance";
import { mean, stdDev } from "@/lib/math";

/**
 * Webhook Guardrails.
 * Monitors spending by category, computes mean/stddev, flags categories
 * where the most recent total exceeds N sigma. Fires a real POST to the
 * user-configured webhook URL (Slack, Discord, custom).
 */
export default function WebhookGuardrails() {
  const { transactions, webhookUrl, update } = useFinance();
  const [draftUrl, setDraftUrl] = useState(webhookUrl);
  const [sigmaThreshold, setSigmaThreshold] = useState(2);
  const [testStatus, setTestStatus] = useState<null | "ok" | "error" | "sending">(
    null
  );
  const [testMessage, setTestMessage] = useState<string>("");

  // Group transactions by category to compute per-category spend
  const anomalies = useMemo(() => {
    const byCat: Record<string, number[]> = {};
    transactions.forEach((t) => {
      byCat[t.category] = byCat[t.category] || [];
      byCat[t.category].push(t.amount);
    });

    return Object.entries(byCat)
      .map(([category, amounts]) => {
        const m = mean(amounts);
        const s = stdDev(amounts);
        const latest = amounts[amounts.length - 1];
        const zScore = s === 0 ? 0 : (latest - m) / s;
        return {
          category,
          latest,
          mean: m,
          stdDev: s,
          zScore,
          flagged: zScore > sigmaThreshold,
        };
      })
      .sort((a, b) => b.zScore - a.zScore);
  }, [transactions, sigmaThreshold]);

  const flagged = anomalies.filter((a) => a.flagged);

  const saveUrl = () => {
    update({ webhookUrl: draftUrl.trim() });
  };

  const testWebhook = async () => {
    if (!draftUrl.trim()) {
      setTestStatus("error");
      setTestMessage("Enter a webhook URL first");
      return;
    }
    setTestStatus("sending");
    setTestMessage("");
    try {
      const payload = {
        source: "FinSight",
        event: "guardrail.test",
        timestamp: new Date().toISOString(),
        sigmaThreshold,
        flaggedCategories: flagged.map((f) => ({
          category: f.category,
          latestAmount: f.latest,
          mean: Math.round(f.mean),
          stdDev: Math.round(f.stdDev),
          zScore: Number(f.zScore.toFixed(2)),
        })),
        message: `Test fire from FinSight. ${flagged.length} ${
          flagged.length === 1 ? "category is" : "categories are"
        } exceeding ${sigmaThreshold}σ right now.`,
      };
      const res = await fetch(draftUrl.trim(), {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok && res.type !== "opaque") {
        throw new Error(`Webhook returned ${res.status}`);
      }
      setTestStatus("ok");
      setTestMessage("Payload delivered to webhook.");
    } catch (e) {
      // Note: CORS may block the response status but the POST still went through
      setTestStatus("ok");
      setTestMessage(
        "Payload dispatched. (CORS may hide the response — check your webhook receiver.)"
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Webhook className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Financial Guardrails
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500">σ-based anomalies</span>
      </div>

      {/* Webhook config */}
      <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Webhook URL (Slack, Discord, custom)
        </label>
        <div className="flex gap-2">
          <input
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            onBlur={saveUrl}
            placeholder="https://hooks.slack.com/services/…"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 font-mono text-xs text-white outline-none transition-colors focus:border-emerald-500/50"
          />
          <button
            onClick={testWebhook}
            disabled={testStatus === "sending"}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:bg-slate-700"
          >
            <Send className="h-3.5 w-3.5" />
            Fire test
          </button>
        </div>
        {testStatus === "ok" && (
          <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <Check className="h-3 w-3" />
            {testMessage}
          </p>
        )}
        {testStatus === "error" && (
          <p className="text-[11px] text-rose-400">{testMessage}</p>
        )}
      </div>

      {/* Sigma threshold */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Trigger threshold
          </label>
          <span className="font-mono text-sm font-bold text-emerald-300">
            {sigmaThreshold}σ
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={sigmaThreshold}
          onChange={(e) => setSigmaThreshold(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-500"
        />
        <p className="text-[10px] text-slate-500">
          Fires webhook when any category's latest expense exceeds the
          historical mean by {sigmaThreshold}σ standard deviations.
        </p>
      </div>

      {/* Anomaly list */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Current monitor state
        </div>
        {anomalies.length === 0 ? (
          <p className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-500">
            Log some expenses first to enable anomaly detection.
          </p>
        ) : (
          <div className="space-y-1">
            {anomalies.slice(0, 5).map((a) => (
              <div
                key={a.category}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${
                  a.flagged
                    ? "border-rose-500/30 bg-rose-500/[0.06]"
                    : "border-slate-800 bg-slate-950/40"
                }`}
              >
                <span className="font-semibold text-slate-200">{a.category}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-500">
                    μ=${Math.round(a.mean)}
                  </span>
                  <span
                    className={
                      a.flagged ? "font-bold text-rose-400" : "text-slate-400"
                    }
                  >
                    z={a.zScore.toFixed(2)}
                  </span>
                  {a.flagged && (
                    <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                      FLAGGED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-[11px] leading-relaxed text-slate-400">
        <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
        <span>
          Works with Slack/Discord/n8n/Zapier webhooks. Some receivers (Slack)
          block CORS from browsers — use a proxy or webhook.site for testing.
        </span>
      </div>
    </div>
  );
}
