import type { Metadata } from 'next';
import { UserProvider } from '@iiskills/hooks';
import { AccessProvider } from '@iiskills/access';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'iiskills — Chemistry',
  description: 'Explore atomic theory, chemical reactions, and molecular science in depth.',
};

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
