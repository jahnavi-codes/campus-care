import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, STATUSES, fmtDate } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function Complaints() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);
  const [locs, setLocs] = useState([]);
  const [f, setF] = useState({ q: '', status: '', category: '', location: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api('/categories').then(setCats);
    api('/locations').then(setLocs);
  }, []);

  const load = () => {
    const params = new URLSearchParams(Object.entries(f).filter(([, v]) => v));
    api(`/complaints?${params}`).then(setList).catch((e) => setError(e.message));
  };
  useEffect(load, [f]);

  const remove = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await api(`/complaints/${id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <>
      <header className="page-head">
        <h1>{user.role === 'admin' ? 'All complaints' : 'My complaints'}</h1>
        {user.role === 'student' && <Link className="btn primary" to="/complaints/new">New complaint</Link>}
      </header>

      <div className="filters card">
        <input placeholder="Search by title" value={f.q} onChange={set('q')} />
        <select value={f.status} onChange={set('status')}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={f.category} onChange={set('category')}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={f.location} onChange={set('location')}>
          <option value="">All locations</option>
          {locs.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              {user.role === 'admin' && <th>Student</th>}
              <th>Category</th><th>Location</th><th>Priority</th><th>Status</th><th>Submitted</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan="8" className="muted">No complaints match these filters.</td></tr>}
            {list.map((c) => (
              <tr key={c._id}>
                <td><Link to={`/complaints/${c._id}`}>{c.title}</Link></td>
                {user.role === 'admin' && <td>{c.student?.name}</td>}
                <td>{c.category?.name}</td>
                <td>{c.location?.name}</td>
                <td>{c.priority}</td>
                <td><StatusBadge status={c.status} /></td>
                <td>{fmtDate(c.createdAt)}</td>
                <td className="actions">
                  {(user.role === 'admin' || c.status === 'Pending') && (
                    <>
                      <Link to={`/complaints/${c._id}/edit`}>Edit</Link>
                      <button className="link danger" onClick={() => remove(c._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
