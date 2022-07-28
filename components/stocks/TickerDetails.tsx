import { useQuery } from '@apollo/client';
import classnames from 'classnames';
import LineChart from 'components/LineChart';
import { COLORS } from 'lib/const';
import { Pages } from 'lib/enums';
import { MarketIndexQuery } from 'lib/graphql';
import chartOptions from 'lib/utils/chartOptions';
import fetcher from 'lib/utils/fetcher';
import getFriendlyMarketSymbol from 'lib/utils/getFriendlyMarketSymbol';
import { formatUSD } from 'lib/utils/numbers';
import { format } from 'lib/utils/time';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import useSWR from 'swr';

function getRatingClassName(val) {
  switch (val) {
    case 5:
      return 'text-gradeS-500 tooltip-success'
    case 4:
      return 'text-gradeA-500 tooltip-info'
    case 3:
      return 'text-gradeB-500 tooltip-warning'
    case 2:
    case 1:
      return 'text-gradeD-500 tooltip-error'
    default:
      return ''
  }
}

const BackButton = ({ className = '', text, onClick }) => (
  <div
    className={classnames(
      className,
      'cursor-pointer transition-colors duration-300 hover:text-accent flex items-center mb-4'
    )}
    onClick={onClick}
  >
    <FaArrowLeft className="mr-2" /> {text}
  </div>
)

const TickerName = ({ className = '', tickerProfile, data }) => (
  <h2 className={classnames(className, 'text-secondary font-bold')}>
    <a
      href={tickerProfile.website}
      target="_blank"
      className="z-0 link no-underline"
    >
      <span className="text-primary">{data.symbol}</span> {data.name}
    </a>
  </h2>
)

const TickerLogo = ({ className = '', tickerProfile, data }) =>
  tickerProfile?.website &&
  tickerProfile?.image && (
    <div className={classnames(className, 'w-16')}>
      <a href={tickerProfile.website} target="_blank">
        <img alt={`${data.name} logo`} src={tickerProfile.image} />
      </a>
    </div>
  )

const TickerPrice = ({
  className = '',
  positiveChange,
  tickerProfile,
  data,
}) => (
  <div
    className={classnames(
      className,
      'text-3xl sm:mt-2 flex align-center cursor-default'
    )}
  >
    <a
      className="text-accent"
      href={`https://www.marketwatch.com/investing/stock/${data.symbol}`}
      target="_blank"
    >
      <strong>{data.close}</strong>
    </a>
    <span
      className={classnames(
        tickerProfile.changes > 0
          ? 'text-positiveValue-500'
          : 'text-negativeValue-500',
        'text-sm tooltip tooltip-info tooltip-bottom'
      )}
      data-tip="Daily Change"
    >
      {tickerProfile &&
        `(${positiveChange ? '+' : ''}${tickerProfile.changes.toFixed(2)})`}
    </span>
  </div>
)

const FoundedDate = ({ className = '', data }) =>
  typeof data.founded === 'string' && (
    <span className={classnames(className, 'text-sm italic text-wash-50')}>
      Est. {data.founded}
    </span>
  )

const TickerRating = ({ tickerRating }) =>
  tickerRating?.rating && (
    <p>
      Rating:{' '}
      <strong
        className={classnames(
          getRatingClassName(tickerRating.ratingScore),
          'text-xl tooltip'
        )}
        data-tip={tickerRating.ratingRecommendation}
      >
        {tickerRating.rating}
      </strong>
    </p>
  )

const TickerHighLow = ({ data }) =>
  data.high && (
    <div className="flex grow">
      <p className="mt-4 text-lg xl:text-xl">
        <strong>${data.symbol}</strong> last reached a high of{' '}
        <span className="text-positiveValue-500">
          {formatUSD(data.high.close)}
        </span>{' '}
        on <em>{moment(data.high.date).format(format.standardShort)}</em> and a
        low of{' '}
        <span className="text-negativeValue-500">
          {formatUSD(data.low.close)}
        </span>{' '}
        on <em>{moment(data.low.date).format(format.standardShort)}</em>.
      </p>
    </div>
  )

const TimeSeriesFilter = ({ timeframes, timeSeriesLimit }) => (
  <div className="flex ml-auto items-end justify-end my-2">
    {timeframes.map((timeframe, index) => {
      return (
        <Link key={index} href={`/${Pages.markets}?days=${timeframe}`} shallow>
          <button
            className="btn btn-sm sm:mb-0 mr-1 last-of-type:mr-0"
            data-active={timeSeriesLimit === timeframe}
          >
            <a>{timeframe}D</a>
          </button>
        </Link>
      )
    })}
  </div>
)

