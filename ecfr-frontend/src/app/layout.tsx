// app/layout.tsx
import React from 'react';
import './globals.css'; // Ensure you import your Tailwind/Global CSS
import Navbar from './components/Navbar';
import { Inconsolata } from 'next/font/google';

export const metadata = {
  title: 'eCFR Analyzer',
  icons: {
    icon: 'https://cdn-icons-png.flaticon.com/512/4252/4252349.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const inconsolata = Inconsolata({ subsets: ['latin'] });

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body 
      suppressHydrationWarning
      className={`bg-gray-900 text-white h-screen flex flex-col font-inconsolata ${inconsolata.className}`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
