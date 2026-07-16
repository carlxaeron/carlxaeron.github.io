import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SectionTitle from "../../components/SectionTitle";
import { usePortfolioSection } from "../../config/PortfolioContentContext";
import { ABOUT_DEFAULTS } from "../../config/portfolioContentDefaults";

function V3About({ isActive }) {
  const [show, setShow] = useState(false);
  const about = usePortfolioSection("about") || ABOUT_DEFAULTS;
  const paragraphs = about.paragraphs || ABOUT_DEFAULTS.paragraphs;
  const skillTags = about.skillTags || ABOUT_DEFAULTS.skillTags;
  const stats = about.stats || ABOUT_DEFAULTS.stats;

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
                {about.heading || ABOUT_DEFAULTS.heading}
              </h3>
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  style={{
                    color:
                      index === 0
                        ? "rgba(212,233,226,0.85)"
                        : index === 1
                          ? "rgba(212,233,226,0.75)"
                          : "rgba(212,233,226,0.65)",
                    lineHeight: 1.8,
                    fontSize: index === 2 ? "0.875rem" : index === 0 ? "0.95rem" : "0.9rem",
                    marginBottom: "1rem",
                  }}
                >
                  {paragraph}
                </p>
              ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {skillTags.map((tech) => (
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

        <animated.div style={statsSpring} className="v3-stats mt-4 mt-md-5">
          {stats.map((stat) => (
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
