module.exports = {
  SCREENS: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  COLORS: {
    blackCoffee: '#362C28',
    raisinBlack: '#332E3C',
    ash: '#E7ECEF',
    negativeValue: '#ff6384',
    positiveValue: '#32cd32',
    correlationBase: '#EF271B',
    correlationBeta: '#E7ECEF',
  },
  TOPIC_FETCH_LINKS: [
    'topic.title',
    'topic.preview',
    'topic.tier',
    'topic.category',
  ],

  QUEUE: {
    refresh: {
      sp500: 'sp500',
      sp500TickerInfo: 'refresh-sp500-ticker-info',
      marketIndexes: 'refresh-market-indexes',
      marketIndex: 'refresh-market-index',
      marketIndexTicker: 'refresh-market-index-ticker-info',
    },
    cron: {
      marketIndexes: process.env.MARKET_INDEX_CRON,
    },
  },

  SITE_PATHS: {
    root: ['/', '/about'],
  },
}
