export type ECLevel = 'L' | 'M' | 'Q' | 'H';
export type QRSize = 128 | 256 | 512;

export interface QRSettings {
  size: QRSize;
  fg: string;
  bg: string;
  level: ECLevel;
  /** Data URL of the center logo, or null. */
  logo: string | null;
}

export interface HistoryItem {
  id: string;
  url: string;
  createdAt: string;
  settings: QRSettings;
}
