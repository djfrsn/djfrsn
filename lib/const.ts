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

export const QUEUE = {
  marketIndexRefresh: {
    sp500: 'refresh-sp500',
    sp500TickerInfo: 'refresh-sp500-ticker-info',
  },
  refreshMarketIndex: 'update-market-index',
  refreshMarketIndexTicker: 'update-market-index-ticker-info',
}
