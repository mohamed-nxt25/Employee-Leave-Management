import { useEffect, useState } from 'react';
import { LuCircleCheck, LuCircleX, LuLoaderCircle } from 'react-icons/lu';
import { checkApiHealth } from '../../api/healthApi';

export default function ApiStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkApiHealth()
      .then((res) => setStatus(res?.status === 'Running' ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);

  if (status === 'checking') {
    return (
      <span className="api-status api-status-checking">
        <LuLoaderCircle className="spin" size={14} /> Checking API...
      </span>
    );
  }
  if (status === 'online') {
    return (
      <span className="api-status api-status-online">
        <LuCircleCheck size={14} /> API connected
      </span>
    );
  }
  return (
    <span className="api-status api-status-offline">
      <LuCircleX size={14} /> API offline — start backend on port 5000
    </span>
  );
}
