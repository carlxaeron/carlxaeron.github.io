import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { SKILLS } from "../../../external-config";
import SectionTitle from "../../components/SectionTitle";

// Split SKILLS into groups based on `parent: true` entries
function groupSkills(skills) {
  const groups = [];
  let current = null;
  skills.forEach((skill) => {
    if (skill.parent) {
      current = { name: skill.name, skills: [skill] };
      groups.push(current);
    } else if (current) {
      current.skills.push(skill);
    } else {
      // Skills before any parent — put in "Other"
      if (!groups.length || groups[groups.length - 1].name !== "Other") {
        current = { name: "Other", skills: [] };
        groups.push(current);
      }
      current.skills.push(skill);
    }
  });
  return groups;
}

const SKILL_GROUPS = groupSkills(SKILLS);

function SkillBar({ skill, delay, show }) {
  const fillSpring = useSpring({
    from: { width: "0%" },
    to: { width: show ? `${skill.percentage}%` : "0%" },
    delay: delay,
    config: { tension: 120, friction: 24 },
  });

  const wrapSpring = useSpring({
    from: { opacity: 0, y: 10 },
    to: { opacity: show ? 1 : 0, y: show ? 0 : 10 },
    delay: delay,
    config: { tension: 220, friction: 28 },
  });

  return (
    <animated.div className="v3-skill-bar" style={wrapSpring}>
      <div className="v3-skill-bar__label">
        <span>{skill.name}</span>
        <span>{skill.experience}yr{Number(skill.experience) > 1 ? "s" : ""} · {skill.percentage}%</span>
      </div>
      <div className="v3-skill-bar__track">
        <animated.div className="v3-skill-bar__fill" style={fillSpring} />
      </div>
    </animated.div>
  );
}

function V3Skills({ isActive }) {
  const [show, setShow] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, [isActive]);

  // Reset animation when switching groups
  const [groupKey, setGroupKey] = useState(0);
  const handleGroupChange = (idx) => {
    if (idx === activeGroup) return;
    setShow(false);
    setActiveGroup(idx);
    setGroupKey((k) => k + 1);
    setTimeout(() => setShow(true), 80);
  };

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 },
    delay: 50,
    config: { tension: 220, friction: 28 },
  });

  const group = SKILL_GROUPS[activeGroup];

  return (
    <section
      id="skills"
      className="v3-section-body v3-scrollable"
      style={{ background: "#00473e", height: "100%", overflow: "hidden" }}
    >
      <div className="v3-inner">
        <animated.div style={headerSpring}>
          <SectionTitle subtitle="Technologies I work with">Skills</SectionTitle>
        </animated.div>

        {/* Group tabs */}
        <div className="v3-filter-btns" style={{ marginBottom: "1.5rem" }}>
          {SKILL_GROUPS.map((g, i) => (
            <button
              key={g.name}
              type="button"
              className={activeGroup === i ? "active" : ""}
              onClick={() => handleGroupChange(i)}
              aria-pressed={activeGroup === i}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Skill bars grid */}
        <div key={groupKey} className="row">
          {group?.skills.map((skill, i) => (
            <div key={`${skill.name}-${i}`} className="col-md-6">
              <SkillBar skill={skill} delay={80 + i * 55} show={show} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default V3Skills;
