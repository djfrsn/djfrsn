import classnames from 'classnames';
import LineChart from 'components/LineChart';
import { ModalButton } from 'components/Modal';
import { modalContentIdVar, modalContentVar } from 'lib/cache';
import { PAGES, SCREENS } from 'lib/const';
import chartOptions from 'lib/utils/chartOptions';
import { getLineColor } from 'lib/utils/charts';
import { screenToNum } from 'lib/utils/pages';
import { format, moment } from 'lib/utils/time';
import Link from 'next/link';
import { FaInfoCircle } from 'react-icons/fa';

export const showMarketIndexInfo = (name, props = {}) => {
  modalContentVar({
    modalSize: 'large',
    marketName: name,
    ...props,
  })
  modalContentIdVar(PAGES.markets)
}

const MarketIndexHeader = ({ days, data, timeSeriesLimit, mainWidth }) => {
  const timeframes = [7, 14, 30, 90].concat(
    mainWidth > screenToNum(SCREENS.md) ? [180, 365] : []
  )
  const InfoButton = ({ className = '' }) => (
    <ModalButton
      className={className}
      onClick={() => showMarketIndexInfo(data.name)}
    >
      <FaInfoCircle className="text-xl text-accent hover:text-accent-focus transition-all" />
    </ModalButton>
  )
  const oldestTimeSeriesItem = data.timeSeries[timeSeriesLimit - 1]
  const latestTimeSeriesItem = data.timeSeries[0]

  return (
    <div className="flex md:flex-row flex-wrap">
      <div className="flex flex-max flex-wrap flex-row md:basis-1/2 cursor-default">
        <h1
          className="text-iced-300 tooltip tooltip-info"
          data-tip={`Last refreshed: ${moment(data.lastRefreshed).fromNow()}`}
        >
          {data.displayName}
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
              labels: data.timeSeries.map(series => series.date),
              datasets: [
                {
                  label: data.symbol,
                  data: data.timeSeries.map(set => Number(set.close)).reverse(),
                  borderColor: getLineColor(data.timeSeries),
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
              <Link key={index} href={`/${PAGES.markets}?days=${timeframe}`}>
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
  )
}

export default MarketIndexHeader
