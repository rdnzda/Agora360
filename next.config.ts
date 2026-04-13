import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — redundant with CSP frame-ancestors but kept for older browsers
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Enable DNS prefetching for performance
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // Force HTTPS for 1 year (only effective in production behind HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy
  // - unsafe-inline required by Next.js hydration scripts
  // - unsafe-eval required by React in development only (callstack reconstruction)
  // - Images allowed from self, data URIs, Unsplash, and randomuser.me (login page assets)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://images.unsplash.com https://randomuser.me https://*",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    // Tree-shake lucide-react so only imported icons are bundled
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "randomuser.me" },
    ],
  },
};

export default nextConfig;
