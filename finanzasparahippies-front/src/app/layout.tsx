// src/app/layout.tsx

import './styles/globals.css';
import type { Metadata } from 'next';
import { Comic_Neue, Playfair_Display, Luckiest_Guy, Bangers } from 'next/font/google';
import Script from 'next/script';

const comic = Comic_Neue({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-comic',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-luckiest-guy',
});

const bangers = Bangers({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bangers',
});

export const metadata: Metadata = {
  title: 'Finanzas para Hippies',
  description: 'Tu plataforma de educación financiera',
  other: {
    'google-adsense-account': 'ca-pub-2582703158474486',
  },
};

import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${comic.variable} ${playfair.variable} ${luckiestGuy.variable} ${bangers.variable} ${comic.className}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2582703158474486"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
