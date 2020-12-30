import moment from 'moment-timezone';

export enum Days {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };

export function getNextSpecifiedDayUtc(day = Days.FRIDAY, time = midnight): moment.Moment {
  const nextDay = moment().day(day).set(time);
  return ((moment() > nextDay) ? nextDay.add(1, 'weeks') : nextDay).utc();
}

export function getYearsSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 3.15576e+10);
}
