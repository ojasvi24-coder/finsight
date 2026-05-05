"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "finsight.user.v1";
const UPDATE_EVENT = "finsight-user-update";

interface StoredUser {
  name: string;
  email?: string;
}

function read(): StoredUser {
  if (typeof window === "undefined") return { name: "" };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: "" };
    const parsed = JSON.parse(raw) as StoredUser;
    if (parsed && typeof parsed.name === "string") return parsed;
  } catch { /* ignore */ }
  return { name: "" };
}

function write(user: StoredUser) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // Broadcast to every useUser instance on this page
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  } catch { /* ignore */ }
}

export function useUser() {
  const [user, setUser] = useState<StoredUser>({ name: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read immediately on mount
    setUser(read());
    setIsLoaded(true);

    // Stay in sync with any other component that calls updateUser
    const sync = () => setUser(read());
    window.addEventListener(UPDATE_EVENT, sync);
    // Cross-tab sync
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const updateUser = useCallback((next: Partial<StoredUser>) => {
    setUser(prev => {
      const merged = { ...prev, ...next };
      write(merged);
      return merged;
    });
  }, []);

  const name = (user.name || "").trim();
  const firstName = name ? name.split(/\s+/)[0] : "";
  const initials = name
    ? name.split(/\s+/).filter(Boolean).map(w => w[0]!.toUpperCase()).slice(0, 2).join("")
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

