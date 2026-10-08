import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  // the exact route the user originally tried to visit
  const from = location.state?.from?.pathname || '/';

  // Guest-only page
  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login({ name: name.trim(), token: 'mock-token-' + Date.now() });
    navigate(from, { replace: true });
  };

  return (
    <section className="narrow">
      <h1>Login</h1>
      {location.state?.from && (
        <p className="muted">Please log in to access <code>{from}</code>.</p>
      )}
      <form onSubmit={handleSubmit} className="card form">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ada Lovelace"
        />
        <button className="btn btn-primary" disabled={!name.trim()}>Sign in</button>
      </form>
    </section>
  );
}
