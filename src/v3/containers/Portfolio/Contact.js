import { useState } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import { useStore } from "./theme-provider";
import { mapping } from "../../../mapping";
import SectionTitle from "../../components/SectionTitle";
import { usePortfolioSettings } from "../../config/PortfolioContentContext";

function V3Contact({ isActive }) {
  const { setValue } = useStore();
  const settings = usePortfolioSettings();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const contactInfo = [
    {
      icon: "✉️",
      label: "Email",
      value: settings.contactEmailLabel || settings.contactEmail,
      href: `mailto:${settings.contactEmail || "info@carlmanuel.com"}`,
    },
    {
      icon: "💻",
      label: "GitHub",
      value: settings.githubLabel,
      href: settings.githubUrl,
    },
    {
      icon: "💼",
      label: "LinkedIn",
      value: settings.linkedinLabel,
      href: settings.linkedinUrl,
    },
  ].filter((item) => item.href && item.value);

  const spring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 },
    delay: 80,
    config: { tension: 220, friction: 28 },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(mapping.contact, {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
      })
      .then(() => {
        setSent(true);
        setLoading(false);
        e.target.reset();
        setValue((prev) => ({
          ...prev,
          modal: {
            show: true,
            title: "Message Sent!",
            body: "Thanks for reaching out — I'll reply ASAP.",
          },
        }));
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.errCode !== "test") {
          setValue((prev) => ({
            ...prev,
            modal: {
              show: true,
              title: "Error",
              body: "Message could not be sent. Please try again shortly.",
            },
          }));
        }
      });
  };

  return (
    <section
      id="contact"
      className="v3-section-body"
      style={{ background: "linear-gradient(160deg, #1E3932 0%, #00473e 100%)", height: "100%", overflow: "hidden" }}
    >
      <div className="v3-inner v3-scrollable v3-section-scroll">
        <SectionTitle subtitle={settings.contactSubtitle || ""}>Contact</SectionTitle>

        <animated.div style={spring} className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "1.5rem",
              }}
            >
              Get In Touch
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "rgba(212,233,226,0.85)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00A862")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(212,233,226,0.85)")}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6, marginBottom: "2px" }}>
                      {item.label}
                    </div>
                    {item.value}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="col-md-8">
            <form className="v3-form" onSubmit={handleSubmit} noValidate>
              <div className="row">
                <div className="col-sm-6">
                  <div className="v3-form__group">
                    <label htmlFor="v3-name" className="v3-form__label">Name</label>
                    <input
                      id="v3-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className="v3-form__control"
                      disabled={loading || sent}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="v3-form__group">
                    <label htmlFor="v3-email" className="v3-form__label">Email</label>
                    <input
                      id="v3-email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="v3-form__control"
                      disabled={loading || sent}
                    />
                  </div>
                </div>
              </div>
              <div className="v3-form__group">
                <label htmlFor="v3-message" className="v3-form__label">Message</label>
                <textarea
                  id="v3-message"
                  name="message"
                  required
                  placeholder="Tell me about your project…"
                  className="v3-form__control"
                  disabled={loading || sent}
                />
              </div>
              <button
                type="submit"
                className="v3-btn v3-btn--primary"
                disabled={loading || sent}
                style={{ opacity: loading || sent ? 0.6 : 1 }}
              >
                {loading ? "Sending…" : sent ? "Sent ✓" : "Send Message"}
              </button>
            </form>
          </div>
        </animated.div>
      </div>
    </section>
  );
}

export default V3Contact;
