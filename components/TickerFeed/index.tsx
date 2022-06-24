import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Tickers from 'components/TickerFeed/Tickers';
import gql from 'graphql-tag';
import { TickerType } from 'lib/types';
import { useEffect } from 'react';

const TickerFeedQuery = gql`
  query TickerFeed(
    $marketIndexId: Int
    $limit: Int
    $timeSeriesLimit: Int
    $bypassLimit: Boolean
  ) {
    tickerFeed(marketIndexId: $marketIndexId, limit: $limit) {
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

const TickerFeed = ({
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
    data: { tickerFeed: TickerType[] }
  } = useQuery(TickerFeedQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { marketIndexId, limit, bypassLimit, timeSeriesLimit },
  })
  useEffect(() => {
    if (data?.tickerFeed.length > 0) {
      const timeSeriesLength = data.tickerFeed[0].timeSeries?.length
      if (timeSeriesLength > 0) setNumOfDays(timeSeriesLength)
    }
  }, [data?.tickerFeed.length])

  return (
    <Container loading={loading} error={error}>
      <Tickers data={data?.tickerFeed || []} />
    </Container>
  )
}

export default TickerFeed
