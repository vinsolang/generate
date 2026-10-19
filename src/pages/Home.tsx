import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Palette, ShieldCheck } from 'lucide-react';
import UrlInput from '../components/UrlInput';

const features = [
  { icon: Palette, title: 'Customize', text: 'Pick size, colors, error correction, and add your logo.' },
  { icon: Download, title: 'Download', text: 'Save sharp PNG or scalable SVG files.' },
  { icon: ShieldCheck, title: 'Private', text: 'Everything runs in your browser. Links never leave your device.' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  return (
    <>
      <section className="bg-gradient-to-b from-indigo-50 to-transparent px-4 py-16 dark:from-indigo-950/40 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Turn Any Link Into a QR Code</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">Generate, customize, and download QR codes for your links in seconds.</p>
          <div className="mt-8 text-left">
            <UrlInput id="hero-url" large value={url} onChange={setUrl} onSubmit={() => navigate('/generator', { state: { url } })} />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Icon aria-hidden className="h-6 w-6 text-indigo-600" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
