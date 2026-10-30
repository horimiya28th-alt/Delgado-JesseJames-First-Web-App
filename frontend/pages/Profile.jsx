import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard").then(({data}) => {
      setFullName(data.fullName);
      setUser(prev => ({ ...prev, fullName: data.fullName, email: data.email, role: data.role }));
    }).catch(() => { localStorage.clear(); navigate("/login"); });
  }, [navigate]);

  async function submit(e) {
    e.preventDefault(); setMessage(""); setError(""); setSaving(true);
    try {
      const {data} = await api.put("/users/me", { fullName });
      const updated = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated); setMessage("Your profile has been updated successfully.");
    } catch (err) { setError(err.response?.data?.error || "Could not update profile."); }
    finally { setSaving(false); }
  }

  return <Layout><div className="page-heading"><div><p className="eyebrow">ACCOUNT SETTINGS</p><h1>My Profile</h1><p className="muted">Manage your personal account information.</p></div></div>
    <section className="panel form-panel"><div className="profile-top"><div className="avatar large">{(user?.fullName || "U").charAt(0).toUpperCase()}</div><div className="profile-heading"><h2>{user?.fullName}</h2><span className="role-pill">{user?.role}</span><p>{user?.email}</p></div></div>
      <form onSubmit={submit} className="profile-form"><label>Full name<input value={fullName} onChange={e => setFullName(e.target.value)} required maxLength="100"/></label>
        <label>Email address<input value={user?.email || ""} disabled/><small>Email cannot be changed from this page.</small></label>
        {message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
        <button className="primary-button" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
      </form>
    </section>
  </Layout>;
}
