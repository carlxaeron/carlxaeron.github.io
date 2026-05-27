import { AnimationDown, AnimationFade, AnimationUp } from "../../components/Animations";

function V3Home({ onNavigate }) {
  return (
    <section
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
            Senior Full-Stack Engineer · AI Integration Specialist
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
            12+ years delivering secure, scalable applications for banks, media companies &amp; enterprises.
            ReactJS · Laravel · OpenAI · Flutter
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
