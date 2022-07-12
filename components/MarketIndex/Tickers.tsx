import { TickerInfo } from '@prisma/client';
import classNames from 'classnames';
import LineChart from 'components/LineChart';
import { ModalButton } from 'components/Modal';
import { modalContentIdVar, modalContentVar } from 'lib/cache';
import { COLORS } from 'lib/const';
import getTrendDirection from 'lib/data/getTrendDirection';
import { Ticker } from 'lib/interfaces';
import chartOptions from 'lib/utils/chartOptions';
import { formatUSD } from 'lib/utils/numbers';
import { FaExclamationTriangle } from 'react-icons/fa';

const Tickers = ({ height, data }: { height: number; data: Ticker[] }) => {
  return (
    <div
      className={classNames({ hidden: height <= 0 }, `mt-8`)}
      style={{ height: `${height - 45}px` }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8">
        {data.length > 0 ? (
          data.map(
            ({
              id,
              symbol,
              name,
              founded,
              headQuarter,
              sector,
              subSector,
              timeSeries,
            }) => {
              const lineColor =
                getTrendDirection(timeSeries) !== 'negative'
                  ? COLORS.chartPositive
                  : COLORS.chartNegative
              const symbolTip = `${name}\n${sector}`

              if (timeSeries.length === 0)
                return (
                  <div
                    key={id}
                    className="flex flex-col items-center justify-content text-crayolaRed-500 text-center"
                  >
                    <div className="tooltip tooltip-info" data-tip={symbolTip}>
                      {symbol}
                    </div>
                    <div className="mt-6">
                      <FaExclamationTriangle />
                    </div>
                    <div className="mt-2 text-xxs">Data Unavailable</div>
                  </div>
                )

              const close = formatUSD(timeSeries[0].close)

              return (
                <div key={id} className="">
                  <div className="flex items-center z-10">
                    <ModalButton
                      onClick={() => {
                        let high: TickerInfo | null = null
                        let low: TickerInfo | null = null

                        timeSeries.forEach(item => {
                          const itemClose = Number(item.close)
                          if (
                            !high ||
                            (high.close && itemClose > Number(high.close))
                          )
                            high = item
                          if (
                            !low ||
                            (low.close && itemClose < Number(low.close))
                          )
                            low = item
                        })

                        modalContentVar({
                          id,
                          symbol,
                          name,
                          founded,
                          headQuarter,
                          sector,
                          subSector,
                          close,
                          high,
                          low,
                        })
                        modalContentIdVar(`${symbol}TickerInfo`)
                      }}
                    >
                      <h2
                        className="tooltip tooltip-info whitespace-pre-line text-left z-100"
                        data-tip={symbolTip}
                      >
                        {symbol}
                      </h2>
                    </ModalButton>
                    <div className="ml-2 text-wash-50 cursor-default">
                      {close}
                    </div>
                  </div>
                  <LineChart
                    options={chartOptions.simple}
                    data={{
                      labels: timeSeries.map(series => series.date),
                      datasets: [
                        {
                          label: symbol,
                          data: timeSeries
                            .map(set => Number(set.close))
                            .reverse(),
                          borderColor: lineColor,
                        },
                      ],
                    }}
                  />
                </div>
              )
            }
          )
        ) : (
          <div className="text-crayolaRed-500">Tickers Unavailable</div>
        )}
      </div>
    </div>
  )
}

export default Tickers
