import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

  return (
    <article className="card user-card">
      <div className="avatar" aria-hidden="true">{initials}</div>
      <h3>{user.name}</h3>
      <p className="muted">@{user.username}</p>
      <p className="company">{user.company?.name}</p>
      <p className="muted small">{user.email}</p>
      <Link to={`/users/${user.id}`} className="btn btn-outline">View profile</Link>
    </article>
  );
}
