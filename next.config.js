/** @type {import('next').NextConfig} */

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction

const { withSentryConfig } = require("@sentry/nextjs");

// your existing module.exports or default export
// const nextConfig = {
//   images: {
//     domains: [
//       "clubspace.nyc3.digitaloceanspaces.com",
//       "https://lh3.googleusercontent.com/",
//     ],
//   },

//   // Optional build-time configuration options
//   sentry: {
//     // See the sections below for information on the following options:
//     //   'Configure Source Maps':
//     //     - disableServerWebpackPlugin
//     //     - disableClientWebpackPlugin
//     //     - hideSourceMaps
//     //     - widenClientFileUpload
//     //   'Configure Legacy Browser Support':
//     //     - transpileClientSDK
//     //   'Configure Serverside Auto-instrumentation':
//     //     - autoInstrumentServerFunctions
//     //     - excludeServerRoutes
//     //   'Configure Tunneling to avoid Ad-Blockers':
//     //     - tunnelRoute
//   },
// };
const nextConfig = {
  images: {
    domains: [
      "clubspace.nyc3.digitaloceanspaces.com",
      "lh3.googleusercontent.com",
    ],
  },

  // Optional build-time configuration options
  sentry: {
    // See the sections below for information on the following options:
    //   'Configure Source Maps':
    //     - disableServerWebpackPlugin
    //     - disableClientWebpackPlugin
    //     - hideSourceMaps
    //     - widenClientFileUpload
    //   'Configure Legacy Browser Support':
    //     - transpileClientSDK
    //   'Configure Serverside Auto-instrumentation':
    //     - autoInstrumentServerFunctions
    //     - excludeServerRoutes
    //   'Configure Tunneling to avoid Ad-Blockers':
    //     - tunnelRoute
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  org: "clubspace",
  project: "clubspace",

  silent: true, // Suppresses all logs

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

// If you're using a next.config.mjs file:
// export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
