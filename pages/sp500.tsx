import { useQuery } from '@apollo/client';
import { MarketIndex } from '@prisma/client';
import Container from 'components/Container';
import Layout from 'components/Layout';
import TickerFeed from 'components/TickerFeed';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';

import { createClient } from '../prismicio';

const MarketIndexQuery = gql`
  query MarketIndex {
    marketIndex {
      id
      displayName
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('sp500'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const sp500Page = ({ page, global }) => {
  const limitQuery = useRouter().query.limit
  const limit = Number(limitQuery) || 100
  const {
    loading,
    error,
    data,
  }: {
    loading?: boolean
    error?: { message: string }
    data: { marketIndex: MarketIndex }
  } = useQuery(MarketIndexQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { limit: limit },
  })

  return (
    <Container loading={loading} error={error}>
      <Layout data={{ page: page.data, global: global.data }}>
        <div className="flex flex-row">
          {data?.marketIndex && <h1>{data.marketIndex.displayName}</h1>}
          <span className="ml-1">{limit}d</span>
        </div>
        <TickerFeed limit={limit} />
      </Layout>
    </Container>
  )
}

export default sp500Page
