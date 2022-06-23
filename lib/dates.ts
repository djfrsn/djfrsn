import moment, { Moment } from 'moment';
import momentBusinessDays from 'moment-business-days';

export function today(): moment.Moment {
  return moment.utc()
}

today.isoString = today().toISOString()

export function getPreviousBusinessDay(): string {
  return momentBusinessDays()
    .utcOffset(0)
    .startOf('day')
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .prevBusinessDay()
    .toISOString()
}

export function isSameDay(date: Moment | Date): boolean {
  if (!date) return false
  if (!moment.isMoment(date)) date = moment(date)

  return date.isSame(today.isoString, 'day')
}