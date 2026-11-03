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

export type RoastCountdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isRoastDay: boolean;
  totalSeconds: number;
};

/**
 * Cutoff time for weekly Tuesday roast dispatches is Tuesday at 14:00 (2:00 PM) Dhaka time.
 * Calculates the exact UTC Date of the target deadline.
 */
export function getNextRoastTarget(now: Date, timeZone: string = 'Asia/Dhaka'): Date {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const val = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? '0');

  const year = val('year');
  const month = val('month');
  const day = val('day');
  const hour = val('hour');

  const d = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = d.getUTCDay(); // 0 = Sun, 1 = Mon, 2 = Tue...

  let daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
  // If today is Tuesday but already past cutoff (14:00), target is next Tuesday
  if (daysUntilTuesday === 0 && hour >= 14) {
    daysUntilTuesday = 7;
  }

  // 14:00 Dhaka time (UTC+6) is 08:00 UTC
  return new Date(Date.UTC(year, month - 1, day + daysUntilTuesday, 8, 0, 0, 0));
}

export function getRoastCountdown(now: Date, timeZone: string = 'Asia/Dhaka'): RoastCountdown {
  const target = getNextRoastTarget(now, timeZone);
  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    isRoastDay: days === 0,
    totalSeconds,
  };
}
