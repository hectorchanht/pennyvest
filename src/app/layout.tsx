import './globals.css';
import type { Metadata } from 'next';
import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Pennyvest',
  description: 'Clearly explained investment strategies with real-time news context',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
