import { NextResponse } from 'next/server';
import type { AppUser } from '@iiskills/hooks';

/**
 * GET /api/me
 * Returns the currently authenticated user in the canonical AppUser shape.
 * Replace this stub with your Supabase session lookup.
 */
export async function GET(): Promise<NextResponse> {
  // TODO: replace with real session lookup
  const user: AppUser | null = null;
  return NextResponse.json({ user });
}
