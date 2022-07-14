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
import memoizeOne from 'memoize-one';
import React from 'react';
import { PureComponent } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FixedSizeGrid as Grid } from 'react-window';

import styles from './tickers.module.css';

const reverseTimeSeries = memoizeOne(timeSeries =>
  timeSeries.map(set => Number(set.close)).reverse()
)

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
      <div key={id} style={style} className={className}>
        <ModalButton
          className="flex flex-col"
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
          <div className={'flex items-center z-10'}>
            <h2 className="whitespace-pre-line text-left">{symbol}</h2>
            {/* <h2
              className="tooltip tooltip-info whitespace-pre-line text-left z-100"
              data-tip={symbolTip}
            >
              {symbol}
            </h2> */}
            <div className="ml-2 text-wash-50 cursor-default">{close}</div>
          </div>
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
        </ModalButton>
      </div>
    )
  }
}

function areEqual(prevProps, nextProps) {
  /*
    avoid rendering ticker unless we change timeSeries or screen width
  */
  return (
    prevProps.data.ticker.timeSeries[0].date ===
      nextProps.data.ticker.timeSeries[0].date &&
    prevProps.data.containerWidth === nextProps.data.containerWidth
  )
}

const MemoTicker: any = React.memo(Ticker, areEqual)

const screenToNum = val => Number(val.replace('px', ''))

const getHeaderHeight = width => {
  switch (true) {
    case width < 370:
      return 173
    case width < screenToNum(SCREENS.sm):
      return 133
    case width >= screenToNum(SCREENS.md):
    default:
      return 73
  }
}

const getColumnCount = (width, timeSeriesLength) => {
  const isLgScreen = width >= screenToNum(SCREENS.lg)
  const isMdScreen = width >= screenToNum(SCREENS.md)
  const isSmScreen = width >= screenToNum(SCREENS.sm)

  switch (true) {
    case timeSeriesLength <= 7 && isLgScreen:
      return 8
    case timeSeriesLength < 30 && isLgScreen:
      return 6
    case timeSeriesLength <= 30 && isMdScreen:
    case timeSeriesLength <= 7 && isMdScreen:
      return 5
    case timeSeriesLength >= 180:
      return 1
    case isLgScreen:
      return 5
    case isMdScreen:
      return 4
    case isSmScreen:
      return 3
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
    containerWidth: number
  }
  render() {
    const { containerWidth, index, style, rowIndex, columnIndex, data } =
      this.props
    const tickerData = data[rowIndex][columnIndex]

    if (!tickerData) return null

    return <MemoTicker key={index} style={style} data={tickerData} />
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
    const timeSeriesLength = data[0].timeSeries.length
    const columnCount = getColumnCount(containerWidth, timeSeriesLength)
    const gridData = chunk(data, columnCount, {
      props: { containerWidth, marketIndex },
      chunkPropName: 'ticker',
    })
    const cellWidth = width / columnCount
    const cellHeight = (width / columnCount) * 0.75

    return (
      <Grid
        className={classnames(styles.tickerGrid, [
          styles[`tickerGrid-col-${columnCount}`],
        ])}
        columnCount={columnCount}
        columnWidth={cellWidth}
        height={height}
        rowCount={gridData.length}
        rowHeight={cellHeight}
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
  height = height - getHeaderHeight(width)
  return (
    <div
      className={classnames({ hidden: height <= 0 }, `mt-8`)}
      style={{ height: `${height}px` }}
    >
      <div>
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