const TickerChart = ({ marketIndex, data }) =>
  marketIndex?.timeSeries && (
    <div className="pt-4">
      <div className="text-center mb-1">
        <h3>
          <strong className="mr-2 text-correlationBeta-500">
            ${data.symbol}
          </strong>
          vs
          <span className="ml-2 text-correlationBase-500">
            {getFriendlyMarketSymbol(marketIndex.symbol)}
          </span>
        </h3>
      </div>
      <LineChart
        options={chartOptions.correlation}
        data={{
          labels: marketIndex.timeSeries
            .map(series => moment(series.date).format(format.standardShort))
            .reverse(),
          datasets: [
            {
              label: data.symbol,
              data: data.timeSeries.map(set => Number(set.close)).reverse(),
              borderColor: COLORS.correlationBeta,
              yAxisID: 'y1',
            },
            {
              label: getFriendlyMarketSymbol(marketIndex.symbol),
              data: marketIndex.timeSeries
                .map(set => Number(set.close))
                .reverse(),
              borderColor: COLORS.correlationBase,
              yAxisID: 'y',
            },
          ],
        }}
      />
    </div>
  )

const TickerInfo = ({ className = '', tickerProfile, data }) =>
  tickerProfile && (
    <div className={classnames(className, 'pt-4 text-lg lg:grow')}>
      <p>
        <span className="text-sm text-wash-50">Headquarter</span>:{' '}
        {data.headQuarter}
      </p>
      <p>
        <span className="text-sm text-wash-50">Sector</span>: {data.sector}
        {data.subSector && `, ${data.subSector}`}
      </p>
      <p>
        <span className="text-sm text-wash-50">Marketcap</span>:{' '}
        <strong>{formatUSD(tickerProfile.mktCap)}</strong>
      </p>
      <p>
        <span
          className="text-sm text-wash-50 tooltip tooltip-info tooltip-right"
          data-tip="Measure of volatility compared to the S&P 500. Beta higher than 1 would be considered more volatile than the S&P500."
        >
          Beta
        </span>
        : <strong>{tickerProfile.beta.toFixed(2)}</strong>
      </p>
      <p>
        <span className="text-sm text-wash-50">YTD Range</span>:{' '}
        <strong>${tickerProfile.range}</strong>
      </p>
    </div>
  )

const TickerNews = ({ className = '', tickerNews }) =>
  Array.isArray(tickerNews) && (
    <div className={classnames(className, 'pt-4 lg:max-w-[70%]')}>
      <h3 className="text-xl">News</h3>
      <div className="flex flex-col">
        {tickerNews.map((article, index) => (
          <a
            key={index}
            href={article.url}
            className="link truncate no-underline mb-1 last-of-type:mb-0"
            target="_blank"
          >
            {article.title}
          </a>
        ))}
      </div>
    </div>
  )

const TickerDetails = ({ data }) => {
  const router = useRouter()
  if (!data) return null

  if (!data?.id) return null
  const { data: ratingData } = useSWR(
    `${process.env.NEXT_PUBLIC_FMP_API_URL}/v3/rating/${data.symbol}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`,
    fetcher
  )
  const { data: profileData } = useSWR(
    `${process.env.NEXT_PUBLIC_FMP_API_URL}/v3/profile/${data.symbol}?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`,
    fetcher
  )
  const { data: tickerNews } = useSWR(
    `${process.env.NEXT_PUBLIC_FMP_API_URL}/v3/stock_news?tickers=${data.symbol}&limit=5&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`,
    fetcher
  )
  let marketIndex
  const marketIndexId = data?.marketIndexId

  if (marketIndexId) {
    const { data: marketIndexData } = useQuery(MarketIndexQuery, {
      fetchPolicy: 'cache-and-network',
      variables: { id: marketIndexId, timeSeriesLimit: 30 },
    })
    if (marketIndexData) marketIndex = marketIndexData.marketIndex
  }

  const tickerRating = Array.isArray(ratingData) && ratingData[0]
  const tickerProfile = Array.isArray(profileData) && profileData[0]
  const positiveChange = tickerProfile?.changes > 0
  const timeframes = [14, 30, 90, 180, 365]

  return (
    <div>
      <div className="flex flex-col">
        <BackButton
          className={classnames({ invisible: !marketIndex })}
          text={`Back to ${marketIndex?.displayName}`}
          onClick={() => router.back()}
        />
        <div className="flex items-center">
          <TickerLogo data={data} tickerProfile={tickerProfile} />
          <div className="flex flex-col ml-2">
            <TickerName data={data} tickerProfile={tickerProfile} />
            <FoundedDate className="hidden md:block" data={data} />
          </div>
        </div>
        <TickerPrice
          positiveChange={positiveChange}
          data={data}
          tickerProfile={tickerProfile}
        />
      </div>
      <TickerRating tickerRating={tickerRating} />
      <div className="flex flex-col lg:flex-row">
        <TickerHighLow data={data} />
        <TimeSeriesFilter timeframes={timeframes} timeSeriesLimit={30} />
      </div>
      <TickerChart data={data} marketIndex={marketIndex} />
      <div className="flex flex-col lg:flex-row">
        <TickerInfo data={data} tickerProfile={tickerProfile} />
        <TickerNews tickerNews={tickerNews} />
      </div>
    </div>
  )
}

export default TickerDetails
