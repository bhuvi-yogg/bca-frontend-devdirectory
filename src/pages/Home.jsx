import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getErrorMessage } from '../services/postService';
import AlertBanner from '../components/AlertBanner';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const companies = new Set(users.map((u) => u.company?.name)).size;
  const cities = new Set(users.map((u) => u.address?.city)).size;

  return (
    <section>
      <div className="hero">
        <h1>Find your colleagues. Share what you know.</h1>
        <p className="muted">
          DevDirectory is the internal portal for discovering developers, reading their
          write-ups, and publishing team bulletins.
        </p>
        <div className="hero-actions">
          <Link to="/users" className="btn btn-primary">Browse developers</Link>
          <Link to="/add-post" className="btn btn-outline">Publish a post</Link>
        </div>
      </div>

      {error && <AlertBanner message={error} onRetry={load} />}

      <div className="stats">
        {[
          ['Developers', users.length],
          ['Companies', companies],
          ['Cities', cities],
        ].map(([label, value]) => (
          <div className="card stat" key={label}>
            <strong>{loading ? <span className="skeleton sk-stat" /> : error ? '–' : value}</strong>
            <span className="muted">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
