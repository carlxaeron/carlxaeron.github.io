import { useState } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import { useStore } from "./theme-provider";
import { mapping } from "../../../mapping";
import SectionTitle from "../../components/SectionTitle";

const PROJECT_TYPES = [
  "Web App",
  "Mobile App",
  "AI Integration",
  "E-commerce/WooCommerce",
  "SaaS Platform",
  "Custom Automation",
];

const SERVICE_OPTIONS = [
  "Frontend Dev",
  "Backend/API",
  "AI Integration",
  "AI Automation",
  "Mobile (Flutter)",
  "DevOps/CI",
  "Full Project",
];

const BUDGET_RANGES = [
  "< ₱50k",
  "₱50k–₱150k",
  "₱150k–₱500k",
  "₱500k+",
  "Discuss",
];

const TIMELINES = [
  "ASAP",
  "1 month",
  "2–3 months",
  "3–6 months",
  "Flexible",
];

function V3Quote({ isActive }) {
  const { setValue } = useStore();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const spring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 },
    delay: 80,
    config: { tension: 220, friction: 28 },
  });

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    axios
      .post(mapping.quotation, {
        name: form.name.value,
        company: form.company.value,
        email: form.email.value,
        phone: form.phone.value,
        projectType: form.projectType.value,
        budgetRange: form.budgetRange.value,
        timeline: form.timeline.value,
        services: selectedServices,
        details: form.details.value,
      })
      .then(() => {
        setSent(true);
        setLoading(false);
        setSelectedServices([]);
        form.reset();
        setValue((prev) => ({
          ...prev,
          modal: {
            show: true,
            title: "Quote request received!",
            body: "Thanks — I'll get back to you within 24–48 hours.",
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
              body: "Your quote request could not be sent. Please try again shortly.",
            },
          }));
        }
      });
  };

  const selectStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(0,168,98,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "16px",
  };

  return (
    <section
      id="quote"
      className="v3-section-body"
      style={{ background: "#00473e", height: "100%", overflow: "hidden" }}
    >
      <div className="v3-inner v3-scrollable v3-section-scroll">
        <SectionTitle subtitle="Tell me about your project and I'll send a tailored estimate.">
          Get a Quote
        </SectionTitle>

        <animated.div style={spring}>
          <form className="v3-form" onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-sm-6">
                <div className="v3-form__group">
                  <label htmlFor="v3-quote-name" className="v3-form__label">Full name</label>
                  <input
                    id="v3-quote-name"
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
                  <label htmlFor="v3-quote-company" className="v3-form__label">Company / startup</label>
                  <input
                    id="v3-quote-company"
                    name="company"
                    type="text"
                    placeholder="Optional"
                    className="v3-form__control"
                    disabled={loading || sent}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="v3-form__group">
                  <label htmlFor="v3-quote-email" className="v3-form__label">Email</label>
                  <input
                    id="v3-quote-email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="v3-form__control"
                    disabled={loading || sent}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="v3-form__group">
                  <label htmlFor="v3-quote-phone" className="v3-form__label">Phone</label>
                  <input
                    id="v3-quote-phone"
                    name="phone"
                    type="tel"
                    placeholder="Optional"
                    className="v3-form__control"
                    disabled={loading || sent}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="v3-form__group">
                  <label htmlFor="v3-quote-project-type" className="v3-form__label">Project type</label>
                  <select
                    id="v3-quote-project-type"
                    name="projectType"
                    className="v3-form__control"
                    style={selectStyle}
                    disabled={loading || sent}
                    defaultValue=""
                  >
                    <option value="" disabled>Select project type</option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type} style={{ color: "#1A1A1A" }}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="v3-form__group">
                  <label htmlFor="v3-quote-budget" className="v3-form__label">Budget range</label>
                  <select
                    id="v3-quote-budget"
                    name="budgetRange"
                    className="v3-form__control"
                    style={selectStyle}
                    disabled={loading || sent}
                    defaultValue=""
                  >
                    <option value="" disabled>Select budget</option>
                    {BUDGET_RANGES.map((range) => (
                      <option key={range} value={range} style={{ color: "#1A1A1A" }}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="v3-form__group">
              <label htmlFor="v3-quote-timeline" className="v3-form__label">Timeline</label>
              <select
                id="v3-quote-timeline"
                name="timeline"
                className="v3-form__control"
                style={selectStyle}
                disabled={loading || sent}
                defaultValue=""
              >
                <option value="" disabled>Select timeline</option>
                {TIMELINES.map((item) => (
                  <option key={item} value={item} style={{ color: "#1A1A1A" }}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="v3-form__group">
              <span className="v3-form__label">Services needed</span>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {SERVICE_OPTIONS.map((service) => {
                  const checked = selectedServices.includes(service);
                  return (
                    <label
                      key={service}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "6px 12px",
                        borderRadius: "100px",
                        border: `1.5px solid ${checked ? "#00A862" : "rgba(0,168,98,0.25)"}`,
                        background: checked ? "rgba(0,168,98,0.2)" : "rgba(255,255,255,0.05)",
                        color: checked ? "#D4E9E2" : "rgba(212,233,226,0.85)",
                        fontSize: "0.8rem",
                        cursor: loading || sent ? "not-allowed" : "pointer",
                        opacity: loading || sent ? 0.5 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(service)}
                        disabled={loading || sent}
                        style={{ accentColor: "#00A862" }}
                      />
                      {service}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="v3-form__group">
              <label htmlFor="v3-quote-details" className="v3-form__label">Project details</label>
              <textarea
                id="v3-quote-details"
                name="details"
                required
                placeholder="Describe your goals, features, integrations, and any deadlines…"
                className="v3-form__control"
                disabled={loading || sent}
                style={{ minHeight: "140px" }}
              />
            </div>

            <button
              type="submit"
              className="v3-btn v3-btn--primary"
              disabled={loading || sent}
              style={{ opacity: loading || sent ? 0.6 : 1 }}
            >
              {loading ? "Sending…" : sent ? "Sent ✓" : "Request Quote"}
            </button>
          </form>
        </animated.div>
      </div>
    </section>
  );
}

export default V3Quote;
