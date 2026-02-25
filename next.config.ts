import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint flat-config + FlatCompat has a known circular-JSON serialisation
    // issue with eslint-config-next. Linting still works via `next lint`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
