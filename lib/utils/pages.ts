import { MARKET_INDEX } from 'lib/const';

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
