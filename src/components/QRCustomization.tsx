import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { ECLevel, QRSettings, QRSize } from '../types/qr';

interface Props {
  settings: QRSettings;
  onChange: (s: QRSettings) => void;
}

const SIZES: QRSize[] = [128, 256, 512];
const LEVELS: { v: ECLevel; hint: string }[] = [
  { v: 'L', hint: '7% recovery' },
  { v: 'M', hint: '15% recovery' },
  { v: 'Q', hint: '25% recovery' },
  { v: 'H', hint: '30% recovery' },
];

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export default function QRCustomization({ settings, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const set = <K extends keyof QRSettings>(k: K, v: QRSettings[K]) => onChange({ ...settings, [k]: v });

  const l1 = luminance(settings.fg);
  const l2 = luminance(settings.bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const lowContrast = ratio < 4 || l1 > l2;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setLogoError('Choose an image file (PNG, JPG, SVG, WebP).');
    if (file.size > 512 * 1024) return setLogoError('Logo must be under 512 KB.');
    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => set('logo', String(reader.result));
    reader.onerror = () => setLogoError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const label = 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200';
  const chip = (on: boolean) =>
    `rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
      on
        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
        : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className={label}>Size</legend>
        <div className="flex gap-2">
          {SIZES.map((s) => (
            <button key={s} type="button" aria-pressed={settings.size === s} onClick={() => set('size', s)} className={chip(settings.size === s)}>
              {s}px
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        {(['fg', 'bg'] as const).map((k) => (
          <div key={k}>
            <label htmlFor={`color-${k}`} className={label}>{k === 'fg' ? 'Foreground' : 'Background'}</label>
            <div className="flex items-center gap-2">
              <input id={`color-${k}`} type="color" value={settings[k]} onChange={(e) => set(k, e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-transparent dark:border-slate-700" />
              <span className="font-mono text-sm text-slate-500">{settings[k]}</span>
            </div>
          </div>
        ))}
      </div>
      {lowContrast && (
        <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Low contrast or light-on-dark colors can make the code hard to scan. Use a dark foreground on a light background.
        </p>
      )}

      <div>
        <label htmlFor="ec-level" className={label}>Error correction</label>
        <select id="ec-level" value={settings.logo ? 'H' : settings.level} disabled={Boolean(settings.logo)}
          onChange={(e) => set('level', e.target.value as ECLevel)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900">
          {LEVELS.map((l) => <option key={l.v} value={l.v}>{l.v} ({l.hint})</option>)}
        </select>
        {settings.logo && <p className="mt-1 text-xs text-slate-500">Locked to H while a logo is in use, so the code stays scannable.</p>}
      </div>

      <div>
        <span className={label}>Center logo (optional)</span>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" aria-label="Upload logo" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className={`${chip(false)} inline-flex items-center gap-2`}>
            <ImagePlus aria-hidden className="h-4 w-4" /> {settings.logo ? 'Replace logo' : 'Add logo'}
          </button>
          {settings.logo && (
            <>
              <img src={settings.logo} alt="Selected logo" className="h-9 w-9 rounded border border-slate-300 object-contain dark:border-slate-700" />
              <button type="button" onClick={() => set('logo', null)} aria-label="Remove logo" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X aria-hidden className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {logoError && <p role="alert" className="mt-1 text-sm text-red-600">{logoError}</p>}
      </div>
    </div>
  );
}
