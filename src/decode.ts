export interface Token {
  header:  Record<string, unknown>
  payload: Record<string, unknown>
  sig:     string
}

function b64url(s: string): string {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return Buffer.from(s, 'base64').toString('utf-8')
}

export function decode(raw: string): Token {
  const parts = raw.trim().split('.')
  if (parts.length !== 3)
    throw new Error(`not a JWT — expected 3 parts, got ${parts.length}`)
  const [h, p, sig] = parts
  return {
    header:  JSON.parse(b64url(h)),
    payload: JSON.parse(b64url(p)),
    sig,
  }
}

export function sigBytes(sig: string): Buffer {
  const s = sig.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(s, 'base64')
}
