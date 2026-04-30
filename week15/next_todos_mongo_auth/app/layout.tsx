import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Todos',
  description: 'A simple todo app built with Next.js App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
