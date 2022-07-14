import { MarketIndex, TickerInfo } from '@prisma/client';
import classnames from 'classnames';
import LineChart from 'components/LineChart';
import { ModalButton } from 'components/Modal';
import { modalContentIdVar, modalContentVar } from 'lib/cache';
import { Ticker as TickerType } from 'lib/interfaces';
import chartOptions from 'lib/utils/chartOptions';
import { getLineColor } from 'lib/utils/charts';
import chunk from 'lib/utils/chunk';
import { formatUSD } from 'lib/utils/numbers';
import { getHeaderHeight, getTickerColumnCount } from 'lib/utils/pages';
import memoizeOne from 'memoize-one';
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FixedSizeGrid as Grid } from 'react-window';

import styles from './tickers.module.css';

const reverseTimeSeries = memoizeOne(timeSeries =>
  timeSeries.map(set => Number(set.close)).reverse()
)

const Ticker = props => {
  const { className = '', style = {} } = props
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
  } = props.data

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
            if (!low || (low.close && itemClose < Number(low.close))) low = item
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

const MemoTicker: any = React.memo(Ticker, (prevProps, nextProps) => {
  /*
    avoid rendering ticker unless we change timeSeries or screen width
  */
  return (
    prevProps.data.ticker.timeSeries[0].date ===
      nextProps.data.ticker.timeSeries[0].date &&
    prevProps.data.containerWidth === nextProps.data.containerWidth
  )
})

const Cell = ({ index, style, rowIndex, columnIndex, data }) => {
  const tickerData = data[rowIndex][columnIndex]

  if (!tickerData) return null

  return <MemoTicker key={index} style={style} data={tickerData} />
}

const TickerList = ({ containerWidth, height, width, data, marketIndex }) => {
  const timeSeriesLength = data[0].timeSeries.length
  const columnCount = getTickerColumnCount(containerWidth, timeSeriesLength)
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
