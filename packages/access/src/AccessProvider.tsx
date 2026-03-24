'use client';

import React, { createContext, useContext } from 'react';
import { useUser, type AppUser } from '@iiskills/hooks';

interface AccessContextValue {
  user: AppUser | null;
  loading: boolean;
}

const AccessContext = createContext<AccessContextValue | null>(null);

/**
 * AccessProvider – wrap the app root with this provider.
 *
 * It resolves the current user once at the tree root and makes the result
 * available to any descendant via useAccessContext().  All paywall decisions
 * still flow through useAccess / AccessGuard — the provider exists only to
 * avoid redundant /api/me fetches in deep component trees.
 */
export function AccessProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { user, loading } = useUser();

  return <AccessContext.Provider value={{ user, loading }}>{children}</AccessContext.Provider>;
}

/**
 * useAccessContext – read the resolved user from the AccessProvider.
 * Throws if used outside of AccessProvider.
 */
export function useAccessContext(): AccessContextValue {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error('useAccessContext must be used within an AccessProvider');
  }
  return ctx;
}
