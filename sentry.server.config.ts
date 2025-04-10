// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://10272a26adc1b894a30c75976d140cd3@o4505362337824768.ingest.us.sentry.io/4507054166966272",

  // 只在生产环境下启用 Sentry
  enabled: process.env.NODE_ENV === "production",

  // 调整采样率
  tracesSampleRate: process.env.NODE_ENV === "production" ? 1 : 0,

  // 开发环境下关闭调试信息
  debug: false,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
});
