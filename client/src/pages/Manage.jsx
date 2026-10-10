import { useEffect, useState } from 'react';
import { api } from '../api.js';

function LookupManager({ title, path }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = () => api(path).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) await api(`${path}/${editing}`, { method: 'PUT', body: { name } });
      else await api(path, { method: 'POST', body: { name } });
      setName('');
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    setError('');
    try {
      await api(`${path}/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card">
      <h2>{title}</h2>
      {error && <div className="alert">{error}</div>}
      <form className="inline" onSubmit={save}>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={editing ? 'Rename' : 'Add new'} />
        <button className="primary">{editing ? 'Save' : 'Add'}</button>
        {editing && <button type="button" className="ghost" onClick={() => { setEditing(null); setName(''); }}>Cancel</button>}
      </form>
      <ul className="list">
        {items.map((i) => (
          <li key={i._id}>
            <span>{i.name}</span>
            <span className="actions">
              <button className="link" onClick={() => { setEditing(i._id); setName(i.name); }}>Edit</button>
              <button className="link danger" onClick={() => remove(i._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Manage() {
  return (
    <>
      <header className="page-head"><h1>Categories & locations</h1></header>
      <div className="two-col">
        <LookupManager title="Categories" path="/categories" />
        <LookupManager title="Locations" path="/locations" />
      </div>
    </>
  );
}
