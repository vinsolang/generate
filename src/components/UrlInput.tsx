import type { FormEvent } from 'react';
import { Link2, Loader2, QrCode } from 'lucide-react';

interface Props {
  id: string;
  value: string;
  error?: string | null;
  loading?: boolean;
  large?: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export default function UrlInput({ id, value, error, loading, large, onChange, onSubmit }: Props) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Website link
      </label>
      <div className={`flex gap-2 ${large ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'}`}>
        <div className="relative flex-1">
          <Link2 aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id={id}
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="example.com/page"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full rounded-xl border bg-white pl-10 pr-3 text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 dark:bg-slate-900 dark:text-slate-100 ${
              large ? 'py-4 text-lg' : 'py-3'
            } ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-60 ${
            large ? 'py-4' : 'py-3'
          }`}
        >
          {loading ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <QrCode aria-hidden className="h-5 w-5" />}
          Generate QR Code
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
