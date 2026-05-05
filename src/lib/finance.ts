"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "finsight.finance.v2";
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
  weight: number;
  risk: number;
  change: number;
}

export interface Position {
  id: string;
  ticker: string;
  shares: number;
  costBasis: number;
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
  webhookUrl: string;
  encryptionEnabled: boolean;
}

// Clean defaults — no pre-filled mock data to confuse users
const DEFAULT_STATE: FinanceState = {
  monthlyIncome: 0,
  initialInvestment: 0,
  annualReturn: 8,
  projectionYears: 30,
  transactions: [],
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
  positions: [],
  emergencyFundTarget: 0,
  emergencyFundCurrent: 0,
  webhookUrl: "",
  encryptionEnabled: false,
};

function read(): FinanceState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function write(state: FinanceState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  } catch { /* ignore */ }
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
    setState(prev => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    setState(prev => {
      const next = {
        ...prev,
        transactions: [...prev.transactions, { ...tx, id: Date.now().toString() }],
      };
      write(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setState(prev => {
      const next = { ...prev, transactions: prev.transactions.filter(t => t.id !== id) };
      write(next);
      return next;
    });
  }, []);

  const updateSector = useCallback((name: string, patch: Partial<SectorAllocation>) => {
    setState(prev => {
      const next = {
        ...prev,
        sectors: prev.sectors.map(s => s.name === name ? { ...s, ...patch } : s),
      };
      write(next);
      return next;
    });
  }, []);

  // Derived values
  const totalExpenses = state.transactions.reduce((s, t) => s + t.amount, 0);
  const netCashFlow = state.monthlyIncome - totalExpenses;
  const currentBalance = state.initialInvestment + netCashFlow;
  const savingsRate = state.monthlyIncome === 0 ? 0 : (netCashFlow / state.monthlyIncome) * 100;
  const spendingPercent = state.monthlyIncome === 0 ? 0 : (totalExpenses / state.monthlyIncome) * 100;

  const portfolioValue = state.positions.reduce((s, p) => s + p.shares * p.currentPrice, 0);
  const portfolioCostBasis = state.positions.reduce((s, p) => s + p.shares * p.costBasis, 0);
  const portfolioUnrealizedPnL = portfolioValue - portfolioCostBasis;

  const netWorth = currentBalance + portfolioValue + state.emergencyFundCurrent;

  return {
    ...state,
    isLoaded,
    update,
    addTransaction,
    deleteTransaction,
    updateSector,
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

export function readFinance(): FinanceState {
  return read();
}
