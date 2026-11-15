import type { NextConfig } from "next";
import { AUTH_API_URL } from "./lib/auth-api";

// Expert portraits and certificate scans come from the backend upload origin
// (root /uploads/* — not behind /v1, so the same-origin proxy does not cover
// them). next/image needs that host allowlisted; it follows the same default
// as AUTH_API_URL, so a new tunnel only requires the env var to change.
const backendUploads = new URL(AUTH_API_URL);
const backendProtocol = backendUploads.protocol === "https:" ? "https" : "http";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: backendProtocol,
        hostname: backendUploads.hostname,
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hy",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
