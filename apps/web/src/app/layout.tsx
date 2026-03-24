import type { Metadata } from 'next';
import { AccessProvider } from '@iiskills/access';
import { UserProvider } from '@iiskills/hooks';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'iiskills',
  description: 'iiskills learning platform',
};

/**
 * Root layout — Global Entry Point.
 *
 * Layer order (outermost → innermost):
 *   UserProvider  – fetches /api/me once; provides AppUser | null to the whole tree.
 *   AccessProvider – reads from UserProvider; exposes { user, loading } to AccessGuard.
 *   children       – all routes; none of them perform auth or paywall calculations.
 *
 * The "Logic Sandwich" principle: no page or component inside children may
 * import useAccess directly or compute paywall state — only AccessGuard may.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <AccessProvider>
            {children}
          </AccessProvider>
        </UserProvider>
      </body>
    </html>
  );
}
