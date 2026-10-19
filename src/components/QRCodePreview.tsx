import { useMemo, useState } from 'react';
import { Check, Copy, Download, FileImage, Loader2, RotateCcw, Smartphone } from 'lucide-react';
import type { QRSettings } from '../types/qr';
import { buildSvg, downloadPng, downloadSvg, svgToDataUrl } from '../utils/downloadQRCode';

interface Props {
  url: string | null;
  settings: QRSettings;
  loading: boolean;
  onReset: () => void;
}

const btn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800';

export default function QRCodePreview({ url, settings, loading, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const src = useMemo(() => (url ? svgToDataUrl(buildSvg(url, settings)) : null), [url, settings]);

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Clipboard access was blocked. Copy the link manually instead.');
    }
  };
  const png = async () => {
    if (!url) return;
    setExporting(true);
    setError(null);
    try { await downloadPng(url, settings); } catch (e) { setError(e instanceof Error ? e.message : 'Export failed.'); }
    finally { setExporting(false); }
  };

  return (
    <section aria-labelledby="preview-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 id="preview-title" className="mb-4 text-lg font-semibold">Preview</h2>
      <div className="mx-auto flex aspect-square w-full max-w-xs items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700" aria-live="polite">
        {loading ? (
          <span className="flex flex-col items-center gap-2 text-sm text-slate-500"><Loader2 aria-hidden className="h-8 w-8 animate-spin text-indigo-600" />Generating…</span>
        ) : src ? (
          <img src={src} alt={`QR code for ${url}`} className="h-full w-full rounded-xl" />
        ) : (
          <p className="px-6 text-center text-sm text-slate-500">Enter a link and select Generate QR Code to see it here.</p>
        )}
      </div>

      {url && !loading && (
        <>
          <div className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
            <p className="truncate text-sm" title={url}>{url}</p>
            <button type="button" onClick={copy} aria-label="Copy link" className="shrink-0 rounded p-1.5 text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700">
              {copied ? <Check aria-hidden className="h-4 w-4 text-green-600" /> : <Copy aria-hidden className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Smartphone aria-hidden className="h-4 w-4 shrink-0" /> Point your phone’s camera at the code to open the link.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={png} disabled={exporting} className={`${btn} bg-indigo-600 !text-white !border-indigo-600 hover:!bg-indigo-700`}>
              {exporting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Download aria-hidden className="h-4 w-4" />} PNG
            </button>
            <button type="button" onClick={() => url && downloadSvg(url, settings)} className={btn}><FileImage aria-hidden className="h-4 w-4" /> SVG</button>
            <button type="button" onClick={copy} className={btn}>{copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />} {copied ? 'Copied' : 'Copy URL'}</button>
            <button type="button" onClick={onReset} className={btn}><RotateCcw aria-hidden className="h-4 w-4" /> Reset</button>
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        </>
      )}
    </section>
  );
}
