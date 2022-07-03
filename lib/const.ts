export const TOPIC_FETCH_LINKS = [
  'topic.title',
  'topic.preview',
  'topic.tier',
  'topic.category',
]

export const MARKET_INDEX = {
  sp500: 'sp500',
}

export const MARKET_INTERVAL = {
  oneday: '1d',
}

export const TIMEFRAMES = Object.keys(MARKET_INTERVAL)

export const QUEUE = {
  refresh: {
    sp500: 'refresh-sp500',
    sp500TickerInfo: 'refresh-sp500-ticker-info',
    marketIndexes: 'refresh-market-indexes',
    marketIndex: 'refresh-market-index',
    marketIndexTicker: 'refresh-market-index-ticker-info',
  },
  cron: {
    marketIndexes: '0/15 * * * *',
    // marketIndexes: '30 7-16 * * *',
  },
}
