import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
