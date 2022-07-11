import { useQuery } from '@apollo/client';
import { MarketIndex as MarketIndexType } from '@prisma/client';
import classnames from 'classnames';
import Container from 'components/Container';
import Layout from 'components/Layout';
import MarketIndex from 'components/MarketIndex';
import { ModalButton } from 'components/Modal';
import gql from 'graphql-tag';
import { modalContentIdVar } from 'lib/cache';
import { MARKET_INDEX } from 'lib/const';
import { getMarketPageOptions } from 'lib/utils/pages';
import { format, moment, momentBusiness } from 'lib/utils/time';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

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
    // FIXME: 'MARKET_INDEX.sp500' should come from the router query, fetch markets from db to generate paths for getStaticPaths
    client.getSingle(MARKET_INDEX.sp500),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const MarketPageLayout = ({
  mainHeight = null,
  data,
  marketName,
  limit,
  timeSeriesLimit,
  bypassTimeSeriesLimit,
}) => {
  const [numOfDays, setNumOfDays] = useState(null)
  const days = timeSeriesLimit > 0 ? timeSeriesLimit : numOfDays

  return data?.marketIndex ? (
    <>
      <div className="flex flex-row h-[45px]">
        <div className="flex flex-row basis-1/2 cursor-default">
          <h1
            className="text-iced-300 tooltip tooltip-info"
            data-tip={`Last refreshed: ${moment(
              data.marketIndex.lastRefreshed
            ).fromNow()}`}
          >
            {data.marketIndex.displayName}
          </h1>
          <span
            className={classnames('ml-1 tooltip tooltip-info text-wash-50', {
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
        <div className="flex justify-end basis-1/2 items-center">
          <ModalButton onClick={() => modalContentIdVar(`${marketName}Info`)}>
            <FaInfoCircle className="text-xl text-accent" />
          </ModalButton>
        </div>
      </div>
      <MarketIndex
        height={mainHeight}
        marketIndexId={data.marketIndex.id}
        limit={limit}
        bypassTimeSeriesLimit={bypassTimeSeriesLimit}
        timeSeriesLimit={timeSeriesLimit}
        setNumOfDays={setNumOfDays}
      />
    </>
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
    variables: { name: marketName },
  })

  return (
    <Container loading={loading} error={error}>
      <Layout
        mainOverflow="overflow-hidden"
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
