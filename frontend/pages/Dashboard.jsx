import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, ShieldCheck, CalendarDays, ArrowUpRight, Clock3, UserRound, PencilLine } from "lucide-react";
import api from "../api/client";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard").then(res => setInfo(res.data))
      .catch(() => { setError("Your session has expired. Please log in again."); localStorage.clear(); navigate("/login"); });
  }, [navigate]);

  if (!info) return <Layout><p className="muted">{error || "Loading your dashboard..."}</p></Layout>;

  const stats = [
    { label: "Total users", value: info.totalUsers, note: "Registered in the system", icon: Users, tone: "blue" },
    { label: "Your role", value: info.role, note: "Your account access level", icon: UserRound, tone: "green" },
    { label: "Account status", value: "Active", note: "You are signed in", icon: ShieldCheck, tone: "purple" },
    { label: "Member since", value: info.memberSince, note: "Your registration date", icon: CalendarDays, tone: "orange" }
  ];

  return <Layout>
    <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Welcome back, {info.fullName.split(" ")[0]}! <span>👋</span></h1><p className="muted">Here's what's happening with your account today.</p></div></div>
    <div className="dashboard-grid">
      <section className="panel profile-panel">
        <div className="profile-top"><div className="avatar large">{info.fullName.charAt(0).toUpperCase()}</div><div className="profile-heading"><h2>{info.fullName}</h2><span className="role-pill">{info.role}</span><p>{info.email}</p></div><Link className="outline-button" to="/profile"><PencilLine size={16}/> Edit profile</Link></div>
        <div className="profile-details"><div><span>Full name</span><strong>{info.fullName}</strong></div><div><span>Email</span><strong>{info.email}</strong></div><div><span>Role</span><strong>{info.role}</strong></div><div><span>Member since</span><strong>{info.memberSince}</strong></div></div>
      </section>
      {stats.map(({label,value,note,icon:Icon,tone}) => <section className={`panel stat-card ${tone}`} key={label}><div className="stat-icon"><Icon size={21}/></div><p>{label}</p><h2>{value}</h2><small>{note}</small><ArrowUpRight className="stat-arrow" size={18}/></section>)}
    </div>
    <div className="lower-grid">
      <section className="panel"><div className="section-title"><h2><Clock3 size={20}/> Account information</h2></div>
        <div className="activity-row"><span className="activity-dot green-dot"></span><div><strong>You're logged in</strong><small>Your protected dashboard is connected to the Spring Boot API.</small></div></div>
        <div className="activity-row"><span className="activity-dot blue-dot"></span><div><strong>Profile management</strong><small>You can update your full name anytime.</small></div></div>
        <div className="activity-row"><span className="activity-dot purple-dot"></span><div><strong>Secure access</strong><small>Your account uses token-based authentication.</small></div></div>
      </section>
      <section className="panel"><div className="section-title"><h2>Quick links</h2></div>
        <Link className="quick-link" to="/dashboard"><span className="quick-icon blue"><Users size={19}/></span><span><strong>Dashboard</strong><small>View your account overview</small></span><ArrowUpRight size={18}/></Link>
        <Link className="quick-link" to="/profile"><span className="quick-icon green"><UserRound size={19}/></span><span><strong>My Profile</strong><small>Update your personal information</small></span><ArrowUpRight size={18}/></Link>
        {info.role === "ADMIN" && <Link className="quick-link" to="/admin/users"><span className="quick-icon purple"><ShieldCheck size={19}/></span><span><strong>Admin Users</strong><small>View all registered accounts</small></span><ArrowUpRight size={18}/></Link>}
      </section>
    </div>
    <footer className="footer"><span>UserHub v1.0.0 · Spring Boot + ReactJS</span><span>Simple. Secure. Connected.</span></footer>
  </Layout>;
}
