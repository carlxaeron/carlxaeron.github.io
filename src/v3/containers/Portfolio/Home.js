import { useEffect, useRef } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { AnimationDown, AnimationFade, AnimationUp } from "../../components/Animations";

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)")?.matches
  );
}

function useParallax(containerRef) {
  const reducedMotionRef = useRef(prefersReducedMotion());
  const gyroActiveRef = useRef(false);
  const gyroRequestedRef = useRef(false);
  const [{ px, py }, api] = useSpring(() => ({
    px: 0,
    py: 0,
    config: { tension: 60, friction: 20 },
  }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotionRef.current) return undefined;

    const setParallax = (nx, ny) => {
      api.start({
        px: Math.max(-1, Math.min(1, nx)),
        py: Math.max(-1, Math.min(1, ny)),
      });
    };

    const updateFromPointer = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
      setParallax(nx, ny);
    };

    const reset = () => api.start({ px: 0, py: 0 });

    const onOrientation = (e) => {
      if (!gyroActiveRef.current || e.gamma == null || e.beta == null) return;
      const nx = e.gamma / 30;
      const ny = (e.beta - 50) / 30;
      setParallax(nx, ny);
    };

    const enableGyro = async () => {
      if (gyroRequestedRef.current || typeof window === "undefined") return;
      gyroRequestedRef.current = true;

      if (typeof DeviceOrientationEvent === "undefined") return;

      try {
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const state = await DeviceOrientationEvent.requestPermission();
          if (state !== "granted") return;
        }
        gyroActiveRef.current = true;
        window.addEventListener("deviceorientation", onOrientation, true);
      } catch {
        gyroActiveRef.current = false;
      }
    };

    const onMouseMove = (e) => {
      if (!gyroActiveRef.current) updateFromPointer(e.clientX, e.clientY);
    };

    const onTouchStart = () => {
      if (isTouchDevice()) enableGyro();
    };

    const onTouchMove = (e) => {
      if (gyroActiveRef.current || !e.touches[0]) return;
      updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchEnd = () => {
      if (!gyroActiveRef.current) reset();
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", reset);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    if (isTouchDevice() && typeof DeviceOrientationEvent !== "undefined") {
      if (typeof DeviceOrientationEvent.requestPermission !== "function") {
        gyroActiveRef.current = true;
        window.addEventListener("deviceorientation", onOrientation, true);
      }
    }

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", reset);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [api, containerRef]);

  return { px, py };
}

function ParallaxShape({ px, py, depth, wrapClass, children }) {
  return (
    <animated.div
      className={`v3-shape-wrap ${wrapClass}`}
      style={{
        transform: to(
          [px, py],
          (x, y) => `translate(${x * depth}px, ${y * depth}px)`
        ),
      }}
    >
      {children}
    </animated.div>
  );
}

function HomeShapes({ px, py }) {
  return (
    <div className="v3-home-shapes" data-testid="home-shapes" aria-hidden="true">
      <ParallaxShape px={px} py={py} depth={8} wrapClass="v3-shape-wrap--orb-lg">
        <div className="v3-shape v3-shape--orb-lg" />
      </ParallaxShape>

      <ParallaxShape px={px} py={py} depth={18} wrapClass="v3-shape-wrap--ring">
        <div className="v3-shape v3-shape--ring" />
      </ParallaxShape>

      <ParallaxShape px={px} py={py} depth={14} wrapClass="v3-shape-wrap--gold">
        <div className="v3-shape v3-shape--gold" />
      </ParallaxShape>

      <ParallaxShape px={px} py={py} depth={28} wrapClass="v3-shape-wrap--orb-sm">
        <div className="v3-shape v3-shape--orb-sm" />
      </ParallaxShape>

      <ParallaxShape px={px} py={py} depth={10} wrapClass="v3-shape-wrap--hex">
        <div className="v3-shape v3-shape--hex">
          <svg viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="100,8 188,58 188,172 100,222 12,172 12,58"
              stroke="rgba(0,168,98,0.14)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </ParallaxShape>
    </div>
  );
}

function V3Home({ onNavigate }) {
  const sectionRef = useRef(null);
  const { px, py } = useParallax(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="v3-section-body"
      id="home"
      style={{
        background: "linear-gradient(135deg, #00473e 0%, #1E3932 60%, #0d2b23 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Decorative background pattern */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,168,98,0.08) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(203,162,88,0.05) 0%, transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      <HomeShapes px={px} py={py} />

      <div className="v3-inner" style={{ position: "relative", zIndex: 1, justifyContent: "center", textAlign: "left" }}>
        <AnimationFade delay={0}>
          <p style={{
            fontSize: "0.85rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#00A862",
            fontWeight: 600,
            marginBottom: "1rem",
          }}>
            Building AI-Powered Enterprise Applications
          </p>
        </AnimationFade>

        <AnimationDown delay={100}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 7vw, 5rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Carl Louis<br />
            <span style={{ color: "#00A862" }}>Manuel</span>
          </h1>
        </AnimationDown>

        <AnimationUp delay={250}>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
              color: "rgba(212,233,226,0.9)",
              maxWidth: "560px",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            12+ years architecting production-grade systems for banks, media companies &amp; enterprises — with AI built in.
            ReactJS · Laravel · OpenAI API · Firebase · Flutter
          </p>
        </AnimationUp>

        <AnimationUp delay={400}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="v3-btn v3-btn--primary"
              onClick={() => onNavigate?.(1)}
            >
              View My Work
            </button>
            <button
              type="button"
              className="v3-btn v3-btn--ghost"
              onClick={() => onNavigate?.(5)}
            >
              Get In Touch
            </button>
          </div>
        </AnimationUp>
      </div>

      {/* Bottom wave divider */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: "linear-gradient(to bottom, transparent, rgba(30,57,50,0.5))",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

export default V3Home;
