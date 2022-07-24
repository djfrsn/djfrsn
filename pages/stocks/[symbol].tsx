import Layout from 'components/Layout';
import prisma from 'lib/db/prisma';
import omit from 'lodash/omit';
import { GetStaticPaths } from 'next/types';

import { createClient } from '../../prismicio';

export async function getStaticProps({ previewData, params: { symbol } }) {
  const client = createClient({ previewData })

  const global = await client.getSingle('global')
  const ticker = await prisma.ticker.findFirst({ where: { symbol } })
  console.log('ticker', ticker)
  return {
    props: { global, ticker: omit(ticker, 'updatedAt') },
  }
}

export default function StockPage(props) {
  console.log('ticker', props.ticker)

  return (
    <Layout
      data={{
        page: { title: '404', description: 'Page Not Found' },
        global: props.global?.data,
      }}
    >
      Test
    </Layout>
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
