import { useStore } from "../containers/Portfolio/theme-provider";

function NavDots({ sections, currentSection, onNavigate }) {
  const isMobile = useStore((s) => s.value.isMobile);

  return (
    <nav
      className="v3-nav-dots"
      aria-label="Section navigation"
      style={
        isMobile
          ? { flexDirection: "row", gap: "12px" }
          : {}
      }
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={`v3-nav-dot${currentSection === index ? " active" : ""}`}
          onClick={() => onNavigate(index)}
          aria-label={`Go to ${section.title}`}
          aria-current={currentSection === index ? "step" : undefined}
          title={section.title}
        />
      ))}
    </nav>
  );
}

export default NavDots;
