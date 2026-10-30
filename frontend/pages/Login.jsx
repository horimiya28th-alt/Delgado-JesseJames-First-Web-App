import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) { setError(err.response?.data?.error || "Invalid email or password."); }
    finally { setLoading(false); }
  }

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <div className="auth-logo">U</div><p className="eyebrow">YOUR ACCOUNT, IN ONE PLACE</p><h1>Welcome back</h1>
    <p className="muted">Log in to continue to your UserHub dashboard.</p>
    {location.state?.message && <p className="success">{location.state.message}</p>}
    <label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required/></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="Enter your password" required/></label>
    {error && <p className="error">{error}</p>}
    <button className="primary-button full" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
    <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
    <p className="demo-hint">Default admin: admin@userhub.com · Admin@123</p>
  </form></div>;
}
