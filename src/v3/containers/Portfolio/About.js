import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SectionTitle from "../../components/SectionTitle";

const STATS = [
  { value: "12+", label: "Years Experience" },
  { value: "10+", label: "Companies" },
  { value: "50+", label: "Projects" },
  { value: "2", label: "Side Projects Shipped" },
];

function V3About({ isActive }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, [isActive]);

  const imgSpring = useSpring({
    from: { opacity: 0, x: -40 },
    to: { opacity: show ? 1 : 0, x: show ? 0 : -40 },
    config: { tension: 220, friction: 28 },
  });

  const textSpring = useSpring({
    from: { opacity: 0, x: 40 },
    to: { opacity: show ? 1 : 0, x: show ? 0 : 40 },
    delay: 150,
    config: { tension: 220, friction: 28 },
  });

  const statsSpring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: show ? 1 : 0, y: show ? 0 : 30 },
    delay: 300,
    config: { tension: 220, friction: 28 },
  });

  return (
    <section
      id="about"
      className="v3-section-body"
      style={{ background: "#1E3932", height: "100%", overflow: "hidden" }}
    >
      <div className="v3-inner v3-scrollable v3-section-scroll" data-testid="about-scrollable">
        <SectionTitle accent="Us">About</SectionTitle>

        <div className="row align-items-center">
          {/* Profile image */}
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <animated.div style={imgSpring}>
              <div className="v3-profile-avatar">
                <img
                  src="/static/images/profile3.jpg"
                  alt="Carl Louis Manuel"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            </animated.div>
          </div>

          {/* Bio */}
          <div className="col-md-8">
            <animated.div style={textSpring}>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                  color: "#ffffff",
                  marginBottom: "1rem",
                }}
              >
                I&apos;m Carl Louis Manuel
              </h3>
              <p style={{ color: "rgba(212,233,226,0.85)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1rem" }}>
                I build AI-powered applications and production-grade software that enterprises actually ship.
                With 12+ years across banking, media, and technology — I&apos;ve led full-stack delivery at
                Metrobank, ABS-CBN, and GoAutoDial, integrating AI features that solve real business problems.
              </p>
              <p style={{ color: "rgba(212,233,226,0.75)", lineHeight: 1.8, fontSize: "0.9rem", marginBottom: "1rem" }}>
                My stack spans pixel-perfect ReactJS frontends, secure PHP/Laravel backends, Firebase real-time
                systems, and OpenAI API integrations in live client-facing products. At Metrobank I helped
                deliver secure banking interfaces across multiple modules. At GoAutoDial I led a full
                legacy-to-modern migration — jQuery/PHP rewritten into a React/Laravel platform — that cut
                bug reports and improved agent productivity. At ABS-CBN I built 3 complete web properties
                from scratch serving millions of visitors.
              </p>
              <p style={{ color: "rgba(212,233,226,0.65)", lineHeight: 1.8, fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Beyond client work, I ship independently — including{" "}
                <strong style={{ color: "#D4E9E2" }}>Tahanan</strong>, a community SaaS live in the
                Philippines. Whether you need
                enterprise-grade engineering or AI woven into your product, I bring the depth and
                discipline to do it right.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["OpenAI API", "AI Integration", "LLM Apps", "SaaS", "ReactJS", "Laravel", "Flutter", "Firebase", "Vue", "PHP", "Node.js"].map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: "0.75rem",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      background: "rgba(0,168,98,0.15)",
                      color: "#00A862",
                      fontWeight: 500,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </animated.div>
          </div>
        </div>

        {/* Stats bar */}
        <animated.div style={statsSpring} className="v3-stats mt-4 mt-md-5">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="v3-stats__value">{stat.value}</div>
              <div className="v3-stats__label">{stat.label}</div>
            </div>
          ))}
        </animated.div>
      </div>
    </section>
  );
}

export default V3About;
