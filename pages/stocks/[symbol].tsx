import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Layout from 'components/Layout';
import { TickerDetails } from 'components/Modal/template/Markets';
import gql from 'graphql-tag';
import prisma from 'lib/db/prisma';
import { Ticker } from 'lib/interfaces';
import getTimeSeriesHighLow from 'lib/utils/getTimeSeriesHighLow';
import { GetStaticPaths } from 'next/types';

import { createClient } from '../../prismicio';

const TickerQuery = gql`
  query Ticker($symbol: String, $timeSeriesLimit: Int) {
    ticker(symbol: $symbol) {
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

export async function getStaticProps({ previewData, params: { symbol } }) {
  const client = createClient({ previewData })

  const global = await client.getSingle('global')

  return {
    props: { global, symbol },
  }
}

export default function StockPage(props) {
  const {
    loading,
    error,
    data,
  }: {
    loading?: boolean
    error?: { message: string }
    data: { ticker: Ticker }
  } = useQuery(TickerQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { symbol: props.symbol, timeSeriesLimit: 30 },
  })

  const { high, low } = data?.ticker?.timeSeries
    ? getTimeSeriesHighLow(data.ticker.timeSeries)
    : { high: null, low: null }

  console.log('high', high)

  return (
    <Container loading={loading} error={error}>
      <Layout
        data={{
          page: {
            title: `${data?.ticker.symbol} - Stock Info`,
            description: `${data?.ticker.symbol} - ${data?.ticker.name} company and stock price information`,
          },
          global: props.global?.data,
        }}
      >
        <TickerDetails
          data={{ modalContent: { ...data?.ticker, high, low } }}
        />
      </Layout>
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tickers = await prisma.ticker.findMany({
    take: 10,
    orderBy: { symbol: 'asc' },
  })

  return {
    paths: tickers.map(ticker => ({
      params: {
        symbol: ticker.symbol,
      },
    })),
    fallback: true,
  }
}
