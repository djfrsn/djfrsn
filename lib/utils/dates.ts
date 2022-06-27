import moment, { Moment } from 'moment';
import momentBusinessDays from 'moment-business-days';

export const momentBusiness = momentBusinessDays

export function today(): moment.Moment {
  return normalizeDate(moment.utc())
}

export function normalizeDate(
  date: moment.Moment | Date | string
): moment.Moment {
  const zero = val =>
    val.utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  return moment.isMoment(date) ? zero(date) : zero(moment(date))
}

export function getPreviousBusinessDay(): moment.Moment {
  return normalizeDate(momentBusinessDays()).prevBusinessDay()
}

export function getMostRecentBusinessDay(): moment.Moment {
  const _today = today()
  return momentBusinessDays(_today).isBusinessDay()
    ? _today
    : getPreviousBusinessDay()
}

export function isSameDay(date: Moment | Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(today(), 'day')
}

export function isLatestBusinessDay(date: Moment | Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(getMostRecentBusinessDay(), 'day')
}
