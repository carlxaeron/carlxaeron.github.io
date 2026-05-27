import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { EXPERIENCES } from "../../../external-config";
import SectionTitle from "../../components/SectionTitle";

function ExperienceItem({ exp, index, isActive }) {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const descRef = useRef(null);
  const [fullHeight, setFullHeight] = useState("0px");
  const COLLAPSED_HEIGHT = 80;

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setShow(true), 120 + index * 70);
    return () => clearTimeout(t);
  }, [isActive, index]);

  useEffect(() => {
    if (descRef.current) {
      setFullHeight(`${descRef.current.scrollHeight}px`);
    }
  }, [show]);

  const itemSpring = useSpring({
    from: { opacity: 0, x: -30 },
    to: { opacity: show ? 1 : 0, x: show ? 0 : -30 },
    config: { tension: 220, friction: 28 },
  });

  const descSpring = useSpring({
    maxHeight: expanded ? fullHeight : `${COLLAPSED_HEIGHT}px`,
    config: { tension: 200, friction: 30 },
  });

  const isTruncatable = descRef.current
    ? descRef.current.scrollHeight > COLLAPSED_HEIGHT + 10
    : false;

  return (
    <animated.div className="v3-timeline-item" style={itemSpring}>
      <div className="v3-timeline-item__dot" aria-hidden="true" />

      <div className="v3-timeline-item__header">
        {exp.companyLogo ? (
          <img
            className="v3-timeline-item__logo"
            src={exp.companyLogo}
            alt={exp.companyName}
            loading="lazy"
          />
        ) : (
          <div
            className="v3-timeline-item__logo"
            style={{
              background: "#00473e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.65rem",
              color: "#00A862",
              textAlign: "center",
              padding: "4px",
            }}
          >
            {exp.companyName?.charAt(0)}
          </div>
        )}
        <div>
          <div className="v3-timeline-item__company">{exp.companyName}</div>
          <div className="v3-timeline-item__date">{exp.dateRange}</div>
        </div>
      </div>

      <div className="v3-timeline-item__title">{exp.jobTitle}</div>

      {exp.skills?.length > 0 && (
        <div className="v3-timeline-item__skills">
          {exp.skills.map((s) => (
            <span key={s} className="v3-timeline-item__skill-tag">{s}</span>
          ))}
        </div>
      )}

      <animated.div
        className="v3-timeline-item__desc"
        style={{ overflow: "hidden", ...descSpring }}
        ref={descRef}
        dangerouslySetInnerHTML={{ __html: exp.jobDescription }}
      />

      {isTruncatable && (
        <button
          type="button"
          className="v3-timeline-item__toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less ↑" : "View more ↓"}
        </button>
      )}
    </animated.div>
  );
}

function V3Experience({ isActive }) {
  const containerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: isActive ? 1 : 0 },
    delay: 50,
    config: { tension: 200, friction: 30 },
  });

  return (
    <section
      id="experience"
      className="v3-section-body v3-scrollable"
      style={{ background: "#1E3932", height: "100%", overflow: "hidden" }}
    >
      <div className="v3-inner">
        <SectionTitle subtitle="My professional journey">Experience</SectionTitle>

        <animated.div
          className="v3-timeline v3-scrollable"
          style={{
            ...containerSpring,
            overflowY: "auto",
            maxHeight: "calc(100vh - 200px)",
            paddingRight: "0.5rem",
          }}
        >
          {EXPERIENCES.map((exp, i) => (
            <ExperienceItem
              key={`${exp.companyName}-${i}`}
              exp={exp}
              index={i}
              isActive={isActive}
            />
          ))}
        </animated.div>
      </div>
    </section>
  );
}

export default V3Experience;
