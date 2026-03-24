'use client';

import React from 'react';
import { useAccess } from './useAccess';

interface GuardProps {
  courseId: string;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

/**
 * AccessGuard – the ONLY component in the codebase allowed to gate content
 * behind the paywall.
 *
 * Usage:
 *   <AccessGuard courseId="learn-ai" fallback={<PaywallPrompt />}>
 *     <LessonContent />
 *   </AccessGuard>
 */
export const AccessGuard = ({ courseId, children, fallback }: GuardProps): React.ReactElement => {
  const { showPaywall } = useAccess(courseId);
  if (showPaywall) return <>{fallback}</>;
  return <>{children}</>;
};
