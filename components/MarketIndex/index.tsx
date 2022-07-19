import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Tickers from 'components/MarketIndex/Tickers';
import { openModal } from 'components/Modal';
import gql from 'graphql-tag';
import { Ticker } from 'lib/interfaces';
import { FetchMore } from 'lib/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import MarketIndexHeader, { showMarketIndexInfo } from './MarketIndexHeader';

const MarketIndexTickersQuery = gql`
  query MarketIndexTickers(
    $marketIndexId: Int
    $limit: Int
    $timeSeriesLimit: Int
    $cursor: Int
  ) {
    marketIndexTickers(
      marketIndexId: $marketIndexId
      limit: $limit
      cursor: $cursor
    ) {
      id
      symbol
      name
      sector
      subSector
      founded
      headQuarter
      timeSeries(limit: $timeSeriesLimit) {
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
  tickerCount,
  limit,
  timeSeriesLimit,
  marketIndex,
}) => {
  const router = useRouter()
  const routerQuery = router.query
  const {
    loading,
    error,
    data,
    fetchMore,
  }: {
    loading?: boolean
    error?: { message: string }
    data: { marketIndexTickers: Ticker[] }
    fetchMore: FetchMore
  } = useQuery(MarketIndexTickersQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { marketIndexId, limit, timeSeriesLimit },
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
    if (typeof routerQuery.info === 'string' && marketIndex?.name) {
      showMarketIndexInfo(marketIndex.name)
      openModal(true)
      router.replace(router.asPath.replace('?info', ''))
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
        fetchMore={fetchMore}
        count={tickerCount?.count}
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
