function AdminBarChart({ title, rows, valueKey = "count", labelKey = "label" }) {
  const hasData = rows?.some((row) => (row[valueKey] || 0) > 0);

  if (!rows?.length || !hasData) {
    return (
      <div className="v3-admin-chart">
        <h3 className="v3-admin-chart__title">{title}</h3>
        <p className="v3-admin-chart__empty">No data yet.</p>
      </div>
    );
  }

  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1);

  return (
    <div className="v3-admin-chart">
      <h3 className="v3-admin-chart__title">{title}</h3>
      <div className="v3-admin-chart__rows">
        {rows.map((row) => (
          <div className="v3-admin-chart__row" key={row.key || row[labelKey]}>
            <span className="v3-admin-chart__label">{row[labelKey]}</span>
            <div className="v3-admin-chart__track" aria-hidden="true">
              <div
                className="v3-admin-chart__fill"
                style={{ width: `${((row[valueKey] || 0) / max) * 100}%` }}
              />
            </div>
            <span className="v3-admin-chart__value">{row[valueKey] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBarChart;
