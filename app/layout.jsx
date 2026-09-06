import './globals.css';
import { Inter } from 'next/font/google';
import ClientProviders from '@/components/providers/ClientProviders';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });

export const metadata = {
  title: 'MediSync.ai — Healthcare, Connected by Intelligence',
  description: 'AI-powered healthcare platform with intelligent conversations, smart scheduling, real-time queue tracking, and report intelligence.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
