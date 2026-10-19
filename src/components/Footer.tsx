import { Link } from 'react-router-dom';
import { QrCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
            <QrCode aria-hidden className="h-5 w-5" /> LinkQR
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create QR codes easily, anywhere.</p>
        </div>
        <nav aria-label="Footer" className="flex gap-5 text-sm text-slate-600 dark:text-slate-300">
          <Link className="hover:text-indigo-600" to="/about">About</Link>
          <Link className="hover:text-indigo-600" to="/about#privacy">Privacy Policy</Link>
          <Link className="hover:text-indigo-600" to="/about#contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
