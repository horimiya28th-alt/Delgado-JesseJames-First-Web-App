import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserRound, Users, LogOut, Bell, Search } from "lucide-react";
import api from "../api/client";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  async function logout() {
    try { await api.post("/auth/logout"); }
    catch (error) { console.warn("Logout request could not be confirmed", error); }
    finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">U</span><span>UserHub</span></div>
      <nav className="side-nav">
        <NavLink to="/dashboard"><LayoutDashboard size={19}/>Dashboard</NavLink>
        <NavLink to="/profile"><UserRound size={19}/>My Profile</NavLink>
        {user?.role === "ADMIN" && <NavLink to="/admin/users"><Users size={19}/>Admin Users</NavLink>}
      </nav>
      <button className="logout-button" onClick={logout}><LogOut size={19}/>Logout</button>
    </aside>
    <section className="main-area">
      <header className="topbar">
        <div className="search-box"><Search size={18}/><span>Welcome to UserHub</span></div>
        <div className="top-user"><button className="icon-button" aria-label="Notifications"><Bell size={19}/></button>
          <div className="avatar small">{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</div>
          <div><strong>{user?.fullName || "User"}</strong><small>{user?.role || "USER"}</small></div>
        </div>
      </header>
      <main className="content">{children}</main>
    </section>
  </div>;
}
