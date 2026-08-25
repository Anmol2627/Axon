import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Axon — Find the right people. Build the right team.',
  description:
    'AI-powered project and team intelligence. Describe your project, AI understands what it needs, finds the best collaborators, and builds your optimal team — with a plain-language explanation of why it works.',
  keywords: ['team building', 'AI matching', 'hackathon', 'project collaboration', 'team intelligence'],
  authors: [{ name: 'Axon' }],
  openGraph: {
    title: 'Axon — AI Team Intelligence',
    description: 'Find the right people. Build the right team.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
