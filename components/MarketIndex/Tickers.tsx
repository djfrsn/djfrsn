import LineChart from 'components/LineChart';
import getTrendDirection from 'lib/data/getTrendDirection';
import { Ticker } from 'lib/interfaces';
import chartOptions from 'lib/utils/chartOptions';
import { FaExclamationTriangle } from 'react-icons/fa';

const Tickers = ({ data }: { data: Ticker[] }) => {
  return (
    <div className="my-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {data.length > 0 ? (
          data.map(({ id, symbol, timeSeries }) => {
            const lineColor =
              getTrendDirection(timeSeries) !== 'negative'
                ? 'limegreen'
                : 'rgb(255, 99, 132)'

            if (timeSeries.length === 0)
              return (
                <div
                  key={id}
                  className="flex flex-col items-center justify-content text-crayolaRed-100 text-center"
                >
                  <div>{symbol}</div>
                  <div className="mt-6">
                    <FaExclamationTriangle />
                  </div>
                  <div className="mt-2 text-xxs">Data Unavailable</div>
                </div>
              )

            return (
              <div key={id} className="">
                <div className="flex items-center text-center">
                  <h2>
                    <a
                      href={`https://www.marketwatch.com/investing/stock/${symbol}`}
                      target="_blank"
                      className="link no-underline"
                    >
                      {symbol}
                    </a>
                  </h2>
                  <div className="ml-2">
                    ${Number(timeSeries[0].close).toFixed(2)}
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
          })
        ) : (
          <div className="text-crayolaRed-100">Tickers Unavailable</div>
        )}
      </div>
    </div>
  )
}

export default Tickers
