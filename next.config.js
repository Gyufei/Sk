/** @type {import('next').NextConfig} */
// const WebpackObfuscator = require("webpack-obfuscator");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // if (!isServer) {
    //   config.optimization.minimize = true;
    //   config.optimization.minimizer[0].options.minify = true;
    //   config.optimization.minimizer[0].options.minify = true;

    //   config.plugins.push(
    //     new WebpackObfuscator({
    //       rotateStringArray: false,
    //       controlFlowFlattening: true,
    //       deadCodeInjection: false,
    //       stringArray: true,
    //       splitStrings: true,
    //       transformObjectKeys: true,
    //       unicodeEscapeSequence: false,
    //       compact: true,
    //       shuffleStringArray: true,
    //       identifierNamesGenerator: "hexadecimal",
    //     }),
    //   );
    // }

    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  compress: process.env.NODE_ENV === "production",
  experimental: {
    optimizePackageImports: ["@dynamic-labs/sdk-react-core"],
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "fei-qy",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
