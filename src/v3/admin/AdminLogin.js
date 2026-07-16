import { useState } from "react";
import { adminLogin } from "./adminAuth";
import { navigateToAdmin } from "./useAppMode";
import "../styles/sass/v3-app.scss";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminLogin(email.trim(), password);
      navigateToAdmin();
    } catch (err) {
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v3-admin-root v3-admin-login">
      <div className="v3-admin-login__panel">
        <div className="v3-admin-login__brand">
          <span className="v3-admin-login__badge">Carl Manuel</span>
          <h1 className="v3-admin-login__title">Portfolio Admin</h1>
          <p className="v3-admin-login__subtitle">
            Sign in to view analytics, inbox, outreach, and client previews.
          </p>
        </div>

        <form className="v3-admin-login__form" onSubmit={handleSubmit} noValidate>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Email</span>
            <input
              className="v3-admin-field__input"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Password</span>
            <input
              className="v3-admin-field__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          {error && (
            <p className="v3-admin-login__error" role="alert">
              {error}
            </p>
          )}

          <button className="v3-admin-btn v3-admin-btn--primary" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="v3-admin-login__footer">
          <a className="v3-admin-link" href="/#home">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
