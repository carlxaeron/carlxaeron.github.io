function SectionTitle({ tag = "h2", children, accent, subtitle }) {
  const Tag = tag;
  return (
    <div className="v3-section-title-block" style={{ marginBottom: "2rem" }}>
      <Tag className="v3-title">
        {children}
        {accent && <span className="accent"> {accent}</span>}
      </Tag>
      {subtitle && <p className="v3-subtitle">{subtitle}</p>}
    </div>
  );
}

export default SectionTitle;
