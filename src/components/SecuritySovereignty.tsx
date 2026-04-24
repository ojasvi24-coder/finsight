"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  Shield,
  Copy,
  Check,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useFinance } from "@/lib/finance";
import {
  encryptAndStore,
  decryptFromStore,
  hasEncryptedData,
  clearEncryptedData,
  createAttestation,
} from "@/lib/crypto";

/**
 * Security Sovereignty panel.
 * - Real Web Crypto AES-GCM encryption of the user's finance blob (passphrase-protected).
 * - Merkle-style "net worth ≥ X" attestation (honest scope: SHA-256 commitment, NOT a ZK-SNARK).
 */
export default function SecuritySovereignty() {
  const { netWorth, update, ...financeState } = useFinance();
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [encLocked, setEncLocked] = useState(false);
  const [threshold, setThreshold] = useState(50000);
  const [attestation, setAttestation] = useState<null | {
    passes: boolean;
    commitment: string;
    timestamp: number;
    threshold: number;
  }>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEncLocked(hasEncryptedData());
  }, []);

  const encrypt = async () => {
    if (!passphrase) {
      setStatus("Enter a passphrase first");
      return;
    }
    setStatus("Encrypting...");
    try {
      // Serialize a snapshot of finance state to encrypt
      const snapshot = JSON.stringify({
        monthlyIncome: financeState.monthlyIncome,
        initialInvestment: financeState.initialInvestment,
        annualReturn: financeState.annualReturn,
        transactions: financeState.transactions,
        positions: financeState.positions,
        sectors: financeState.sectors,
      });
      await encryptAndStore(snapshot, passphrase);
      update({ encryptionEnabled: true });
      setEncLocked(true);
      setStatus("✓ Encrypted locally with AES-GCM-256");
      setPassphrase("");
    } catch (e) {
      setStatus("Encryption failed: " + (e as Error).message);
    }
  };

  const decrypt = async () => {
    if (!passphrase) {
      setStatus("Enter your passphrase");
      return;
    }
    setStatus("Decrypting...");
    const plaintext = await decryptFromStore(passphrase);
    if (plaintext === null) {
      setStatus("✗ Wrong passphrase");
      return;
    }
    try {
      const parsed = JSON.parse(plaintext);
      update({ ...parsed, encryptionEnabled: false });
      clearEncryptedData();
      setEncLocked(false);
      setStatus("✓ Decrypted and restored to local state");
      setPassphrase("");
    } catch {
      setStatus("✗ Decrypted content was not valid");
    }
  };

  const clearVault = () => {
    if (
      confirm(
        "This deletes the encrypted vault. If you don't have your passphrase, the data inside is gone. Continue?"
      )
    ) {
      clearEncryptedData();
      setEncLocked(false);
      setStatus("Vault cleared");
    }
  };

  const generateAttestation = async () => {
    const att = await createAttestation(netWorth, threshold);
    setAttestation(att);
  };

  const copyCommitment = () => {
    if (!attestation) return;
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          claim: `net_worth >= ${threshold}`,
          passes: attestation.passes,
          commitment: attestation.commitment,
          timestamp: attestation.timestamp,
        },
        null,
        2
      )
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* === LOCAL ENCRYPTION === */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          {encLocked ? (
            <Lock className="h-4 w-4 text-emerald-400" />
          ) : (
            <Unlock className="h-4 w-4 text-slate-500" />
          )}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Local Vault · AES-GCM-256
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          Encrypt a snapshot of your finance data with a passphrase. Derived
          key uses PBKDF2 (100k iterations, SHA-256). The key never leaves
          your browser — FinSight cannot read your vault.
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder={encLocked ? "Enter passphrase to decrypt" : "Choose a passphrase"}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2 font-mono text-xs text-white outline-none transition-colors focus:border-emerald-500/50"
          />
          {encLocked ? (
            <button
              onClick={decrypt}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <Unlock className="h-3.5 w-3.5" />
              Unlock
            </button>
          ) : (
            <button
              onClick={encrypt}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <Lock className="h-3.5 w-3.5" />
              Encrypt
            </button>
          )}
        </div>

        {status && (
          <p className="font-mono text-[11px] text-slate-300">{status}</p>
        )}

        {encLocked && (
          <button
            onClick={clearVault}
            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300"
          >
            Clear encrypted vault
          </button>
        )}

        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-2.5 text-[11px] leading-relaxed text-slate-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0 text-amber-400" />
          <span>
            Lose your passphrase and the vault is permanently unrecoverable —
            that's the whole point of zero-knowledge local encryption.
          </span>
        </div>
      </section>

      {/* === NET WORTH ATTESTATION === */}
      <section className="space-y-3 border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Net Worth Attestation
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          Prove you meet a net-worth threshold without revealing your actual
          balance — useful for loan / rental applications. Generates a
          time-stamped SHA-256 commitment you can share.
        </p>

        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Threshold to attest
            </label>
            <input
              type="number"
              value={threshold}
              step={1000}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 font-mono text-xs text-white outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={generateAttestation}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            <Shield className="h-3.5 w-3.5" />
            Generate
          </button>
        </div>

        {attestation && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-2 rounded-xl border p-3 ${
              attestation.passes
                ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                : "border-rose-500/30 bg-rose-500/[0.06]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  attestation.passes ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                Claim: net worth ≥ ${threshold.toLocaleString()}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  attestation.passes
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {attestation.passes ? "PASSES" : "DOES NOT PASS"}
              </span>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Commitment hash
              </div>
              <code className="mt-1 block max-w-full break-all rounded border border-slate-800 bg-slate-950/60 p-2 font-mono text-[10px] text-slate-300">
                {attestation.commitment}
              </code>
            </div>
            <button
              onClick={copyCommitment}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy attestation
                </>
              )}
            </button>
          </motion.div>
        )}

        <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-[11px] leading-relaxed text-slate-400">
          <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
          <span>
            <strong className="text-slate-300">Honest scope:</strong> this is a
            hash-based commitment, not a true zero-knowledge proof. A real
            ZK-SNARK circuit would let verifiers confirm the claim without any
            trust in FinSight. We chose a simpler primitive to keep the
            implementation honest and auditable.
          </span>
        </div>
      </section>
    </div>
  );
}
