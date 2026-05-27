import { useSpring, animated } from "@react-spring/web";

function AnimationDown({ children, delay = 0 }) {
  const springs = useSpring({
    from: { y: -40, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay,
    config: { tension: 260, friction: 28 },
  });
  return <animated.div style={springs}>{children}</animated.div>;
}

function AnimationUp({ children, delay = 0 }) {
  const springs = useSpring({
    from: { y: 40, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay,
    config: { tension: 260, friction: 28 },
  });
  return <animated.div style={springs}>{children}</animated.div>;
}

function AnimationFade({ children, delay = 0 }) {
  const springs = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay,
    config: { tension: 200, friction: 30 },
  });
  return <animated.div style={springs}>{children}</animated.div>;
}

function AnimationScale({ children, delay = 0 }) {
  const springs = useSpring({
    from: { scale: 0.85, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay,
    config: { tension: 280, friction: 24 },
  });
  return <animated.div style={springs}>{children}</animated.div>;
}

function AnimationSlideLeft({ children, delay = 0 }) {
  const springs = useSpring({
    from: { x: 60, opacity: 0 },
    to: { x: 0, opacity: 1 },
    delay,
    config: { tension: 260, friction: 28 },
  });
  return <animated.div style={springs}>{children}</animated.div>;
}

function AnimationSlideRight({ children, delay = 0 }) {
  const springs = useSpring({
    from: { x: -60, opacity: 0 },
    to: { x: 0, opacity: 1 },
    delay,
    config: { tension: 260, friction: 28 },
  });
  return <animated.div style={springs}>{children}</animated.div>;
}

export {
  AnimationDown,
  AnimationUp,
  AnimationFade,
  AnimationScale,
  AnimationSlideLeft,
  AnimationSlideRight,
};
