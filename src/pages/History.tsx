import { useNavigate } from 'react-router-dom';
import QRHistory from '../components/QRHistory';
import { useQRHistory } from '../hooks/useQRHistory';

export default function History() {
  const { items, remove, clear } = useQRHistory();
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">History</h1>
      <p className="mb-6 mt-1 text-slate-600 dark:text-slate-300">Your 10 most recent QR codes, stored only in this browser.</p>
      <QRHistory items={items} onRegenerate={(item) => navigate('/generator', { state: { item } })} onRemove={remove} onClear={clear} />
    </div>
  );
}
