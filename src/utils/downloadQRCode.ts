import QRCode from 'qrcode';
import type { QRSettings } from '../types/qr';

const QUIET = 4;

/** Builds a standalone SVG string. The URL is only encoded into module paths, never injected as markup. */
export function buildSvg(text: string, s: QRSettings): string {
  const qr = QRCode.create(text, { errorCorrectionLevel: s.logo ? 'H' : s.level });
  const n = qr.modules.size;
  const data = qr.modules.data;
  const total = n + QUIET * 2;
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (data[y * n + x]) d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
    }
  }
  let logo = '';
  if (s.logo) {
    const box = total * 0.2; // ~4% of the area; level H tolerates up to ~30%
    const pos = (total - box) / 2;
    const pad = box * 0.1;
    logo =
      `<rect x="${pos - pad}" y="${pos - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="1" fill="${s.bg}"/>` +
      `<image href="${s.logo}" x="${pos}" y="${pos}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${s.size}" height="${s.size}" shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="${s.bg}"/><path d="${d}" fill="${s.fg}"/>${logo}</svg>`
  );
}

export const svgToDataUrl = (svg: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function saveBlob(blob: Blob, name: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function downloadSvg(text: string, s: QRSettings): void {
  saveBlob(new Blob([buildSvg(text, s)], { type: 'image/svg+xml' }), 'linkqr.svg');
}

/** Renders at 4x the chosen size (nearest-neighbor) so the PNG stays sharp. */
export async function downloadPng(text: string, s: QRSettings): Promise<void> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Could not render the QR code.'));
    img.src = svgToDataUrl(buildSvg(text, s));
  });
  const px = s.size * 4;
  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported in this browser.');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, px, px);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
  if (!blob) throw new Error('Could not create the PNG file.');
  saveBlob(blob, 'linkqr.png');
}
