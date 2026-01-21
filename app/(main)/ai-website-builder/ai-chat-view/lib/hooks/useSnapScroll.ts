import { useRef, useCallback } from 'react';

export function useSnapScroll() {
  const autoScrollRef = useRef(true);
  const scrollNodeRef = useRef<HTMLDivElement | null>(null);
  const onScrollRef = useRef<(() => void) | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const messageRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new ResizeObserver(() => {
        // Always auto-scroll when content changes
        if (scrollNodeRef.current) {
          const { scrollHeight, clientHeight } = scrollNodeRef.current;
          const scrollTarget = scrollHeight - clientHeight;

          // Force scroll to bottom with smooth behavior
          scrollNodeRef.current.scrollTo({
            top: scrollTarget,
            behavior: 'smooth',
          });

          // Re-enable auto-scroll
          autoScrollRef.current = true;
        }
      });

      observer.observe(node);
      observerRef.current = observer;
    } else {
      observerRef.current?.disconnect();
      observerRef.current = null;
    }
  }, []);

  const scrollRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      onScrollRef.current = () => {
        const { scrollTop, scrollHeight, clientHeight } = node;
        const scrollTarget = scrollHeight - clientHeight;

        // Only disable auto-scroll if user manually scrolls up significantly
        autoScrollRef.current = Math.abs(scrollTop - scrollTarget) <= 10;
      };

      node.addEventListener('scroll', onScrollRef.current);

      scrollNodeRef.current = node;
    } else {
      if (onScrollRef.current) {
        scrollNodeRef.current?.removeEventListener(
          'scroll',
          onScrollRef.current
        );
      }

      scrollNodeRef.current = null;
      onScrollRef.current = null;
    }
  }, []);

  return [messageRef, scrollRef];
}
