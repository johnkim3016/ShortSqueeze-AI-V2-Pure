import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShortSqueeze AI 2.0',
  description: 'Real-time US Stock Short Squeeze Analysis Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
