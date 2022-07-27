import { useQuery } from '@apollo/client';
import classnames from 'classnames';
import LineChart from 'components/LineChart';
import { COLORS } from 'lib/const';
import { MarketIndexQuery } from 'lib/graphql';
import chartOptions from 'lib/utils/chartOptions';
import fetcher from 'lib/utils/fetcher';
import getFriendlyMarketSymbol from 'lib/utils/getFriendlyMarketSymbol';
import { formatUSD } from 'lib/utils/numbers';
import { format } from 'lib/utils/time';
import moment from 'moment';
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

const TickerDetails = ({ data }) => {
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

  return (
    <div>
      {tickerProfile?.website && tickerProfile?.image && (
        <div className="w-auto">
          <a href={tickerProfile.website} target="_blank">
            <img alt={`${data.name} logo`} src={tickerProfile.image} />
          </a>
        </div>
      )}
      <div className="flex">
        <h2 className="flex flex-wrap flex-1 text-secondary font-bold">
          <a
            href={tickerProfile.website}
            target="_blank"
            className="z-0 link no-underline"
          >
            <span className="text-primary">{data.symbol}</span> {data.name}
          </a>
          {typeof data.founded === 'string' && (
            <span className="ml-3 text-sm italic text-wash-50">
              Est. {data.founded}
            </span>
          )}
        </h2>
      </div>
      <div className="text-3xl flex align-center cursor-default">
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
      {tickerRating?.rating && (
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
      )}
      <p>
        <span className="text-sm text-wash-50">Headquarter</span>:{' '}
        {data.headQuarter}
      </p>
      <p>
        {data.sector}
        {data.subSector && `, ${data.subSector}`}
      </p>
      {data.high && (
        <p className="mt-4 text-xl">
          <strong>${data.symbol}</strong> last reached a high of{' '}
          <span className="text-positiveValue-500">
            {formatUSD(data.high.close)}
          </span>{' '}
          on <em>{moment(data.high.date).format(format.standardShort)}</em> and
          a low of{' '}
          <span className="text-negativeValue-500">
            {formatUSD(data.low.close)}
          </span>{' '}
          on <em>{moment(data.low.date).format(format.standardShort)}</em>.
        </p>
      )}

      {tickerProfile && (
        <div className="pt-4 text-lg">
          <p>
            Marketcap: <strong>{formatUSD(tickerProfile.mktCap)}</strong>
          </p>
          <p>
            <span
              className="tooltip tooltip-info tooltip-right"
              data-tip="Measure of volatility compared to the S&P 500. Beta higher than 1 would be considered more volatile than the S&P500."
            >
              Beta
            </span>
            : <strong>{tickerProfile.beta.toFixed(2)}</strong>
          </p>
          <p>
            YTD Range: <strong>${tickerProfile.range}</strong>
          </p>
        </div>
      )}
      {marketIndex?.timeSeries && (
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
      )}
      {Array.isArray(tickerNews) && (
        <div className="pt-4">
          <h3>News</h3>
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
      )}
    </div>
  )
}

export default TickerDetails
