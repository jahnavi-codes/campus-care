import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, STATUSES, fmtDate } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api('/stats').then(setStats);
    api('/complaints').then((list) => setRecent(list.slice(0, 5)));
  }, []);

  if (!stats) return <p className="muted">Loading...</p>;
  const count = (s) => stats.byStatus.find((x) => x._id === s)?.count || 0;
  const maxCat = Math.max(1, ...stats.byCategory.map((c) => c.count));

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Hello, {user.name.split(' ')[0]}</h1>
          <p className="muted">{user.role === 'admin' ? 'Complaints across the campus' : 'Your complaints at a glance'}</p>
        </div>
        {user.role === 'student' && <Link className="btn primary" to="/complaints/new">New complaint</Link>}
      </header>

      <section className="stats">
        <div className="card stat"><span className="muted">Total</span><strong>{stats.total}</strong></div>
        {STATUSES.map((s) => (
          <div key={s} className={`card stat s-${s.toLowerCase().replace(' ', '-')}-bar`}>
            <span className="muted">{s}</span><strong>{count(s)}</strong>
          </div>
        ))}
      </section>

      <div className="two-col">
        <section className="card">
          <h2>Latest complaints</h2>
          {recent.length === 0 && <p className="muted">No complaints yet.</p>}
          <ul className="list">
            {recent.map((c) => (
              <li key={c._id}>
                <Link to={`/complaints/${c._id}`}>{c.title}</Link>
                <span className="muted">{c.location?.name} - {fmtDate(c.createdAt)}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>By category</h2>
          {stats.byCategory.length === 0 && <p className="muted">Nothing to show yet.</p>}
          {stats.byCategory.map((c) => (
            <div key={c._id} className="bar-row">
              <span>{c.name}</span>
              <div className="bar"><div style={{ width: `${(c.count / maxCat) * 100}%` }} /></div>
              <b>{c.count}</b>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
