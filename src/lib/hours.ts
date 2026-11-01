/**
 * Opening-hours arithmetic for the tasting room.
 *
 * The prose in `SITE.hours` is what renders; this module exists so the
 * "open now" status is derived from numbers instead of parsed back out of
 * that sentence. Every calculation happens in the roastery's own timezone,
 * because a visitor in London must not read Dhaka's clock.
 */

export type OpeningHours = {
  /** Local hour the room opens, 24-hour. */
  opensAt: number;
  /** Local hour the room closes, 24-hour. */
  closesAt: number;
  /** IANA zone of the roastery. */
  timeZone: string;
};

export type OpenStatus = {
  open: boolean;
  /** Ready to render: `Open now · closes 9:00 PM` or `Closed · opens 8:00 AM`. */
  label: string;
};

/** `21` → `9:00 PM`, `8` → `8:00 AM`. */
export function formatClockHour(hour24: number): string {
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const suffix = hour24 < 12 ? 'AM' : 'PM';
  return `${hour12}:00 ${suffix}`;
}

/** Local hour-of-day in the given zone, as a decimal hour. */
function localHour(now: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  return hour + minute / 60;
}

export function getOpenStatus(now: Date, hours: OpeningHours): OpenStatus {
  const hour = localHour(now, hours.timeZone);
  const open = hour >= hours.opensAt && hour < hours.closesAt;

  return {
    open,
    label: open
      ? `Open now · closes ${formatClockHour(hours.closesAt)}`
      : `Closed · opens ${formatClockHour(hours.opensAt)}`,
  };
}

/**
 * The next Tuesday, as `Tuesday 3 November` — the date on the roast stamp.
 *
 * Reads the calendar day in the roastery's zone, so a visitor in another
 * timezone never sees yesterday's date. On a Tuesday the roast is today.
 */
export function nextRoastLabel(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? '0');

  const local = new Date(Date.UTC(value('year'), value('month') - 1, value('day')));
  const daysUntilTuesday = (2 - local.getUTCDay() + 7) % 7;
  local.setUTCDate(local.getUTCDate() + daysUntilTuesday);

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(local);
}
