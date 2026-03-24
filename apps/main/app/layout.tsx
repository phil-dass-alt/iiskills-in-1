import type { Metadata } from 'next';
import { UserProvider } from '@iiskills/hooks';
import { AccessProvider } from '@iiskills/access';
import './globals.css';

export const metadata: Metadata = {
  title: 'iiskills — Skilling India',
  description: '2,400 structured lessons across 8 disciplines plus Aptitude training.',
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
