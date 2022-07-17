import momentBusiness from 'moment-business-days';
import moment from 'moment-timezone';

moment.tz.setDefault('America/New_York')

var july4th = '07-04-2011'
var laborDay = '09-05-2011'
// FIXME: add all federal holidays to fix market page date range calc - https://www.npmjs.com/package/@18f/us-federal-holidays
moment.updateLocale('us', {
  holidays: [july4th, laborDay],
  holidayFormat: 'MM-DD-YYYY',
})

export { moment, momentBusiness }

type _Date = moment.Moment | Date

export function startOfToday(): moment.Moment {
  return normalizeDate(moment())
}

export function normalizeDate(
  date: moment.Moment | Date | string
): moment.Moment {
  const zero = (val: moment.Moment) =>
    val.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

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
 * Subtract x # of days from current day, and return latest day
 * @constructor
 */
export function timeAgo(
  days: momentBusiness.DurationInputArg1,
  options?: {
    nextBusinessDay: boolean
    unit: momentBusiness.unitOfTime.DurationConstructor
  }
): moment.Moment {
  const { nextBusinessDay = false, unit = 'days' } = options || {}
  const timeAgo = momentBusiness().subtract(days, unit)

  return nextBusinessDay ? timeAgo.nextBusinessDay().utc() : timeAgo.utc()
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
 * Return true if current time is after 5pm EST
 * @constructor
 */
export function withinMarketRefreshWindow(): boolean {
  const marketCloseTime = getMarketCloseTime().add({ hour: 1 })

  return moment().isAfter(marketCloseTime)
}

/**
 * Return true if given time is before the market close time
 * @constructor
 */
export function beforeMarketCloseTime(date: _Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isBefore(getMarketCloseTime())
}

export function isSameDay(date: _Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(startOfToday(), 'day')
}

export function isLatestBusinessDay(date: _Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(getMostRecentBusinessDay(), 'day')
}

export const format = {
  standard: 'M/D/Y',
  standardShort: 'M/D/YY',
  standardFMP: 'YYYY-MM-DD',
}

export const minutesToMilliseconds = (numOfMinutes: number): number =>
  1000 * 60 * numOfMinutes
