import { useQuery } from '@apollo/client';
import { MarketIndex as MarketIndexType } from '@prisma/client';
import classnames from 'classnames';
import Container from 'components/Container';
import Layout from 'components/Layout';
import MarketIndex from 'components/MarketIndex';
import gql from 'graphql-tag';
import { MARKET_INDEX } from 'lib/const';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { createClient } from '../prismicio';

const MarketIndexQuery = gql`
  query MarketIndex($name: String) {
    marketIndex(name: $name) {
      id
      displayName
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle(MARKET_INDEX.sp500),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const sp500Page = ({ page, global }) => {
  const routerQuery = useRouter().query
  const limitQuery = routerQuery.limit
  const timeSeriesLimitQuery = routerQuery.days
  const limit = Number(limitQuery)
  const bypassLimit = limit <= Number(process.env.NEXT_PUBLIC_FEED_BYPASS_LIMIT)
  let timeSeriesLimit = Number(timeSeriesLimitQuery)
  timeSeriesLimit =
    timeSeriesLimit > Number(process.env.NEXT_PUBLIC_FEED_TIME_SERIES_LIMIT) &&
    !bypassLimit
      ? Number(process.env.NEXT_PUBLIC_FEED_TIME_SERIES_LIMIT)
      : timeSeriesLimit

  const {
    loading,
    error,
    data,
  }: {
    loading?: boolean
    error?: { message: string }
    data: { marketIndex: MarketIndexType }
  } = useQuery(MarketIndexQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { name: MARKET_INDEX.sp500 },
  })
  const [numOfDays, setNumOfDays] = useState(null)
  const days = timeSeriesLimit > 0 ? timeSeriesLimit : numOfDays

  return (
    <Container loading={loading} error={error}>
      <Layout data={{ page: page.data, global: global.data }}>
        {data?.marketIndex && (
          <>
            <div className="flex flex-row">
              <h1>{data.marketIndex.displayName}</h1>
              <span
                className={classnames('ml-1', {
                  hidden: !days,
                  ['animate-fadeIn']: days > 0,
                })}
              >
                {days}D
              </span>
            </div>
            <MarketIndex
              marketIndexId={data.marketIndex.id}
              limit={limit}
              bypassLimit={bypassLimit}
              timeSeriesLimit={timeSeriesLimit}
              setNumOfDays={setNumOfDays}
            />
          </>
        )}
      </Layout>
    </Container>
  )
}

export default sp500Page
