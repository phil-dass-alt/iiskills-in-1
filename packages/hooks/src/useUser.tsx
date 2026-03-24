'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Canonical user shape.
 * - ADMIN: always bypasses paywall; unrestricted = true.
 * - STUDENT: access controlled by entitledCourses list.
 */
export type AppUser =
  | { role: 'ADMIN'; unrestricted: true; bypassPaywall: true; email: string }
  | { role: 'STUDENT'; entitledCourses: string[]; email: string };

export interface UserContextValue {
  user: AppUser | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

/**
 * UserProvider – place at the app root (above AccessProvider).
 *
 * Fetches /api/me exactly once for the entire component tree.
 * All hooks and components that need the current user consume this context
 * via useUser() rather than issuing their own fetch.
 *
 * Replace the fetch body with your preferred auth adapter
 * (Supabase, NextAuth, Clerk …). The UserContextValue contract must never change.
 */
export function UserProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        const data: { user: AppUser | null } = await res.json();
        if (!cancelled) {
          setUser(data.user);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
}

/**
 * useUser – reads the current user from the nearest UserProvider.
 *
 * Must be called inside a UserProvider tree.
 * Throws in development if used outside to catch wiring mistakes early.
 */
export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be called inside a <UserProvider>.');
  }
  return ctx;
}
