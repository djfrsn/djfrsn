const MARKET_INTERVAL = {
  oneday: '1d',
}

module.exports = {
  COLORS: {
    chartNegative: '#ff6384',
    chartPositive: '#32cd32',
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
