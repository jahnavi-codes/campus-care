import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

export default function ComplaintForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [locs, setLocs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', priority: 'Medium' });
  const [error, setError] = useState('');

  useEffect(() => {
    api('/categories').then(setCats);
    api('/locations').then(setLocs);
    if (id) {
      api(`/complaints/${id}`).then((c) =>
        setForm({ title: c.title, description: c.description, category: c.category._id, location: c.location._id, priority: c.priority })
      ).catch((e) => setError(e.message));
    }
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const saved = await api(id ? `/complaints/${id}` : '/complaints', { method: id ? 'PUT' : 'POST', body: form });
      navigate(`/complaints/${saved._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="page-head"><h1>{id ? 'Edit complaint' : 'New complaint'}</h1></header>
      <form className="card form" onSubmit={submit}>
        {error && <div className="alert">{error}</div>}
        <label>Title<input required value={form.title} onChange={set('title')} placeholder="e.g. Water leakage in hostel block B" /></label>
        <label>What happened?<textarea required rows="5" value={form.description} onChange={set('description')} /></label>
        <div className="row">
          <label>Category
            <select required value={form.category} onChange={set('category')}>
              <option value="">Choose a category</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
          <label>Location
            <select required value={form.location} onChange={set('location')}>
              <option value="">Choose a location</option>
              {locs.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </label>
          <label>Priority
            <select value={form.priority} onChange={set('priority')}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
        </div>
        <div className="row-end">
          <button type="button" className="ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button className="primary">{id ? 'Save changes' : 'Submit complaint'}</button>
        </div>
      </form>
    </>
  );
}
