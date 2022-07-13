import { MarketIndex, TickerInfo } from '@prisma/client';
import classnames from 'classnames';
import LineChart from 'components/LineChart';
import { ModalButton } from 'components/Modal';
import { modalContentIdVar, modalContentVar } from 'lib/cache';
import { SCREENS } from 'lib/const';
import { Ticker as TickerType } from 'lib/interfaces';
import chartOptions from 'lib/utils/chartOptions';
import { getLineColor } from 'lib/utils/charts';
import chunk from 'lib/utils/chunk';
import { formatUSD } from 'lib/utils/numbers';
import { PureComponent } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FixedSizeGrid as Grid } from 'react-window';

class Ticker extends PureComponent {
  props: {
    className?: string
    style: { [name: string]: string | number }
    data: { marketIndex: MarketIndex; ticker: TickerType }
  }
  render() {
    const { className = '', style = {} } = this.props
    const {
      marketIndex,
      ticker: {
        id,
        symbol,
        name,
        founded,
        headQuarter,
        sector,
        subSector,
        timeSeries,
      },
    } = this.props.data

    const symbolTip = `${name}\n${sector}`

    if (timeSeries.length === 0)
      return (
        <div
          key={id}
          className={classnames(
            className,
            'flex flex-col items-center justify-content text-crayolaRed-500 text-center'
          )}
          style={style}
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
      <div key={id} style={style}>
        <div
          className={classnames(className, 'flex items-center z-10 w-[100px]')}
        >
          <ModalButton
            onClick={() => {
              let high: TickerInfo | null = null
              let low: TickerInfo | null = null

              timeSeries.forEach(item => {
                const itemClose = Number(item.close)
                if (!high || (high.close && itemClose > Number(high.close)))
                  high = item
                if (!low || (low.close && itemClose < Number(low.close)))
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
                timeSeries,
                marketIndex,
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
          <div className="ml-2 text-wash-50 cursor-default">{close}</div>
        </div>
        <LineChart
          options={chartOptions.simple}
          data={{
            labels: timeSeries.map(series => series.date),
            datasets: [
              {
                label: symbol,
                data: timeSeries.map(set => Number(set.close)).reverse(),
                borderColor: getLineColor(timeSeries),
              },
            ],
          }}
        />
      </div>
    )
  }
}

const getColumnCount = width => {
  const screenToNum = val => Number(val.replace('px', ''))
  switch (true) {
    case width >= screenToNum(SCREENS.sm):
      return 3
    case width >= screenToNum(SCREENS.md):
      return 4
    case width >= screenToNum(SCREENS.lg):
      return 5
    default:
      return 2
  }
}

class Cell extends PureComponent {
  props: {
    index: number
    style: { [name: string]: string | number }
    rowIndex: number
    columnIndex: number
    data: TickerType[]
    marketIndex: MarketIndex
  }
  render() {
    const { index, style, rowIndex, columnIndex, data } = this.props
    const tickerData = data[rowIndex][columnIndex]

    if (!tickerData) return null

    const className =
      columnIndex % 2
        ? rowIndex % 2 === 0
          ? 'cell-item-odd'
          : 'cell-item-even'
        : rowIndex % 2
        ? 'cell-item-odd'
        : 'cell-item-even'

    return (
      <Ticker
        className={className}
        key={index}
        style={style}
        data={tickerData}
      />
    )
  }
}

class TickerList extends PureComponent {
  props: {
    containerWidth: number
    height: number
    width: number
    data: TickerType[]
    marketIndex: MarketIndex
  }
  render() {
    const { containerWidth, height, width, data, marketIndex } = this.props

    const columnCount = getColumnCount(containerWidth)
    const gridData = chunk(data, columnCount, {
      props: { marketIndex },
      chunkPropName: 'ticker',
    })
    // TODO: add some pad to columnWidth and add even odd logic

    // prior grid: grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-8

    return (
      <Grid
        columnCount={columnCount}
        columnWidth={width / columnCount}
        height={height - 80}
        rowCount={gridData.length}
        rowHeight={(width / columnCount) * 0.75}
        width={width}
        itemData={gridData}
      >
        {Cell}
      </Grid>
    )
  }
}

const Tickers = ({
  containerWidth,
  height,
  width,
  data,
  marketIndex,
}: {
  containerWidth: number
  width: number
  height: number
  data: TickerType[]
  marketIndex: MarketIndex
}) => {
  return (
    <div
      className={classnames({ hidden: height <= 0 }, `mt-8`)}
      style={{ height: `${height - 80}px` }}
    >
      <div className="pb-8">
        {data.length > 0 ? (
          <TickerList
            containerWidth={containerWidth}
            height={height}
            width={width}
            data={data}
            marketIndex={marketIndex}
          />
        ) : (
          <div className="text-crayolaRed-500">Tickers Unavailable</div>
        )}
      </div>
    </div>
  )
}

export default Tickers
