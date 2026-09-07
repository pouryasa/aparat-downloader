// Utility function to compute SHA-256 hash using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Default SHA-256 hash for 'Aparat1382$'
export const DEFAULT_ADMIN_PASSWORD_HASH =
  '14ff2aab6500dcc53b9a0c3a982d136b64859a5e649ff0420a0288d53e94cc27';

/**
 * Constant-time string comparison to mitigate side-channel timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

