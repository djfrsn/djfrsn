import { MARKET_INDEX, SCREENS } from 'lib/const';

export function getMarketPageOptions(routerQuery) {
  const indexLimit = Number(process.env.NEXT_PUBLIC_INDEX_LIMIT)
  const limitQuery = routerQuery.limit ? Number(routerQuery.limit) : indexLimit
  const marketName = routerQuery.name || MARKET_INDEX.sp500
  const timeSeriesLimitQuery = routerQuery.days
  const limit = limitQuery > indexLimit ? indexLimit : limitQuery
  const bypassTimeSeriesLimit =
    limit <= Number(process.env.NEXT_PUBLIC_INDEX_TIME_SERIES_BYPASS_LIMIT)
  let timeSeriesLimit = timeSeriesLimitQuery
    ? Number(timeSeriesLimitQuery)
    : Number(process.env.NEXT_PUBLIC_INDEX_TIME_SERIES_LIMIT_DEFAULT)
  timeSeriesLimit =
    timeSeriesLimit > Number(process.env.NEXT_PUBLIC_INDEX_TIME_SERIES_LIMIT) &&
    !bypassTimeSeriesLimit
      ? Number(process.env.NEXT_PUBLIC_INDEX_TIME_SERIES_LIMIT)
      : timeSeriesLimit

  return { marketName, limit, timeSeriesLimit, bypassTimeSeriesLimit }
}

const screenToNum = val => Number(val.replace('px', ''))

export const getHeaderHeight = width => {
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

export const getTickerColumnCount = (width, timeSeriesLength) => {
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
