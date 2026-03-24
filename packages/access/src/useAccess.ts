'use client';

import { useUser } from '@iiskills/hooks';

/**
 * Canonical user shape for access control.
 * Matches the AppUser type from @iiskills/hooks.
 */
export type User =
  | { role: 'ADMIN'; unrestricted: true; bypassPaywall: true }
  | { role: 'STUDENT'; entitledCourses: string[] };

export type AccessResult = {
  canView: boolean;
  showPaywall: boolean;
  reason: 'ADMIN_BYPASS' | 'PURCHASED' | 'LOCKED' | 'LOADING';
};

/**
 * useAccess – the ONLY place in the codebase that computes paywall access.
 *
 * Rules:
 *  1. ADMIN users always get canView=true, showPaywall=false.
 *  2. STUDENT users get access only for their entitledCourses.
 *  3. No component or page may duplicate this logic.
 *
 * @param courseId - The course identifier to check entitlement for.
 */
export const useAccess = (courseId?: string): AccessResult => {
  const { user, loading } = useUser();

  if (loading) {
    return { canView: false, showPaywall: false, reason: 'LOADING' };
  }

  if (user?.role === 'ADMIN' || (user as { unrestricted?: boolean })?.unrestricted) {
    return { canView: true, showPaywall: false, reason: 'ADMIN_BYPASS' };
  }

  const hasPurchased =
    (user as { entitledCourses?: string[] })?.entitledCourses?.includes(courseId ?? '') ?? false;

  return {
    canView: hasPurchased,
    showPaywall: !hasPurchased,
    reason: hasPurchased ? 'PURCHASED' : 'LOCKED',
  };
};
