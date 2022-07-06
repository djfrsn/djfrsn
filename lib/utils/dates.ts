import momentBusiness from 'moment-business-days';
import moment from 'moment-timezone';

moment.tz.setDefault('America/New_York')

export { moment, momentBusiness }

export function startOfToday(): moment.Moment {
  return normalizeDate(moment())
}

export function normalizeDate(
  date: moment.Moment | Date | string
): moment.Moment {
  const zero = val => val.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  return moment.isMoment(date) ? zero(date) : zero(moment(date))
}

export function getPreviousBusinessDay(): moment.Moment {
  return normalizeDate(momentBusiness()).prevBusinessDay()
}

export function getMostRecentBusinessDay(): moment.Moment {
  const _today = startOfToday()
  return momentBusiness(_today).isBusinessDay()
    ? _today
    : getPreviousBusinessDay()
}

/**
 * Get US stock market closing time = 4pm EST of most recent business day
 * @constructor
 */
export function getMarketCloseTime(): moment.Moment {
  const mostRecentBusinessDay = getMostRecentBusinessDay()

  return mostRecentBusinessDay.set({ hour: 16 })
}

/**
 * Add buffer to US stock market close to allow FMP to add new data to DB
 * @constructor
 */
export function getMarketRefreshCutoffTime(): moment.Moment {
  const marketCloseTime = getMarketCloseTime()

  return marketCloseTime.add({ hour: 1 })
}

/**
 * Refresh market after 5pm EST
 * @constructor
 */
export function shouldRefreshMarket(): boolean {
  return moment().isAfter(getMarketRefreshCutoffTime())
}

export function isSameDay(date: moment.Moment | Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(startOfToday(), 'day')
}

export function isLatestBusinessDay(date: moment.Moment | Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(getMostRecentBusinessDay(), 'day')
}
