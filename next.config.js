const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sp500',
        permanent: true,
      },
    ]
  },
}

module.exports = withBundleAnalyzer(moduleExports)
