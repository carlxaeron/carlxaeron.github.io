import { render, act } from "@testing-library/react";
import useSwipeHandler from "./SwipeHandler";

function SwipeTestHarness({ options }) {
  const ref = useSwipeHandler(options);
  return (
    <div ref={ref} data-testid="swipe-root">
      <div className="v3-scrollable" data-testid="inner-scrollable">
        Scrollable content
      </div>
    </div>
  );
}

function fireTouchSequence(container, { startY, endY, scrollTopMoves }) {
  const scrollable = container.querySelector(".v3-scrollable");
  const touchTarget = scrollTopMoves ? scrollable : container;

  if (scrollTopMoves) {
    Object.defineProperty(scrollable, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scrollable, "clientHeight", {
      configurable: true,
      value: 300,
    });
    Object.defineProperty(scrollable, "scrollTop", {
      configurable: true,
      writable: true,
      value: scrollTopMoves.before,
    });
  }

  act(() => {
    touchTarget.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [{ clientY: startY }],
      })
    );
  });

  if (scrollTopMoves) {
    Object.defineProperty(scrollable, "scrollTop", {
      configurable: true,
      writable: true,
      value: scrollTopMoves.after,
    });
    act(() => {
      touchTarget.dispatchEvent(
        new TouchEvent("touchmove", {
          bubbles: true,
          cancelable: true,
          touches: [{ clientY: (startY + endY) / 2 }],
        })
      );
    });
  }

  act(() => {
    touchTarget.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        changedTouches: [{ clientY: endY }],
      })
    );
  });
}

describe("useSwipeHandler", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("fires onSwipe when delta exceeds threshold and shouldAllowSwipe passes", () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeTestHarness
        options={{
          threshold: 50,
          touchThrottleMs: 0,
          shouldAllowSwipe: () => true,
          onSwipe,
        }}
      />
    );

    fireTouchSequence(getByTestId("swipe-root"), { startY: 200, endY: 100 });
    expect(onSwipe).toHaveBeenCalledTimes(1);
    expect(onSwipe).toHaveBeenCalledWith(
      expect.objectContaining({ direction: "up", deltaY: 100 })
    );
  });

  test("does not fire when shouldAllowSwipe returns false", () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeTestHarness
        options={{
          threshold: 50,
          touchThrottleMs: 0,
          shouldAllowSwipe: () => false,
          onSwipe,
        }}
      />
    );

    fireTouchSequence(getByTestId("swipe-root"), { startY: 200, endY: 100 });
    expect(onSwipe).not.toHaveBeenCalled();
  });

  test("respects touchThrottleMs between consecutive swipes", () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeTestHarness
        options={{
          threshold: 50,
          touchThrottleMs: 400,
          shouldAllowSwipe: () => true,
          onSwipe,
        }}
      />
    );

    const root = getByTestId("swipe-root");
    fireTouchSequence(root, { startY: 200, endY: 100 });
    fireTouchSequence(root, { startY: 200, endY: 100 });
    expect(onSwipe).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(400);
    });
    fireTouchSequence(root, { startY: 200, endY: 100 });
    expect(onSwipe).toHaveBeenCalledTimes(2);
  });

  test("does not fire section swipe when inner scrollTop changed and more room remains", () => {
    const onSwipe = jest.fn();
    const { getByTestId } = render(
      <SwipeTestHarness
        options={{
          threshold: 50,
          touchThrottleMs: 0,
          shouldAllowSwipe: () => true,
          onSwipe,
        }}
      />
    );

    const scrollable = getByTestId("inner-scrollable");
    Object.defineProperty(scrollable, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scrollable, "clientHeight", { configurable: true, value: 300 });

    fireTouchSequence(getByTestId("swipe-root"), {
      startY: 200,
      endY: 100,
      scrollTopMoves: { before: 100, after: 150 },
    });

    expect(onSwipe).not.toHaveBeenCalled();
  });
});
