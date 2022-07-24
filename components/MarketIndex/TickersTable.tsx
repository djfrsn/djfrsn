import LineChart from 'components/LineChart';
import { Ticker as TickerType } from 'lib/interfaces';
import { FetchMore } from 'lib/types';
import chartOptions from 'lib/utils/chartOptions';
import { getLineColor } from 'lib/utils/charts';
import { formatUSD } from 'lib/utils/numbers';
import reverseTimeSeries from 'lib/utils/reverseTimeSeries';

const TickersTable = ({
  data,
}: {
  count: number
  containerWidth: number
  width: number
  height: number
  data: TickerType[]
  fetchMore: FetchMore
}) => {
  return (
    <div className="my-2 lg:my-4 overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th></th>
            <th>Company</th>
            <th>Price</th>
            <th>Sector</th>
            <th>Sub Sector</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            ({ name, symbol, sector, subSector, timeSeries }, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <strong className="text-xl">{symbol}</strong> - {name}
                </td>
                <td className="font-bold text-lg bg-neutral">
                  {formatUSD(timeSeries[0].close)}
                </td>
                <td>{sector}</td>
                <td>{subSector}</td>
                <td>
                  <div className="ml-4 w-16 xs:w-20 md:w-22 lg:w-24 mx-2">
                    <LineChart
                      options={chartOptions.simple}
                      data={{
                        labels: timeSeries.map(series => series.date),
                        datasets: [
                          {
                            label: symbol,
                            data: reverseTimeSeries(timeSeries),
                            borderColor: getLineColor(timeSeries),
                          },
                        ],
                      }}
                    />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Sector</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default TickersTable
