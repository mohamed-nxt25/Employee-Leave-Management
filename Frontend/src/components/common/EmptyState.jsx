import { LuInbox } from 'react-icons/lu';

export default function EmptyState({ title = 'No records found', message, action }) {
  return (
    <div className="empty-state text-center">
      <div className="empty-icon mx-auto mb-3">
        <LuInbox size={30} />
      </div>
      <h6 className="mb-1">{title}</h6>
      {message && <p className="text-muted small mb-3">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
