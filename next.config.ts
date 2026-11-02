import type { NextConfig } from "next";

// Conservative headers for a static site with no forms or logins.
// - No script-src/style-src CSP: Next.js inlines scripts, and a strict policy
//   would need per-request nonces, which this site does not use.
// - Framing is limited to the site itself ('self'), not blocked outright,
//   because /resume embeds its own PDF in a same-origin <object>.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        // The Commerce platform case study is now the EtenMall case study.
        source: "/projects/commerce-platform",
        destination: "/projects/etenmall",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
