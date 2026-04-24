"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Lightweight user profile hook — persists to localStorage.
 * Swap this with real auth later by replacing the read/write calls.
 *
 * Usage:
 *   const { name, firstName, initials, isLoaded, hasProfile, updateUser } = useUser();
 */

const STORAGE_KEY = "finsight.user.v1";

interface StoredUser {
  name: string;
  email?: string;
}

export function useUser() {
  const [user, setUser] = useState<StoredUser>({ name: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as StoredUser;
          if (parsed && typeof parsed.name === "string") setUser(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setIsLoaded(true);
  }, []);

  const updateUser = useCallback((next: Partial<StoredUser>) => {
    setUser((prev) => {
      const merged = { ...prev, ...next };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
      return merged;
    });
  }, []);

  // Derived values
  const name = (user.name || "").trim();
  const firstName = name ? name.split(/\s+/)[0] : "";
  const initials = name
    ? name
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0]!.toUpperCase())
        .slice(0, 2)
        .join("")
    : "";
  const hasProfile = name.length > 0;

  return {
    name,
    email: user.email || "",
    firstName,
    initials,
    isLoaded,
    hasProfile,
    updateUser,
  };
}

