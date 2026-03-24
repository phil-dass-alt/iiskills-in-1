import type { NextResponse } from 'next/server';
import { NextResponse as Res } from 'next/server';
import type { AppUser } from '@iiskills/hooks';

/**
 * GET /api/me
 *
 * Returns the currently authenticated user in the canonical AppUser shape.
 * Replace this stub with your Supabase (or other auth provider) session lookup.
 *
 * Example Supabase replacement:
 *   const supabase = createSupabaseServerClient(cookies());
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // normalise to AppUser ...
 */
export async function GET(): Promise<NextResponse> {
  // TODO: replace with real session lookup
  const user: AppUser | null = null;

  return Res.json({ user });
}
