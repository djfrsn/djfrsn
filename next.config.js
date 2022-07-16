const TerserPlugin = require('terser-webpack-plugin')
const { withSentryConfig } = require('@sentry/nextjs')
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  reactStrictMode: true,
  webpack: config => {
    // see https://duncanleung.com/next-js-typescript-svg-any-module-declaration/
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    }

    config.plugins.push(
      new MomentTimezoneDataPlugin({
        matchZones: /^America/,
      })
    )

    return config
  },
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/market',
      //   permanent: false,
      // },
    ]
  },
  images: {
    domains: ['images.prismic.io'],
  },
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = withBundleAnalyzer(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions)
)
