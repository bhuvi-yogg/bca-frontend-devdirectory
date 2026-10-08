import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getUserById,
  getPostsByUser,
  getErrorMessage,
  saveDeveloperEdit,
  resetDeveloperEdit,
} from '../services/postService';
import SkeletonLoader from '../components/SkeletonLoader';
import AlertBanner from '../components/AlertBanner';

const FIELDS = [
  ['name', 'Name'],
  ['username', 'Username'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['website', 'Website'],
  ['city', 'City'],
  ['company', 'Company'],
];

const toForm = (u) => ({
  name: u.name || '',
  username: u.username || '',
  email: u.email || '',
  phone: u.phone || '',
  website: u.website || '',
  city: u.address?.city || '',
  company: u.company?.name || '',
});

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  // only the latest request may update state (prevents stale responses)
  const requestId = useRef(0);

  // edit mode
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState('');

  const load = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setError('');
    setNotFound(false);
    setUser(null);
    setEditing(false);
    try {
      const [userRes, postsRes] = await Promise.all([getUserById(id), getPostsByUser(id)]);
      if (current !== requestId.current) return;
      setUser(userRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      if (current !== requestId.current) return;
      if (err.response?.status === 404) setNotFound(true);
      else setError(getErrorMessage(err));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    return () => { requestId.current += 1; }; // ignore results after unmount / id change
  }, [load]);

  const startEdit = () => {
    setForm(toForm(user));
    setFormError('');
    setSaved('');
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!form.username.trim()) return 'Username is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Please enter a valid email address.';
    return '';
  };

  const handleSave = (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setFormError(problem);
      return;
    }
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    saveDeveloperEdit(id, clean);
    setUser((u) => ({
      ...u,
      name: clean.name,
      username: clean.username,
      email: clean.email,
      phone: clean.phone,
      website: clean.website,
      address: { ...u.address, city: clean.city },
      company: { ...u.company, name: clean.company },
    }));
    setEditing(false);
    setSaved('Developer details updated.');
  };

  const handleReset = () => {
    resetDeveloperEdit(id);
    setSaved('Your edits were cleared.');
    load();
  };

  return (
    <section>
      <Link to="/users" className="back">← Back to directory</Link>

      {error && <AlertBanner message={error} onRetry={load} />}
      {saved && <AlertBanner type="success" message={saved} onDismiss={() => setSaved('')} />}

      {loading && (
        <>
          <SkeletonLoader variant="profile" />
          <SkeletonLoader variant="list" count={3} />
        </>
      )}

      {/* after dismissing the banner the page still offers Retry */}
      {!loading && error && (
        <div className="empty">
          <p>Profile could not be loaded.</p>
          <button className="btn btn-primary" onClick={load}>Try again</button>
        </div>
      )}

      {notFound && (
        <div className="empty">
          <h2>Developer not found</h2>
          <p>No developer exists with id “{id}”.</p>
        </div>
      )}

      {!loading && user && (
        <>
          {editing ? (
            <form onSubmit={handleSave} className="card form" noValidate>
              <h2>Edit developer</h2>
              {FIELDS.map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={`edit-${key}`}>{label}</label>
                  <input
                    id={`edit-${key}`}
                    name={key}
                    className="input"
                    value={form[key]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              {formError && <p className="field-error">{formError}</p>}
              <div className="hero-actions">
                <button className="btn btn-primary" type="submit">Save changes</button>
                <button className="btn btn-outline" type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="card profile">
              <h1>{user.name}</h1>
              <p className="muted">@{user.username} · {user.company?.name}</p>
              <ul className="details">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Phone:</strong> {user.phone}</li>
                <li><strong>Website:</strong> {user.website}</li>
                <li><strong>City:</strong> {user.address?.city}</li>
              </ul>
              <div className="hero-actions">
                <button className="btn btn-outline" onClick={startEdit}>Edit details</button>
                <button className="btn btn-ghost" onClick={handleReset}>Reset my edits</button>
              </div>
            </div>
          )}

          <h2>Publications ({posts.length})</h2>
          {posts.length === 0 && <div className="empty">No posts yet.</div>}
          {posts.map((p) => (
            <article className="card post" key={p.id}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
