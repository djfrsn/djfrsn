const TerserPlugin = require('terser-webpack-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  webpack: config => {
    // see https://duncanleung.com/next-js-typescript-svg-any-module-declaration/
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              // drop_console: true,
            },
          },
        }),
      ],
    }

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sp500',
        permanent: false,
      },
    ]
  },
}

module.exports = withBundleAnalyzer(moduleExports)
