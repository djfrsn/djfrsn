const MARKET_INTERVAL = {
  oneday: '1d',
}

module.exports = {
  SCREENS: {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  COLORS: {
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

  MARKET_INDEX: {
    sp500: 'sp500',
  },

  MARKET_INTERVAL,

  TIMEFRAMES: Object.keys(MARKET_INTERVAL),

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
