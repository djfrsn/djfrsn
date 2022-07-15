const TerserPlugin = require('terser-webpack-plugin')
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

module.exports = withBundleAnalyzer(moduleExports)
