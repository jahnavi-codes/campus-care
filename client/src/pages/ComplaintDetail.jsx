import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, STATUSES, fmtDate } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [c, setC] = useState(null);
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/complaints/${id}`).then((data) => { setC(data); setStatus(data.status); }).catch((e) => setError(e.message));
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    try {
      const data = await api(`/complaints/${id}/status`, { method: 'PATCH', body: { status, remark } });
      setC(data);
      setRemark('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !c) return <div className="alert">{error}</div>;
  if (!c) return <p className="muted">Loading...</p>;

  return (
    <>
      <header className="page-head">
        <div>
          <Link to="/complaints" className="muted">Back to complaints</Link>
          <h1>{c.title}</h1>
        </div>
        <StatusBadge status={c.status} />
      </header>
      {error && <div className="alert">{error}</div>}

      <div className="two-col">
        <section className="card">
          <p className="desc">{c.description}</p>
          <dl className="meta">
            <div><dt>Category</dt><dd>{c.category?.name}</dd></div>
            <div><dt>Location</dt><dd>{c.location?.name}</dd></div>
            <div><dt>Priority</dt><dd>{c.priority}</dd></div>
            <div><dt>Submitted by</dt><dd>{c.student?.name}{c.student?.rollNo ? ` (${c.student.rollNo})` : ''}</dd></div>
            <div><dt>Submitted</dt><dd>{fmtDate(c.createdAt)}</dd></div>
          </dl>

          {user.role === 'admin' && (
            <form className="update" onSubmit={update}>
              <h2>Update status</h2>
              <div className="row">
                <label>Status
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label>Remark for the student
                  <input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="e.g. Technician visiting tomorrow" />
                </label>
              </div>
              <button className="primary">Save status</button>
            </form>
          )}
        </section>

        <section className="card">
          <h2>Progress</h2>
          <ol className="timeline">
            {[...c.history].reverse().map((h, i) => (
              <li key={i}>
                <StatusBadge status={h.status} />
                <p>{h.remark || 'Status changed'}</p>
                <span className="muted">{h.by?.name} - {fmtDate(h.at)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
