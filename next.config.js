/** @type {import("next").NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.uzmart.org",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "foodyman.s3.amazonaws.com",
        port: "",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "http",
        hostname: "realestate.api.test",
      },
      {
        protocol: "https",
        hostname: "api.avella.pro",
      },
      {
        protocol: "https",
        hostname: "graph.facebook.com",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
