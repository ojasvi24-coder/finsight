"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Check, AlertCircle, X, Info } from "lucide-react";
import { useFinance } from "@/lib/finance";

interface ParsedRow {
  date: string;
  description: string;
  amount: number;
  category: string;
}

/**
 * Upload a bank statement CSV and extract transactions.
 *
 * Honest scope: this parses CSV (the most common export format) reliably.
 * True OCR of scanned PDFs would need Tesseract.js (~3 MB) or a hosted OCR
 * service. We parse text files and flag PDF/image as unsupported rather
 * than pretend.
 */
export default function OcrUpload() {
  const { transactions, update } = useFinance();
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [filename, setFilename] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categorize = (desc: string): string => {
    const d = desc.toLowerCase();
    if (/rent|mortgage|housing|apartment/i.test(d)) return "Housing";
    if (/whole ?foods|grocery|safeway|trader joe|costco|walmart/i.test(d))
      return "Food";
    if (/restaurant|cafe|bar|grill|pizza|uber ?eats|doordash/i.test(d))
      return "Food";
    if (/shell|chevron|gas|uber|lyft|parking/i.test(d)) return "Transportation";
    if (/netflix|spotify|hulu|disney|entertainment/i.test(d))
      return "Entertainment";
    if (/pge|electric|water|internet|comcast|utility/i.test(d))
      return "Utilities";
    if (/pharmacy|doctor|dental|health|hospital/i.test(d)) return "Healthcare";
    return "Other";
  };

  const parseCsv = (text: string): ParsedRow[] => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return [];

    // Detect header row
    const header = lines[0].toLowerCase();
    const hasHeader = /date|description|amount/.test(header);
    const dataLines = hasHeader ? lines.slice(1) : lines;

    // Very simple CSV splitter — handles "quoted,fields" reasonably
    const split = (line: string): string[] => {
      const out: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') inQuotes = !inQuotes;
        else if (c === "," && !inQuotes) {
          out.push(cur);
          cur = "";
        } else cur += c;
      }
      out.push(cur);
      return out.map((s) => s.trim().replace(/^"|"$/g, ""));
    };

    const rows: ParsedRow[] = [];
    for (const line of dataLines) {
      const cells = split(line);
      if (cells.length < 3) continue;

      // Heuristic column detection: find the date cell, description cell, amount cell
      let date = "";
      let description = "";
      let amount = 0;

      for (const cell of cells) {
        // Date-like?
        if (!date && /^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/.test(cell)) {
          date = cell;
          continue;
        }
        // Amount-like? (allow $, commas, parentheses for negatives)
        const num = Number(cell.replace(/[\$,()]/g, "").replace(/^-?/, "-"));
        if (!isNaN(num) && cell.match(/\d/) && Math.abs(num) > 0) {
          if (amount === 0) amount = Math.abs(num);
          continue;
        }
        // Description = longest non-date-non-number cell
        if (cell.length > description.length) description = cell;
      }

      if (date && description && amount > 0) {
        rows.push({
          date,
          description,
          amount,
          category: categorize(description),
        });
      }
    }

    return rows;
  };

  const onFile = async (file: File) => {
    setFilename(file.name);
    setStatus(null);

    const lowered = file.name.toLowerCase();
    if (lowered.endsWith(".pdf") || /\.(png|jpg|jpeg)$/.test(lowered)) {
      setStatus(
        "PDFs and images aren't supported in this build. Export your statement as CSV from your bank."
      );
      return;
    }
    if (!lowered.endsWith(".csv") && !lowered.endsWith(".txt")) {
      setStatus("Upload a .csv file.");
      return;
    }

    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) {
      setStatus(
        "Couldn't recognize any transactions. Expected columns: date, description, amount."
      );
      return;
    }
    setParsed(rows);
    setStatus(`Parsed ${rows.length} transaction${rows.length === 1 ? "" : "s"}.`);
  };

  const importAll = () => {
    const newTxns = parsed.map((p, i) => ({
      id: `${Date.now()}-${i}`,
      name: p.description,
      category: p.category,
      amount: p.amount,
      date: p.date,
      type: "expense" as const,
    }));
    update({ transactions: [...transactions, ...newTxns] });
    setStatus(`✓ Imported ${parsed.length} transactions into your ledger.`);
    setParsed([]);
    setFilename("");
  };

  const removeRow = (i: number) => {
    setParsed(parsed.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Dark Data Extractor
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500">CSV parser</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 py-8 text-sm text-slate-400 transition-colors hover:border-emerald-500/30 hover:bg-slate-950/60 hover:text-emerald-300"
      >
        <Upload className="h-4 w-4" />
        <span>
          {filename ? (
            <span className="font-mono text-xs text-white">{filename}</span>
          ) : (
            "Drop a bank CSV here or click to browse"
          )}
        </span>
      </button>

      {status && (
        <p className="rounded-lg border border-slate-800 bg-slate-950/40 p-2 text-xs text-slate-300">
          {status}
        </p>
      )}

      {parsed.length > 0 && (
        <>
          <div className="max-h-[300px] space-y-1 overflow-y-auto">
            {parsed.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2 text-xs"
              >
                <span className="w-20 truncate font-mono text-slate-400">
                  {r.date}
                </span>
                <span className="flex-1 truncate text-white">
                  {r.description}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                  {r.category}
                </span>
                <span className="w-20 text-right font-mono text-rose-400">
                  -${r.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => removeRow(i)}
                  className="rounded p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={importAll}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            <Check className="h-4 w-4" />
            Import {parsed.length} transaction{parsed.length === 1 ? "" : "s"}
          </button>
        </>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-[11px] leading-relaxed text-slate-400">
        <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
        <span>
          <strong className="text-slate-300">Honest scope:</strong> parses
          standard bank CSV exports (Chase, Capital One, Amex, most credit
          unions). True OCR of scanned PDFs / photos would require
          Tesseract.js bundled or a hosted OCR service — not included to keep
          the bundle light.
        </span>
      </div>
    </div>
  );
}
