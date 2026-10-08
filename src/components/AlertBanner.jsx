import { useEffect, useState } from 'react';

export default function AlertBanner({ type = 'error', message, onRetry, onDismiss }) {
  const [visible, setVisible] = useState(true);

  // re-show when a new message arrives
  useEffect(() => setVisible(true), [message]);

  if (!visible || !message) return null;

  const dismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{message}</span>
      <span className="alert-actions">
        {onRetry && (
          <button className="btn btn-small" onClick={onRetry}>Retry</button>
        )}
        <button className="btn btn-small btn-ghost" onClick={dismiss} aria-label="Dismiss">✕</button>
      </span>
    </div>
  );
}
