import { useQuery } from '@apollo/client';
import DailyTickerFeed from 'components/DailyTickerFeed';
import Layout from 'components/Layout';
import LoadingIndicator from 'components/Loading';
import gql from 'graphql-tag';
import { DailyTickerFeedQueryType } from 'lib/types';
import { useRouter } from 'next/router';

import { createClient } from '../prismicio';

const DailyTickerFeedQuery = gql`
  query DailyTickerFeed($limit: Int) {
    dailyTickerFeed {
      id
      symbol
      timeSeries(limit: $limit) {
        id
        date
        tickerId
        close
      }
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('daily-ticker-feed'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const DailyTickerFeedPage = ({ page, global }) => {
  const limitQuery = useRouter().query.limit
  const limit = Number(limitQuery) || 100
  const {
    loading,
    error,
    data,
  }: {
    loading?: boolean
    error?: { message: string }
    data: DailyTickerFeedQueryType
  } = useQuery(DailyTickerFeedQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { limit: limit },
  })

  if (loading) {
    return <LoadingIndicator />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  return (
    <Layout data={{ page: page.data, global: global.data }}>
      <DailyTickerFeed limit={limit} data={data.dailyTickerFeed} />
    </Layout>
  )
}

export default DailyTickerFeedPage
