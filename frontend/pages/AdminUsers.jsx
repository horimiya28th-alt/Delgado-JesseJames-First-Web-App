import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import api from "../api/client";
import Layout from "../components/Layout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard/users").then(res => setUsers(res.data))
      .catch(err => {
        if (err.response?.status === 401) { localStorage.clear(); navigate("/login"); }
        else if (err.response?.status === 403) navigate("/dashboard");
        else setError("Unable to load users. Please try again.");
      });
  }, [navigate]);

  return <Layout><div className="page-heading"><div><p className="eyebrow">ADMINISTRATION</p><h1>Registered users</h1><p className="muted">View all accounts registered in UserHub.</p></div><span className="count-pill"><Users size={16}/>{users.length} users</span></div>
    <section className="panel table-panel">{error && <p className="error">{error}</p>}
      <div className="table-wrap"><table><thead><tr><th>ID</th><th>Full name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
        <tbody>{users.map(user => <tr key={user.id}><td>#{user.id}</td><td><strong>{user.fullName}</strong></td><td>{user.email}</td><td><span className={`role-pill ${user.role === "ADMIN" ? "admin-pill" : ""}`}>{user.role}</span></td><td>{user.createdAt}</td></tr>)}
        {users.length === 0 && !error && <tr><td colSpan="5" className="empty-state">Loading users or no accounts found.</td></tr>}</tbody>
      </table></div>
    </section>
  </Layout>;
}
