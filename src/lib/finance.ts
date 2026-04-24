"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Single source of truth for the user's financial data.
 * Shared by Home ticker, Dashboard, Risk Map — one localStorage key.
 *
 * Design: reads from localStorage on mount, writes back on every change.
 * Other tabs/pages stay in sync via a custom 'finsight-finance-update' event
 * plus the native 'storage' event (which fires cross-tab but not same-tab).
 */

const STORAGE_KEY = "finsight.finance.v1";
const UPDATE_EVENT = "finsight-finance-update";

export interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "expense";
}

export interface SectorAllocation {
  name: string;
  weight: number; // % of portfolio
  risk: number; // 0-100
  change: number; // 24h % change
}

export interface Position {
  id: string;
  ticker: string;
  shares: number;
  costBasis: number; // per share
  currentPrice: number;
}

export interface FinanceState {
  monthlyIncome: number;
  initialInvestment: number;
  annualReturn: number;
  projectionYears: number;
  transactions: Transaction[];
  sectors: SectorAllocation[];
  positions: Position[];
  emergencyFundTarget: number;
  emergencyFundCurrent: number;
  // Local-first / security settings
  webhookUrl: string;
  encryptionEnabled: boolean;
}

const DEFAULT_STATE: FinanceState = {
  monthlyIncome: 6000,
  initialInvestment: 50000,
  annualReturn: 8,
  projectionYears: 30,
  transactions: [
    { id: "2", name: "Rent Payment", category: "Housing", amount: 1500, date: "2024-06-10", type: "expense" },
    { id: "3", name: "Grocery Store", category: "Food", amount: 185, date: "2024-06-12", type: "expense" },
    { id: "4", name: "Netflix Subscription", category: "Entertainment", amount: 16, date: "2024-06-05", type: "expense" },
    { id: "6", name: "Electricity Bill", category: "Utilities", amount: 120, date: "2024-06-08", type: "expense" },
    { id: "7", name: "Gas", category: "Transportation", amount: 85, date: "2024-06-03", type: "expense" },
    { id: "8", name: "Restaurant", category: "Food", amount: 65, date: "2024-06-18", type: "expense" },
  ],
  sectors: [
    { name: "Tech", weight: 28, risk: 72, change: -1.2 },
    { name: "Finance", weight: 18, risk: 45, change: 0.3 },
    { name: "Healthcare", weight: 14, risk: 32, change: 0.8 },
    { name: "Energy", weight: 10, risk: 68, change: -2.1 },
    { name: "Consumer", weight: 12, risk: 28, change: 0.5 },
    { name: "Industrials", weight: 8, risk: 38, change: 0.1 },
    { name: "Real Estate", weight: 6, risk: 52, change: -0.4 },
    { name: "Bonds", weight: 4, risk: 12, change: 0.2 },
  ],
  positions: [
    { id: "p1", ticker: "AAPL", shares: 50, costBasis: 140, currentPrice: 178 },
    { id: "p2", ticker: "VTI", shares: 30, costBasis: 220, currentPrice: 245 },
    { id: "p3", ticker: "NVDA", shares: 10, costBasis: 480, currentPrice: 420 },
  ],
  emergencyFundTarget: 18000,
  emergencyFundCurrent: 14800,
  webhookUrl: "",
  encryptionEnabled: false,
};

function read(): FinanceState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Shallow-merge with defaults so new fields don't break existing stored state
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function write(state: FinanceState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  } catch {
    /* ignore */
  }
}

export function useFinance() {
  const [state, setState] = useState<FinanceState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setState(read());
    setIsLoaded(true);

    const sync = () => setState(read());
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<FinanceState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setState((prev) => {
      const next = {
        ...prev,
        transactions: [
          ...prev.transactions,
          { ...tx, id: Date.now().toString() },
        ],
      };
      write(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      };
      write(next);
      return next;
    });
  }, []);

  const updateSector = useCallback(
    (name: string, patch: Partial<SectorAllocation>) => {
      setState((prev) => {
        const next = {
          ...prev,
          sectors: prev.sectors.map((s) =>
            s.name === name ? { ...s, ...patch } : s
          ),
        };
        write(next);
        return next;
      });
    },
    []
  );

  // ---------- DERIVED VALUES ----------
  const totalExpenses = state.transactions.reduce((s, t) => s + t.amount, 0);
  const netCashFlow = state.monthlyIncome - totalExpenses;
  const currentBalance = state.initialInvestment + netCashFlow;
  const savingsRate =
    state.monthlyIncome === 0 ? 0 : (netCashFlow / state.monthlyIncome) * 100;
  const spendingPercent =
    state.monthlyIncome === 0 ? 0 : (totalExpenses / state.monthlyIncome) * 100;

  // Portfolio value from positions (for the Tax-Loss and Blockchain sections)
  const portfolioValue = state.positions.reduce(
    (s, p) => s + p.shares * p.currentPrice,
    0
  );
  const portfolioCostBasis = state.positions.reduce(
    (s, p) => s + p.shares * p.costBasis,
    0
  );
  const portfolioUnrealizedPnL = portfolioValue - portfolioCostBasis;

  // Total net worth = liquid balance + portfolio + emergency fund
  const netWorth =
    currentBalance + portfolioValue + state.emergencyFundCurrent;

  return {
    ...state,
    isLoaded,
    update,
    addTransaction,
    deleteTransaction,
    updateSector,
    // derived
    totalExpenses,
    netCashFlow,
    currentBalance,
    savingsRate,
    spendingPercent,
    portfolioValue,
    portfolioCostBasis,
    portfolioUnrealizedPnL,
    netWorth,
  };
}

/** Non-hook read (for one-off reads in utilities) */
export function readFinance(): FinanceState {
  return read();
}