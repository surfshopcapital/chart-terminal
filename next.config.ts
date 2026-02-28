import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // yahoo-finance2 uses native Node.js modules — keep it server-only
  serverExternalPackages: ['yahoo-finance2'],
};

export default nextConfig;
