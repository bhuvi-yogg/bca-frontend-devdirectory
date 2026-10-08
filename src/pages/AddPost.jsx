import { useEffect, useState } from 'react';
import { createPost, getUsers, getErrorMessage } from '../services/postService';
import AlertBanner from '../components/AlertBanner';

const LIMITS = { title: [5, 80], body: [20, 500] };
const initial = { userId: '', title: '', body: '' };

function validate(values) {
  const errors = {};
  if (!values.userId) errors.userId = 'Please choose an author.';
  const t = values.title.trim().length;
  if (t < LIMITS.title[0]) errors.title = `Title must be at least ${LIMITS.title[0]} characters.`;
  else if (t > LIMITS.title[1]) errors.title = `Title must be at most ${LIMITS.title[1]} characters.`;
  const b = values.body.trim().length;
  if (b < LIMITS.body[0]) errors.body = `Body must be at least ${LIMITS.body[0]} characters.`;
  else if (b > LIMITS.body[1]) errors.body = `Body must be at most ${LIMITS.body[1]} characters.`;
  return errors;
}

export default function AddPost() {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      setUsersError(getErrorMessage(err));
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setSuccess('');
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setTouched({ userId: true, title: true, body: true });
    if (!isValid) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await createPost({
        title: values.title.trim(),
        body: values.body.trim(),
        userId: Number(values.userId),
      });
      if (res.status === 201) {
        setSuccess(`Post published successfully (id: ${res.data.id}).`);
        setValues(initial);
        setTouched({});
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="narrow">
      <h1>Publish a post</h1>

      {success && <AlertBanner type="success" message={success} onDismiss={() => setSuccess('')} />}
      {usersError && <AlertBanner message={usersError} onRetry={loadUsers} />}
      {submitError && (
        <AlertBanner message={submitError} onRetry={handleSubmit} onDismiss={() => setSubmitError('')} />
      )}

      <form onSubmit={handleSubmit} className="card form" noValidate>
        <label htmlFor="userId">Author</label>
        <select
          id="userId"
          name="userId"
          className="input"
          value={values.userId}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={usersLoading}
        >
          <option value="">{usersLoading ? 'Loading authors…' : 'Select an author'}</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        {touched.userId && errors.userId && <p className="field-error">{errors.userId}</p>}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className="input"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="counter">{values.title.trim().length}/{LIMITS.title[1]}</p>
        {touched.title && errors.title && <p className="field-error">{errors.title}</p>}

        <label htmlFor="body">Body content</label>
        <textarea
          id="body"
          name="body"
          rows="6"
          className="input"
          value={values.body}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="counter">{values.body.trim().length}/{LIMITS.body[1]}</p>
        {touched.body && errors.body && <p className="field-error">{errors.body}</p>}

        <button className="btn btn-primary" disabled={!isValid || submitting}>
          {submitting ? 'Publishing…' : 'Publish'}
        </button>
      </form>
    </section>
  );
}
