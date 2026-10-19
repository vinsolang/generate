export type UrlResult = { ok: true; url: string } | { ok: false; error: string };

const HOST_RE = /^(localhost|(\d{1,3}\.){3}\d{1,3}|([a-z0-9-]+\.)+[a-z0-9-]{2,})$/i;

/** Validates user input and adds https:// when no protocol is given. Never fetches or opens the URL. */
export function validateUrl(input: string): UrlResult {
  const raw = input.trim();
  if (!raw) return { ok: false, error: 'Enter a URL to generate a QR code.' };
  if (/\s/.test(raw)) return { ok: false, error: 'URLs cannot contain spaces.' };

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
  const looksLikeOtherScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^[^/?#:]+:\d+/.test(raw);
  if (!hasScheme && looksLikeOtherScheme) {
    return { ok: false, error: 'Only http:// and https:// links are supported.' };
  }

  const candidate = hasScheme ? raw : `https://${raw}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: 'That doesn’t look like a valid URL. Try something like example.com.' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http:// and https:// links are supported.' };
  }
  if (!HOST_RE.test(parsed.hostname)) {
    return { ok: false, error: 'Enter a valid domain, such as example.com.' };
  }
  return { ok: true, url: candidate };
}
