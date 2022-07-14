import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Tickers from 'components/MarketIndex/Tickers';
import gql from 'graphql-tag';
import { Ticker } from 'lib/interfaces';
import { useEffect, useState } from 'react';

import MarketIndexHeader from './MarketIndexHeader';

const MarketIndexTickersQuery = gql`
  query MarketIndexTickers(
    $marketIndexId: Int
    $limit: Int
    $timeSeriesLimit: Int
    $bypassTimeSeriesLimit: Boolean
  ) {
    marketIndexTickers(marketIndexId: $marketIndexId, limit: $limit) {
      id
      symbol
      name
      sector
      subSector
      founded
      headQuarter
      timeSeries(limit: $timeSeriesLimit, bypassLimit: $bypassTimeSeriesLimit) {
        id
        date
        tickerId
        close
      }
    }
  }
`

const MarketIndex = ({
  mainWidth,
  appWidth,
  width,
  height,
  marketIndexId,
  limit,
  bypassTimeSeriesLimit,
  timeSeriesLimit,
  marketIndex,
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
    variables: { marketIndexId, limit, bypassTimeSeriesLimit, timeSeriesLimit },
  })
  const marketIndexTickers = data?.marketIndexTickers || []

  const [numOfDays, setNumOfDays] = useState(null)
  const days = timeSeriesLimit > 0 ? timeSeriesLimit : numOfDays
  useEffect(() => {
    if (marketIndexTickers.length > 0) {
      const timeSeriesLength = marketIndexTickers[0].timeSeries?.length
      if (timeSeriesLength > 0) setNumOfDays(timeSeriesLength)
    }
  }, [marketIndexTickers.length])

  return (
    <Container loading={loading} error={error}>
      <MarketIndexHeader
        data={marketIndex}
        days={days}
        timeSeriesLimit={timeSeriesLimit}
        mainWidth={mainWidth}
      />
      <Tickers
        marketIndex={marketIndex}
        containerWidth={appWidth}
        height={height}
        width={width}
        data={marketIndexTickers || []}
      />
    </Container>
  )
}

export default MarketIndex
