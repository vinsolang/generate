import { RefreshCw, Trash2 } from 'lucide-react';
import type { HistoryItem } from '../types/qr';
import { buildSvg, svgToDataUrl } from '../utils/downloadQRCode';

interface Props {
  items: HistoryItem[];
  onRegenerate: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function QRHistory({ items, onRegenerate, onRemove, onClear }: Props) {
  if (items.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">No QR codes yet. Codes you generate appear here, saved only in this browser.</p>;
  }
  return (
    <div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <img src={svgToDataUrl(buildSvg(i.url, { ...i.settings, size: 128 }))} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium" title={i.url}>{i.url}</p>
              <p className="text-xs text-slate-500">{new Date(i.createdAt).toLocaleString()}</p>
            </div>
            <button type="button" onClick={() => onRegenerate(i)} aria-label={`Regenerate QR code for ${i.url}`} className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50 dark:hover:bg-slate-800"><RefreshCw aria-hidden className="h-5 w-5" /></button>
            <button type="button" onClick={() => onRemove(i.id)} aria-label={`Remove ${i.url} from history`} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-800"><Trash2 aria-hidden className="h-5 w-5" /></button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onClear} className="mt-4 text-sm font-medium text-red-600 hover:underline">Clear all history</button>
    </div>
  );
}
