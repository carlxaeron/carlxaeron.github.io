import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SectionTitle from "../../components/SectionTitle";

const STATS = [
  { value: "12+", label: "Years Experience" },
  { value: "10+", label: "Companies" },
  { value: "50+", label: "Projects" },
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
      className="v3-section-body v3-scrollable"
      style={{ background: "#1E3932", height: "100%", overflow: "hidden" }}
    >
      <div className="v3-inner">
        <SectionTitle accent="Us">About</SectionTitle>

        <div
          className="row align-items-center"
          style={{ flex: 1 }}
        >
          {/* Profile image */}
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <animated.div style={imgSpring}>
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto",
                  border: "4px solid #00A862",
                  boxShadow: "0 0 40px rgba(0,168,98,0.25)",
                }}
              >
                <img
                  src="/static/images/profile3.jpg"
                  alt="Carl Louis Manuel"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                A Senior Full-Stack Engineer with 12+ years of experience architecting and delivering
                production-grade web and mobile applications for enterprises across banking, media, and
                technology sectors.
              </p>
              <p style={{ color: "rgba(212,233,226,0.75)", lineHeight: 1.8, fontSize: "0.9rem", marginBottom: "1rem" }}>
                My work spans the full stack: from pixel-perfect ReactJS frontends to secure PHP/Laravel
                backends, Firebase real-time systems, and AI-powered features using OpenAI&apos;s API. I&apos;ve built
                banking applications at Metrobank, modernized legacy call-center systems at GoAutoDial, and
                created responsive digital experiences for ABS-CBN&apos;s properties.
              </p>
              <p style={{ color: "rgba(212,233,226,0.65)", lineHeight: 1.8, fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                I don&apos;t just write code — I architect solutions that scale, stay secure under load, and deliver
                measurable business outcomes. Whether you&apos;re building an enterprise platform or integrating AI
                into your product, I bring the depth and discipline to do it right.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {["ReactJS", "Vue", "PHP", "Laravel", "Node.js", "Flutter", "Firebase", "OpenAI", "AI Integration", "LLM Apps"].map((tech) => (
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
