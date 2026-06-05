import { useState, useEffect, useRef } from 'react';

/**
 * Custom React hook that implements Intersection Observer for native lazy loading behavior.
 * Pre-loads the image when it is within 150px of entering the viewport.
 */
export function useLazyLoadImage(src: string) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '150px 0px 150px 0px', // Load ahead by 150px
        threshold: 0.01,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return [elementRef, shouldLoad] as const;
}
