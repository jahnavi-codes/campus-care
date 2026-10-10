import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Complaints from './pages/Complaints.jsx';
import ComplaintForm from './pages/ComplaintForm.jsx';
import ComplaintDetail from './pages/ComplaintDetail.jsx';
import Manage from './pages/Manage.jsx';

function Protected({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center muted">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Shell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">CampusCare</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/complaints">{user.role === 'admin' ? 'All complaints' : 'My complaints'}</NavLink>
          {user.role === 'student' && <NavLink to="/complaints/new">New complaint</NavLink>}
          {user.role === 'admin' && <NavLink to="/manage">Categories & locations</NavLink>}
        </nav>
        <div className="who">
          <strong>{user.name}</strong>
          <span className="muted">{user.role === 'admin' ? 'Administrator' : user.rollNo || 'Student'}</span>
          <button className="ghost" onClick={() => { logout(); navigate('/login'); }}>Log out</button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  const page = (el, adminOnly) => (
    <Protected adminOnly={adminOnly}>
      <Shell>{el}</Shell>
    </Protected>
  );
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={page(<Dashboard />)} />
      <Route path="/complaints" element={page(<Complaints />)} />
      <Route path="/complaints/new" element={page(<ComplaintForm />)} />
      <Route path="/complaints/:id/edit" element={page(<ComplaintForm />)} />
      <Route path="/complaints/:id" element={page(<ComplaintDetail />)} />
      <Route path="/manage" element={page(<Manage />, true)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
