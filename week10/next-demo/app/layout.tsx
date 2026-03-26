import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Demo",
  description:
    "Basic Next.js demo with TypeScript, Tailwind CSS, and API routes.",
};

// This layout wraps EVERY page in the app.
// The nav bar here appears on all routes automatically.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Nav is defined once here — not in every page file */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex gap-6">
          <Link href="/" className="font-semibold">
            Home
          </Link>
          <Link href="/about">About</Link>
          <Link href="/counter">Counter</Link>
          <Link href="/dynamic/world">Dynamic</Link>
          <Link href="/todos">API Routes</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/images">Images</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
