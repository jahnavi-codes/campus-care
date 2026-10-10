import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Log in to CampusCare</h1>
        <p className="muted">Submit complaints and follow them until they are resolved.</p>
        {error && <div className="alert">{error}</div>}
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="primary">Log in</button>
        <p className="muted">New student? <Link to="/register">Create an account</Link></p>
        <p className="hint">Demo: student@campus.edu / student123, admin@campus.edu / admin123</p>
      </form>
    </div>
  );
}
