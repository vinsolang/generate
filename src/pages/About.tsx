export default function About() {
  const h = 'text-xl font-semibold';
  const p = 'mt-2 text-slate-600 dark:text-slate-300';
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      <section>
        <h1 className="text-3xl font-bold">About LinkQR</h1>
        <p className={p}>LinkQR turns a web link into a QR code you can customize and download as PNG or SVG. The code encodes your original URL exactly. LinkQR does not shorten or redirect links.</p>
      </section>
      <section id="privacy">
        <h2 className={h}>Privacy Policy</h2>
        <p className={p}>QR codes are generated entirely in your browser. The links you enter are never sent to a server. The last 10 codes are saved in your browser’s LocalStorage, and you can delete them any time from the History page.</p>
      </section>
      <section id="contact">
        <h2 className={h}>Contact</h2>
        <p className={p}>Questions or feedback? Email <a className="text-indigo-600 underline" href="mailto:hello@example.com">hello@example.com</a>. Replace this address in src/pages/About.tsx with your own.</p>
      </section>
    </div>
  );
}
