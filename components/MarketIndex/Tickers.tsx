import { MarketIndex, TickerInfo } from '@prisma/client';
import classnames from 'classnames';
import LineChart from 'components/LineChart';
import Loading from 'components/Loading';
import { ModalButton } from 'components/Modal';
import { modalContent, modalContentIdVar } from 'lib/cache';
import { Ticker as TickerType } from 'lib/interfaces';
import { FetchMore } from 'lib/types';
import chartOptions from 'lib/utils/chartOptions';
import { getLineColor } from 'lib/utils/charts';
import chunk from 'lib/utils/chunk';
import { formatUSD } from 'lib/utils/numbers';
import { getHeaderHeight, getTickerColumnCount } from 'lib/utils/pages';
import memoizeOne from 'memoize-one';
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

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
        className={classnames(
          className,
          'flex flex-col items-center justify-content text-crayolaRed-500 text-center'
        )}
        style={style}
      >
        <div className="tooltip tooltip-info !pr-0 mt-2" data-tip={symbolTip}>
          {symbol}
        </div>
        <div className="mt-2 !pr-0">
          <FaExclamationTriangle />
        </div>
        <div className="mt-2 text-xxs !pr-0">Data Unavailable</div>
      </div>
    )

  const close = formatUSD(timeSeries[0].close)

  return (
    <div style={style} className={className}>
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

          modalContent({
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
    prevProps.data.ticker?.timeSeries[0]?.date ===
      nextProps.data.ticker?.timeSeries[0]?.date &&
    prevProps.data.containerWidth === nextProps.data.containerWidth
  )
})

const LOADING = 1
const LOADED = 2
let itemStatusMap = {}

const loadMoreItems = ({
  startIndex,
  stopIndex,
  fetchMore,
  marketIndex,
  data,
}: {
  startIndex: number
  stopIndex: number
  fetchMore: FetchMore
  marketIndex: MarketIndex
  data: TickerType[]
}) => {
  console.log('startIndex', startIndex)
  console.log('stopIndex', stopIndex)
  console.log('fetchMore', fetchMore)
  console.log('marketIndex', marketIndex)
  console.log('data', data)
  const cursor = data[data.length - 1]
  console.log('fetchMore', fetchMore)
  // itemStatusMap[index] = LOADING
  // itemStatusMap[index] = LOADED
  console.log({ variables: { limit: 5, cursor: cursor.symbol } })
  fetchMore({
    variables: { limit: 10, cursor: cursor.symbol },
  })
}

const CellLoading = ({ style }) => {
  return (
    <div
      className={classnames(
        'flex flex-col items-center justify-content text-crayolaRed-500 text-center'
      )}
      style={style}
    >
      <Loading />
    </div>
  )
}

const Cell = ({ index, style, rowIndex, columnIndex, data }) => {
  const row = data[rowIndex]
  const tickerData = row && row[columnIndex]

  if (!tickerData) return <CellLoading style={style} />

  return <MemoTicker key={index} style={style} data={tickerData} />
}

const TickerList = ({
  count = 100,
  containerWidth,
  height,
  width,
  data,
  fetchMore,
  marketIndex,
}) => {
  const timeSeriesLength = data[0].timeSeries.length

  const columnCount = getTickerColumnCount(containerWidth, timeSeriesLength)
  const gridData = chunk(data, columnCount, {
    props: { containerWidth, marketIndex },
    chunkPropName: 'ticker',
  })
  const cellWidth = width / columnCount
  const cellHeight = (width / columnCount) * 0.75
  const rowCount = count / columnCount

  const isItemLoaded = index => {
    return !!data[index]
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={count}
      loadMoreItems={(startIndex, stopIndex) =>
        loadMoreItems({ startIndex, stopIndex, fetchMore, marketIndex, data })
      }
    >
      {({ onItemsRendered, ref }) => (
        <Grid
          ref={ref}
          className={classnames(styles.tickerGrid, [
            styles[`tickerGrid-col-${columnCount}`],
          ])}
          columnCount={columnCount}
          columnWidth={cellWidth}
          height={height}
          rowCount={rowCount}
          rowHeight={cellHeight}
          width={width}
          itemData={gridData}
          onItemsRendered={({
            visibleColumnStartIndex,
            visibleColumnStopIndex,
            visibleRowStartIndex,
            visibleRowStopIndex,
          }) => {
            const visibleStartIndex =
              visibleRowStartIndex * columnCount + visibleColumnStartIndex
            const visibleStopIndex =
              visibleRowStopIndex * columnCount + visibleColumnStopIndex
            onItemsRendered({
              visibleStartIndex,
              visibleStopIndex,
            })
          }}
        >
          {Cell}
        </Grid>
      )}
    </InfiniteLoader>
  )
}

const Tickers = ({
  count,
  containerWidth,
  height,
  width,
  data,
  marketIndex,
  fetchMore,
}: {
  count: number
  containerWidth: number
  width: number
  height: number
  data: TickerType[]
  marketIndex: MarketIndex
  fetchMore: FetchMore
}) => {
  height = height - getHeaderHeight(width)
  return (
    <div
      className={classnames({ hidden: height <= 0 }, `mt-2 lg:mt-8`)}
      style={{ height: `${height}px` }}
    >
      <div>
        {data.length > 0 ? (
          <TickerList
            count={count}
            fetchMore={fetchMore}
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
