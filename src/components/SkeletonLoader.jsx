export default function SkeletonLoader({ variant = 'card', count = 6 }) {
  if (variant === 'profile') {
    return (
      <div className="card" aria-busy="true" aria-label="Loading profile">
        <div className="skeleton sk-avatar" />
        <div className="skeleton sk-line w60" />
        <div className="skeleton sk-line w40" />
        <div className="skeleton sk-line w80" />
      </div>
    );
  }
  if (variant === 'list') {
    return (
      <div aria-busy="true" aria-label="Loading posts">
        {Array.from({ length: count }).map((_, i) => (
          <div className="card" key={i}>
            <div className="skeleton sk-line w60" />
            <div className="skeleton sk-line w80" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid" aria-busy="true" aria-label="Loading developers">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card" key={i}>
          <div className="skeleton sk-avatar" />
          <div className="skeleton sk-line w60" />
          <div className="skeleton sk-line w40" />
          <div className="skeleton sk-line w80" />
        </div>
      ))}
    </div>
  );
}
