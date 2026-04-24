"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, ExternalLink, Check, AlertCircle } from "lucide-react";

interface ChainResult {
  chain: string;
  address: string;
  balance: string;
  balanceUsd?: number;
  explorerUrl: string;
}

/**
 * Blockchain Indexing — real ETH balance lookup via public Cloudflare RPC.
 * Solana is stubbed with a clear "partial support" notice because public Solana
 * RPCs that accept no-auth cross-origin requests are unreliable.
 */
export default function BlockchainIndexer() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChainResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const addr = address.trim();
    const isEthereum = /^0x[a-fA-F0-9]{40}$/.test(addr);

    if (!isEthereum) {
      setError(
        "Only Ethereum addresses are supported right now (0x…). Solana indexing requires a server-side RPC proxy."
      );
      setLoading(false);
      return;
    }

    try {
      // Real Ethereum JSON-RPC via Cloudflare's public endpoint
      const res = await fetch("https://cloudflare-eth.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [addr, "latest"],
        }),
      });
      if (!res.ok) throw new Error(`RPC returned ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      // Convert hex Wei to ETH
      const wei = BigInt(data.result);
      const eth = Number(wei) / 1e18;

      // Get a rough USD price from CoinGecko
      let ethUsd: number | undefined;
      try {
        const priceRes = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
          { cache: "no-store" }
        );
        const priceData = await priceRes.json();
        ethUsd = priceData?.ethereum?.usd;
      } catch {
        /* optional */
      }

      setResult({
        chain: "Ethereum",
        address: addr,
        balance: `${eth.toFixed(6)} ETH`,
        balanceUsd: ethUsd ? eth * ethUsd : undefined,
        explorerUrl: `https://etherscan.io/address/${addr}`,
      });
    } catch (e) {
      setError((e as Error).message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            On-Chain Balance Lookup
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          ETH · live RPC
        </span>
      </div>

      <div className="flex gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
          placeholder="0x… Ethereum address"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 font-mono text-xs text-white outline-none transition-colors focus:border-emerald-500/50"
        />
        <button
          onClick={lookup}
          disabled={loading || !address.trim()}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:bg-slate-700"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Lookup"
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/[0.08] p-3 text-xs">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
          <span className="text-slate-300">{error}</span>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            <Check className="h-3.5 w-3.5" />
            {result.chain} balance
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-white">
            {result.balance}
          </div>
          {result.balanceUsd && (
            <div className="mt-0.5 font-mono text-xs text-emerald-400">
              ≈ ${result.balanceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          )}
          <div className="mt-2 truncate font-mono text-[10px] text-slate-500">
            {result.address}
          </div>
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
          >
            View on Etherscan
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      )}

      <p className="text-[10px] leading-relaxed text-slate-500">
        Live lookup via cloudflare-eth.com public RPC — no API key, no
        tracking. Full DeFi yield and NFT indexing would require a dedicated
        indexer (The Graph, Covalent) which isn't wired up in this build.
      </p>
    </div>
  );
}
