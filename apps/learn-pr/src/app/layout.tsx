import type { Metadata } from 'next';
import { UserProvider } from '@iiskills/hooks';
import { AccessProvider } from '@iiskills/access';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'iiskills — Public Relations',
  description: 'Craft compelling narratives and master brand communications.',
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
