import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Tickers from 'components/MarketIndex/Tickers';
import gql from 'graphql-tag';
import { Ticker } from 'lib/interfaces';
import { useEffect } from 'react';

const MarketIndexTickersQuery = gql`
  query MarketIndexTickers(
    $marketIndexId: Int
    $limit: Int
    $timeSeriesLimit: Int
    $bypassLimit: Boolean
  ) {
    marketIndexTickers(marketIndexId: $marketIndexId, limit: $limit) {
      id
      symbol
      timeSeries(limit: $timeSeriesLimit, bypassLimit: $bypassLimit) {
        id
        date
        tickerId
        close
      }
    }
  }
`

const MarketIndex = ({
  marketIndexId,
  limit,
  bypassLimit,
  timeSeriesLimit,
  setNumOfDays,
}) => {
  const {
    loading,
    error,
    data,
  }: {
    loading?: boolean
    error?: { message: string }
    data: { marketIndexTickers: Ticker[] }
  } = useQuery(MarketIndexTickersQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { marketIndexId, limit, bypassLimit, timeSeriesLimit },
  })
  const marketIndexTickers = data?.marketIndexTickers || []

  useEffect(() => {
    if (marketIndexTickers.length > 0) {
      const timeSeriesLength = marketIndexTickers[0].timeSeries?.length
      if (timeSeriesLength > 0) setNumOfDays(timeSeriesLength)
    }
  }, [marketIndexTickers.length])

  return (
    <Container loading={loading} error={error}>
      <Tickers data={marketIndexTickers || []} />
    </Container>
  )
}

export default MarketIndex
