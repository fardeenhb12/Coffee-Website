import { useEffect, useState } from 'react';
import { SITE } from '../config/site';
import { getOpenStatus, type OpenStatus } from '../lib/hours';

/**
 * Whether the Banani tasting room is open right now, in Dhaka's timezone.
 *
 * Computed once on mount and once after paint, so a tab restored from the
 * back/forward cache across closing time still reads correctly. No interval:
 * the page is not a kiosk, and a status that flips while a visitor reads it is
 * noise, not information.
 */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>(() =>
    getOpenStatus(new Date(), SITE.hoursDetail)
  );

  useEffect(() => {
    setStatus(getOpenStatus(new Date(), SITE.hoursDetail));
  }, []);

  return status;
}
