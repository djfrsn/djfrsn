import { useQuery } from '@apollo/client';
import { MarketIndex } from '@prisma/client';
import classnames from 'classnames';
import Container from 'components/Container';
import Layout from 'components/Layout';
import TickerFeed from 'components/TickerFeed';
import gql from 'graphql-tag';
import { sp500 } from 'lib/const';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    client.getSingle(sp500),
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
  const timeSeriesLimit = Number(timeSeriesLimitQuery)
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
    variables: { name: sp500 },
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
            <TickerFeed
              marketIndexId={data.marketIndex.id}
              limit={limit}
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
