/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      //   {
      //     protocol: 'https',
      //     hostname: 'cdn.depe.app',
      //   },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  experimental: {
    optimizePackageImports: ["@dynamic-labs/sdk-react-core"],
  },
};

module.exports = nextConfig;
