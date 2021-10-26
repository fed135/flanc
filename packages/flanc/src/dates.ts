import { DateTime } from 'luxon';

export const midnight = { hour: 0, minute: 0, second: 0, millisecond: 0 };

export function setTimezone(timezone: string) {
  process.env.TZ = timezone;
}

export function getTZDateFromUTC(date: Date, timezone?: string): Date {
  return DateTime.fromJSDate(date).setZone(timezone || process.env.TZ);
}

export function getUTCFromTZDate(date: Date, timezone?: string) {
  return DateTime.fromJSDate(date, { zone: timezone }).toUTC();
}

export function getYearsSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / 3.15576e+10);
}
