import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try { await api.post("/auth/register", form); navigate("/login", { state: { message: "Account created. Please log in." } }); }
    catch (err) { setError(err.response?.data?.error || "Registration failed. Please try again."); }
    finally { setLoading(false); }
  }

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <div className="auth-logo">U</div><p className="eyebrow">WELCOME TO USERHUB</p><h1>Create your account</h1>
    <p className="muted">Join UserHub to manage your account securely.</p>
    <label>Full name<input name="fullName" value={form.fullName} onChange={change} placeholder="Juan Dela Cruz" required maxLength="100"/></label>
    <label>Email address<input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required/></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={change} placeholder="At least 8 characters" minLength="8" required/></label>
    {error && <p className="error">{error}</p>}
    <button className="primary-button full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
    <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
  </form></div>;
}
