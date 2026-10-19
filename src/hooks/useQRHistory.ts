import { useCallback, useEffect, useState } from 'react';
import type { HistoryItem, QRSettings } from '../types/qr';

const KEY = 'linkqr-history';
const MAX = 10;

function load(): HistoryItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return (parsed as HistoryItem[])
      .filter((i) => typeof i?.url === 'string' && typeof i?.id === 'string' && i.settings)
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function useQRHistory() {
  const [items, setItems] = useState<HistoryItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable: history simply won't persist */
    }
  }, [items]);

  const add = useCallback((url: string, settings: QRSettings) => {
    const item: HistoryItem = { id: crypto.randomUUID(), url, createdAt: new Date().toISOString(), settings };
    setItems((prev) => [item, ...prev.filter((p) => p.url !== url)].slice(0, MAX));
  }, []);
  const remove = useCallback((id: string) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  return { items, add, remove, clear };
}
