import { NextResponse } from 'next/server';
import type { AppUser } from '@iiskills/hooks';

/**
 * GET /api/me
 *
 * Returns the currently authenticated user in the canonical AppUser shape.
 * Replace this stub with your Supabase (or other auth provider) session lookup.
 */
export async function GET(): Promise<NextResponse> {
  // TODO: Replace with real session lookup, e.g.:
  //   const supabase = createSupabaseServerClient();
  //   const { data: { user } } = await supabase.auth.getUser();
  //   ... normalise to AppUser ...

  const user: AppUser | null = null;

  return NextResponse.json({ user });
}
