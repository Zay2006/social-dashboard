import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // DiceBear avatars. The PNG endpoint is used instead of SVG so that
      // `dangerouslyAllowSVG` is not required.
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/**",
      },
      // Placeholder imagery attached to generated posts. `picsum.photos` answers
      // with a 302 to its CDN, so both hosts are listed.
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/seed/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
