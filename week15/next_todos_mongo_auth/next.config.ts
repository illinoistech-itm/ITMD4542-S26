import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js not to bundle better-sqlite3 — it's a native Node.js module
  // that must be loaded by the Node.js runtime, not the bundler.
  serverExternalPackages: ['better-sqlite3', 'mongodb', 'mongoose'],
};

export default nextConfig;
