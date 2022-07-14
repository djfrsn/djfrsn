import { useQuery } from '@apollo/client';
import { MarketIndex as MarketIndexType } from '@prisma/client';
import classnames from 'classnames';
import Container from 'components/Container';
import Layout from 'components/Layout';
import LineChart from 'components/LineChart';
import MarketIndex from 'components/MarketIndex';
import { ModalButton } from 'components/Modal';
import gql from 'graphql-tag';
import { modalContentIdVar, modalContentVar } from 'lib/cache';
import { SCREENS } from 'lib/const';
import chartOptions from 'lib/utils/chartOptions';
import { getLineColor } from 'lib/utils/charts';
import { getMarketPageOptions, screenToNum } from 'lib/utils/pages';
import { format, moment } from 'lib/utils/time';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

import { createClient } from '../prismicio';

const MarketIndexQuery = gql`
  query MarketIndex(
    $name: String
    $timeSeriesLimit: Int
    $bypassTimeSeriesLimit: Boolean
  ) {
    marketIndex(name: $name) {
      id
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
    client.getSingle('markets'),
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
  const [numOfDays, setNumOfDays] = useState(null)
  const days = timeSeriesLimit > 0 ? timeSeriesLimit : numOfDays
  const timeframes = [7, 14, 30, 90].concat(
    mainwidth > screenToNum(SCREENS.md) ? [180, 365] : []
  )

  const InfoButton = ({ className = '' }) => (
    <ModalButton
      className={className}
      onClick={() => {
        modalContentVar({
          marketName,
        })
        modalContentIdVar('markets')
      }}
    >
      <FaInfoCircle className="text-xl text-accent hover:text-accent-focus transition-all" />
    </ModalButton>
  )
  const oldestTimeSeriesItem = data?.marketIndex.timeSeries[timeSeriesLimit - 1]
  const latestTimeSeriesItem = data?.marketIndex.timeSeries[0]

  return data?.marketIndex ? (
    <>
      <div className="flex md:flex-row flex-wrap">
        <div className="flex flex-max flex-wrap flex-row md:basis-1/2 cursor-default">
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
            data-tip={`${moment(oldestTimeSeriesItem.date).format(
              format.standard
            )} - ${moment(latestTimeSeriesItem.date).format(format.standard)}`}
          >
            {days}D
          </span>
          <div className="ml-2 text-xl">
            - {Number(latestTimeSeriesItem.close).toFixed(2)}
          </div>
          <div className="ml-4 w-16 xs:w-20 md:w-22 lg:w-24 mx-2">
            <LineChart
              options={chartOptions.simple}
              data={{
                labels: data.marketIndex.timeSeries.map(series => series.date),
                datasets: [
                  {
                    label: data.marketIndex.symbol,
                    data: data.marketIndex.timeSeries
                      .map(set => Number(set.close))
                      .reverse(),
                    borderColor: getLineColor(data.marketIndex.timeSeries),
                  },
                ],
              }}
            />
          </div>
          <InfoButton className="flex" />
        </div>
        <div className="flex md:flex-initial justify-end md:basis-1/2 items-center mt-4 md:mt-0">
          <div className="">
            {timeframes.map((timeframe, index) => {
              return (
                <Link key={index} href={`/market?days=${timeframe}`}>
                  <button
                    className="btn btn-sm mb-2 sm:mb-0 mr-1 last-of-type:mr-0"
                    data-active={timeSeriesLimit === timeframe}
                  >
                    <a>{timeframe}D</a>
                  </button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <MarketIndex
        marketIndex={data.marketIndex}
        appWidth={appwidth}
        height={mainheight}
        width={mainwidth}
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
