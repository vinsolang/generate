import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UrlInput from '../components/UrlInput';
import QRCustomization from '../components/QRCustomization';
import QRCodePreview from '../components/QRCodePreview';
import QRHistory from '../components/QRHistory';
import { useQRHistory } from '../hooks/useQRHistory';
import { validateUrl } from '../utils/validateUrl';
import type { HistoryItem, QRSettings } from '../types/qr';

const DEFAULTS: QRSettings = { size: 256, fg: '#1e1b4b', bg: '#ffffff', level: 'M', logo: null };
interface NavState { url?: string; item?: HistoryItem }

export default function Generator() {
  const location = useLocation();
  const { items, add, remove, clear } = useQRHistory();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<QRSettings>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number>();

  const generate = (raw: string, s: QRSettings) => {
    const r = validateUrl(raw);
    if (!r.ok) { setError(r.error); return; }
    setError(null);
    setInput(r.url);
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setQrUrl(r.url);
      setLoading(false);
      add(r.url, { ...s, logo: null }); // logos are not stored: data URLs can exceed LocalStorage limits
    }, 150);
  };

  useEffect(() => {
    const st = location.state as NavState | null;
    if (st?.item) { setSettings(st.item.settings); generate(st.item.url, st.item.settings); }
    else if (st?.url) generate(st.url, settings);
    window.history.replaceState({}, '');
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const reset = () => { setInput(''); setQrUrl(null); setError(null); setSettings(DEFAULTS); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">QR Generator</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-label="Link and settings" className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <UrlInput id="gen-url" value={input} error={error} loading={loading} onChange={setInput} onSubmit={() => generate(input, settings)} />
          <QRCustomization settings={settings} onChange={setSettings} />
        </section>
        <QRCodePreview url={qrUrl} settings={settings} loading={loading} onReset={reset} />
      </div>
      <section aria-labelledby="recent" className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent" className="text-xl font-semibold">Recent QR codes</h2>
          <Link to="/history" className="text-sm font-medium text-indigo-600 hover:underline">View all</Link>
        </div>
        <QRHistory items={items.slice(0, 3)} onRegenerate={(i) => { setSettings(i.settings); generate(i.url, i.settings); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onRemove={remove} onClear={clear} />
      </section>
    </div>
  );
}
