import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Ambient hero film playback.
 *
 * Plays only when the clip is on screen, the tab is visible, and the user has
 * not asked for reduced motion. Browsers can defer autoplay (low-power mode,
 * data saver, policy), so playback is retried on `canplay` and on the first
 * pointer or key gesture.
 */
export function useHeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inView = useRef(true);
  const reduced = usePrefersReducedMotion();

  const sync = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!reduced && inView.current && !document.hidden) {
      video.play().catch(() => {
        /* autoplay refusal is expected and handled by the gesture retry */
      });
    } else {
      video.pause();
    }
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced) {
      video.removeAttribute('autoplay');
      video.pause();
    }

    const onCanPlay = () => sync();
    video.addEventListener('canplay', onCanPlay);

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView.current = entry.isIntersecting;
            sync();
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(video);
    }

    document.addEventListener('visibilitychange', sync);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('visibilitychange', sync);
      observer?.disconnect();
    };
  }, [reduced, sync]);

  useEffect(() => {
    const resume = () => sync();
    window.addEventListener('pointerdown', resume, { once: true, passive: true });
    window.addEventListener('keydown', resume, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
  }, [sync]);

  return videoRef;
}
