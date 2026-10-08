import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUsers, getErrorMessage } from '../services/postService';
import useDebounce from '../hooks/useDebounce';
import UserCard from '../components/UserCard';
import SkeletonLoader from '../components/SkeletonLoader';
import AlertBanner from '../components/AlertBanner';

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  // FIX #2: short delay so filtering feels "instant" (spec: grid must update instantly)
  const debouncedQuery = useDebounce(query, 100);

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

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.company?.name.toLowerCase().includes(q)
    );
  }, [users, debouncedQuery]);

  return (
    <section>
      <h1>Developer Directory</h1>
      <input
        type="search"
        className="input search"
        placeholder="Search by name or company…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search developers"
      />

      {error && <AlertBanner message={error} onRetry={load} />}

      {loading ? (
        <SkeletonLoader variant="card" />
      ) : error ? (
        // FIX #1: even if the banner is dismissed, the page keeps a Retry option
        <div className="empty">
          <p>Developers could not be loaded.</p>
          <button className="btn btn-primary" onClick={load}>Try again</button>
        </div>
      ) : (
        <>
          <p className="muted small">{filtered.length} developer(s) found</p>
          {filtered.length === 0 ? (
            <div className="empty">No developers match “{debouncedQuery}”.</div>
          ) : (
            <div className="grid">
              {filtered.map((u) => <UserCard key={u.id} user={u} />)}
            </div>
          )}
        </>
      )}
    </section>
  );
}
