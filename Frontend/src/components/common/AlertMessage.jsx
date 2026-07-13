import { LuCircleAlert, LuCircleCheck, LuX } from 'react-icons/lu';

export default function AlertMessage({ type = 'danger', message, onClose }) {
  if (!message) return null;
  const Icon = type === 'success' ? LuCircleCheck : LuCircleAlert;
  const cls = type === 'success' ? 'alert-custom-success' : 'alert-custom-danger';

  return (
    <div className={`alert-custom ${cls}`} role="alert">
      <Icon size={20} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{message}</span>
      {onClose && (
        <button type="button" className="alert-custom-close" onClick={onClose} aria-label="Dismiss">
          <LuX size={18} />
        </button>
      )}
    </div>
  );
}
