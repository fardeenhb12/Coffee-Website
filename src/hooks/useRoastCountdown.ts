import { useEffect, useState } from 'react';
import { SITE } from '../config/site';
import { getRoastCountdown, type RoastCountdown } from '../lib/hours';

/**
 * Live countdown to the weekly Tuesday 2:00 PM roast dispatch cutoff in Banani (Asia/Dhaka).
 * Ticks every 1000ms.
 */
export function useRoastCountdown(): RoastCountdown {
  const [countdown, setCountdown] = useState<RoastCountdown>(() =>
    getRoastCountdown(new Date(), SITE.hoursDetail.timeZone)
  );

  useEffect(() => {
    setCountdown(getRoastCountdown(new Date(), SITE.hoursDetail.timeZone));

    const timer = setInterval(() => {
      setCountdown(getRoastCountdown(new Date(), SITE.hoursDetail.timeZone));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return countdown;
}
