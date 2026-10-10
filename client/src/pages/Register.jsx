import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNo: '', department: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Create a student account</h1>
        {error && <div className="alert">{error}</div>}
        <label>Full name<input required value={form.name} onChange={set('name')} /></label>
        <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Password (6+ characters)<input type="password" minLength={6} required value={form.password} onChange={set('password')} /></label>
        <div className="row">
          <label>Roll number<input value={form.rollNo} onChange={set('rollNo')} /></label>
          <label>Department<input value={form.department} onChange={set('department')} /></label>
        </div>
        <button className="primary">Create account</button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
