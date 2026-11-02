import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lots carousel controller.
 *
 * The track is a native horizontal scroller (`.products-grid`); this hook only
 * adds arrow buttons, the `01 / 07` indicator and the disabled edge states.
 * The stride is measured from the first rendered card plus the track's column
 * gap, so it stays correct when the CSS changes the card width at a breakpoint.
 *
 * Call it from the Lots section with the number of cards you actually rendered.
 */
export function useLotsCarousel(cardCount: number) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const getCardStride = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 380;

    const card = track.querySelector('.lot-card');
    if (!card) return 380;

    const cardWidth = card.getBoundingClientRect().width;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 28;

    return cardWidth + gap;
  }, []);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track || cardCount === 0) return;

    const stride = getCardStride();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const index = Math.min(
      cardCount,
      Math.max(1, Math.round(track.scrollLeft / stride) + 1)
    );

    setCurrentIndex(index);
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= maxScroll - 6);
  }, [cardCount, getCardStride]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame: number | null = null;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [update]);

  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: direction * getCardStride(), behavior: 'smooth' });
    },
    [getCardStride]
  );

  return {
    trackRef,
    currentIndex,
    atStart,
    atEnd,
    previous: () => scrollByCard(-1),
    next: () => scrollByCard(1),
  };
}
