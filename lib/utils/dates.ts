import moment, { Moment } from 'moment';
import momentBusinessDays from 'moment-business-days';

export function today(): moment.Moment {
  return moment.utc()
}

today.isoString = today().toISOString()

export function zeroDate(date: moment.Moment | string) {
  const zero = val =>
    val
      .utcOffset(0)
      .startOf('day')
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  return moment.isMoment(date) ? zero(date) : zero(moment(date))
}

export function getPreviousBusinessDay(): string {
  return zeroDate(momentBusinessDays()).prevBusinessDay().toISOString()
}

export function isSameDay(date: Moment | Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(today.isoString, 'day')
}
