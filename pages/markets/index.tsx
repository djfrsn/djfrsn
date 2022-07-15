import { useQuery } from '@apollo/client';
import { MarketIndex as MarketIndexType } from '@prisma/client';
import Container from 'components/Container';
import Layout from 'components/Layout';
import MarketIndex from 'components/MarketIndex';
import gql from 'graphql-tag';
import { PAGES } from 'lib/const';
import { getMarketPageOptions } from 'lib/utils/pages';
import { useRouter } from 'next/router';

import { createClient } from '../../prismicio';

const MarketIndexQuery = gql`
  query MarketIndex(
    $name: String
    $timeSeriesLimit: Int
    $bypassTimeSeriesLimit: Boolean
  ) {
    marketIndex(name: $name) {
      id
      name
      displayName
      lastRefreshed
      symbol
      timeSeries(limit: $timeSeriesLimit, bypassLimit: $bypassTimeSeriesLimit) {
        id
        date
        close
      }
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle(PAGES.markets),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const MarketPageLayout = ({
  appwidth = null,
  mainheight = null,
  mainwidth = null,
  data,
  marketName,
  limit,
  timeSeriesLimit,
  bypassTimeSeriesLimit,
}) => {
  return data?.marketIndex ? (
    <MarketIndex
      marketIndex={data.marketIndex}
      mainWidth={mainwidth}
      appWidth={appwidth}
      height={mainheight}
      width={mainwidth}
      marketIndexId={data.marketIndex.id}
      limit={limit}
      bypassTimeSeriesLimit={bypassTimeSeriesLimit}
      timeSeriesLimit={timeSeriesLimit}
    />
  ) : (
    <div className="text-crayolaRed-500">Market "{marketName}" not found.</div>
  )
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
    variables: { name: marketName, timeSeriesLimit, bypassTimeSeriesLimit },
  })

  return (
    <Container loading={loading} error={error}>
      <Layout
        mainOverflow="overflow-visible"
        data={{ page: page.data, global: global.data }}
      >
        <MarketPageLayout
          data={data}
          marketName={marketName}
          limit={limit}
          timeSeriesLimit={timeSeriesLimit}
          bypassTimeSeriesLimit={bypassTimeSeriesLimit}
        />
      </Layout>
    </Container>
  )
}

export default MarketPage