import { useRef, useCallback, useEffect } from "react";

/**
 * Returns a ref to attach to the slide container.
 * Fires onSwipe / onSwipeUp / onSwipeDown when vertical delta exceeds threshold.
 * Respects inner .v3-scrollable scroll and optional shouldAllowSwipe predicate.
 */
function useSwipeHandler({
  onSwipe,
  onSwipeUp,
  onSwipeDown,
  shouldAllowSwipe,
  threshold = 50,
  touchThrottleMs = 400,
}) {
  const ref = useRef(null);
  const touchStartY = useRef(null);
  const lastSwipeAt = useRef(0);
  const gestureScrollable = useRef(null);
  const gestureStartScrollTop = useRef(null);
  const didScrollInner = useRef(false);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    didScrollInner.current = false;

    const elementTarget =
      e.target instanceof Element ? e.target : e.target?.parentElement;
    const closestScrollable = elementTarget?.closest?.(".v3-scrollable") ?? null;
    const root = ref.current;
    let scrollable = closestScrollable;
    if (
      scrollable &&
      scrollable.scrollHeight - scrollable.clientHeight <= 0 &&
      root
    ) {
      const overflowScrollable = root.querySelectorAll(".v3-scrollable");
      for (const el of overflowScrollable) {
        if (el.scrollHeight - el.clientHeight > 0) {
          scrollable = el;
          break;
        }
      }
    }
    gestureScrollable.current = scrollable;
    gestureStartScrollTop.current = scrollable ? scrollable.scrollTop : null;
  }, []);

  const handleTouchMove = useCallback(() => {
    const scrollable = gestureScrollable.current;
    if (!scrollable || gestureStartScrollTop.current === null) return;
    if (Math.abs(scrollable.scrollTop - gestureStartScrollTop.current) > 1) {
      didScrollInner.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      const scrollable = gestureScrollable.current;
      gestureScrollable.current = null;
      gestureStartScrollTop.current = null;

      if (Math.abs(deltaY) < threshold) return;

      const direction = deltaY > 0 ? "up" : "down";
      const absDeltaY = Math.abs(deltaY);

      // If the gesture scrolled inner content, block section swipe while more scroll room exists.
      if (didScrollInner.current && scrollable) {
        const maxScrollTop = scrollable.scrollHeight - scrollable.clientHeight;
        if (maxScrollTop > 0) {
          const currentTop = scrollable.scrollTop;
          if (direction === "up" && currentTop < maxScrollTop - 1) return;
          if (direction === "down" && currentTop > 1) return;
        }
      }

      const now = Date.now();
      if (now - lastSwipeAt.current < touchThrottleMs) return;

      const swipeContext = { direction, deltaY: absDeltaY, event: e };
      if (shouldAllowSwipe && !shouldAllowSwipe(swipeContext)) return;

      lastSwipeAt.current = now;
      didScrollInner.current = false;

      onSwipe?.(swipeContext);
      if (direction === "up") {
        onSwipeUp?.(swipeContext);
      } else {
        onSwipeDown?.(swipeContext);
      }
    },
    [
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      shouldAllowSwipe,
      threshold,
      touchThrottleMs,
    ]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return ref;
}

export default useSwipeHandler;
