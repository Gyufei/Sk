// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://10272a26adc1b894a30c75976d140cd3@o4505362337824768.ingest.us.sentry.io/4507054166966272",

  // 只在生产环境下启用 Sentry
  enabled: process.env.NODE_ENV === 'production',
  
  // 调整采样率
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1 : 0,
  
  // 开发环境下关闭调试信息
  debug: false,

  // 调整错误重放采样率
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0,
  
  // 调整会话重放采样率
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
