import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a09d2a4bab454767b264e02e45d07398@o4505339900067840.ingest.sentry.io/4505356343050240",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
