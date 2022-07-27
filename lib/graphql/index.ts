import gql from 'graphql-tag';

export const MarketIndexQuery = gql`
  query MarketIndex($id: Int, $name: String, $timeSeriesLimit: Int) {
    marketIndex(id: $id, name: $name) {
      id
      name
      displayName
      lastRefreshed
      symbol
      tickerCount {
        count
      }
      timeSeries(limit: $timeSeriesLimit) {
        id
        date
        close
      }
    }
  }
`

export const TickerQuery = gql`
  query Ticker($symbol: String, $timeSeriesLimit: Int) {
    ticker(symbol: $symbol) {
      id
      symbol
      name
      sector
      subSector
      founded
      headQuarter
      marketIndexId
      timeSeries(limit: $timeSeriesLimit) {
        id
        date
        tickerId
        close
      }
    }
  }
`
