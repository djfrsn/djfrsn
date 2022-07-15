import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Tickers from 'components/MarketIndex/Tickers';
import { openModal } from 'components/Modal';
import gql from 'graphql-tag';
import { Ticker } from 'lib/interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import MarketIndexHeader, { showMarketIndexInfo } from './MarketIndexHeader';

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
  const router = useRouter()
  const routerQuery = router.query
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
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof routerQuery.info === 'string' &&
      marketIndex?.name
    ) {
      showMarketIndexInfo(marketIndex.name, { showCloseButton: false })
      openModal()
      router.replace(router.asPath.replace('?info', ''))
      console.log('marketIndex?.name', marketIndex?.name)
    }
  }, [])

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
