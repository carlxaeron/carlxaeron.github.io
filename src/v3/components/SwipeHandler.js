import { useRef, useCallback, useEffect } from "react";

/**
 * Returns a ref to attach to the slide container.
 * Fires onSwipeUp (swipe finger up → next section)
 * and onSwipeDown (swipe finger down → prev section)
 * when the vertical delta exceeds `threshold` (default 50px).
 */
function useSwipeHandler({ onSwipeUp, onSwipeDown, threshold = 50 }) {
  const ref = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(deltaY) < threshold) return;
      if (isSwiping.current) return;
      isSwiping.current = true;

      if (deltaY > 0) {
        onSwipeUp?.(); // finger moved up → next section
      } else {
        onSwipeDown?.(); // finger moved down → prev section
      }
    },
    [onSwipeUp, onSwipeDown, threshold]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return ref;
}

export default useSwipeHandler;
