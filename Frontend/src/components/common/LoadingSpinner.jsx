export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-state text-center">
      <div className="loading-ring" role="status" aria-label="Loading" />
      <p className="loading-text mb-0">{message}</p>
    </div>
  );
}
