import { useState } from "react";
import { useStore } from "../containers/Portfolio/theme-provider";

function HamburgerMenu({ sections, currentSection, onNavigate }) {
  const [open, setOpen] = useState(false);
  const isMobile = useStore((s) => s.value.isMobile);

  if (!isMobile) return null;

  const handleNavigate = (index) => {
    onNavigate(index);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`v3-hamburger${open ? " open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="v3-nav-overlay"
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="v3-nav-overlay"
        className={`v3-nav-overlay${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className={`v3-nav-overlay__item${currentSection === index ? " active" : ""}`}
            onClick={() => handleNavigate(index)}
          >
            {section.title}
          </button>
        ))}
      </div>
    </>
  );
}

export default HamburgerMenu;
