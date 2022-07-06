import { useQuery } from '@apollo/client';
import { MarketIndex as MarketIndexType } from '@prisma/client';
import classnames from 'classnames';
import Container from 'components/Container';
import Layout from 'components/Layout';
import MarketIndex from 'components/MarketIndex';
import gql from 'graphql-tag';
import { MARKET_INDEX } from 'lib/const';
import { format, moment, momentBusiness } from 'lib/utils/dates';
import { getMarketPageOptions } from 'lib/utils/pages';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { createClient } from '../prismicio';

const MarketIndexQuery = gql`
  query MarketIndex($name: String) {
    marketIndex(name: $name) {
      id
      displayName
      lastRefreshed
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    // FIXME: 'MARKET_INDEX.sp500' should come from the router query
    client.getSingle(MARKET_INDEX.sp500),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const MarketPage = ({ page, global }) => {
  const routerQuery = useRouter().query
  const { marketName, limit, timeSeriesLimit, bypassTimeSeriesLimit } =
    getMarketPageOptions(routerQuery)
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
    variables: { name: marketName },
  })
  const [numOfDays, setNumOfDays] = useState(null)
  const days = timeSeriesLimit > 0 ? timeSeriesLimit : numOfDays

  return (
    <Container loading={loading} error={error}>
      <Layout data={{ page: page.data, global: global.data }}>
        {data?.marketIndex ? (
          <>
            <div className="flex flex-row cursor-default">
              <h1
                className="text-iced-200 tooltip tooltip-info"
                data-tip={`Last refreshed: ${moment(
                  data.marketIndex.lastRefreshed
                ).fromNow()}`}
              >
                {data.marketIndex.displayName}
              </h1>
              <span
                className={classnames('ml-1 tooltip tooltip-info', {
                  hidden: !days,
                  ['animate-fadeIn']: days > 0,
                })}
                data-tip={`${momentBusiness()
                  .businessSubtract(days)
                  .format(format.standard)} - ${momentBusiness().format(
                  format.standard
                )}`}
              >
                {days}D
              </span>
            </div>
            <MarketIndex
              marketIndexId={data.marketIndex.id}
              limit={limit}
              bypassTimeSeriesLimit={bypassTimeSeriesLimit}
              timeSeriesLimit={timeSeriesLimit}
              setNumOfDays={setNumOfDays}
            />
          </>
        ) : (
          <div className="text-crayolaRed-100">
            Market "{marketName}" not found.
          </div>
        )}
      </Layout>
    </Container>
  )
}

export default MarketPage
