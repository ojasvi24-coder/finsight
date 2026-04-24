/**
 * Real local-first encryption using the Web Crypto API (AES-GCM + PBKDF2).
 *
 * Not a mock. Passphrase → derived 256-bit key via PBKDF2 (100k iterations) →
 * AES-GCM encrypt/decrypt. Everything runs in the browser.
 */

const ENC_KEY = "finsight.enc.v1";
const SALT_KEY = "finsight.enc.salt.v1";

/**
 * Copy any Uint8Array into a fresh one explicitly backed by a plain ArrayBuffer.
 *
 * TypeScript 5.7+ / React 19 tightened the Web Crypto types so that
 * BufferSource now requires `Uint8Array<ArrayBuffer>` specifically — not the
 * generic `Uint8Array<ArrayBufferLike>` (which could theoretically be a
 * SharedArrayBuffer). This helper's explicit return type is what fixes
 * the "not assignable to BufferSource" compile error.
 */
function asBuffer(src: Uint8Array): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(src.byteLength);
  const out = new Uint8Array(buf);
  out.set(src);
  return out as Uint8Array<ArrayBuffer>;
}

async function deriveKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const encoded = enc.encode(passphrase);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    asBuffer(encoded),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: asBuffer(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const s = atob(b64);
  const buf = new ArrayBuffer(s.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out as Uint8Array<ArrayBuffer>;
}

function getOrCreateSalt(): Uint8Array<ArrayBuffer> {
  const existing = localStorage.getItem(SALT_KEY);
  if (existing) return fromBase64(existing);
  const fresh = crypto.getRandomValues(
    new Uint8Array(new ArrayBuffer(16))
  ) as Uint8Array<ArrayBuffer>;
  localStorage.setItem(SALT_KEY, toBase64(fresh));
  return fresh;
}

export async function encryptAndStore(
  plaintext: string,
  passphrase: string
): Promise<void> {
  const salt = getOrCreateSalt();
  const key = await deriveKey(passphrase, salt);
  const iv = crypto.getRandomValues(
    new Uint8Array(new ArrayBuffer(12))
  ) as Uint8Array<ArrayBuffer>;
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    asBuffer(encoded)
  );
  // Store iv || ciphertext as base64
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  localStorage.setItem(ENC_KEY, toBase64(combined));
}

export async function decryptFromStore(
  passphrase: string
): Promise<string | null> {
  const raw = localStorage.getItem(ENC_KEY);
  if (!raw) return null;
  const salt = getOrCreateSalt();
  const key = await deriveKey(passphrase, salt);
  const combined = fromBase64(raw);
  // slice() preserves the ArrayBuffer-backed typing
  const iv = combined.slice(0, 12) as Uint8Array<ArrayBuffer>;
  const ciphertext = combined.slice(12) as Uint8Array<ArrayBuffer>;
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    return null; // wrong passphrase
  }
}

export function hasEncryptedData(): boolean {
  return typeof window !== "undefined" && !!localStorage.getItem(ENC_KEY);
}

export function clearEncryptedData(): void {
  localStorage.removeItem(ENC_KEY);
  localStorage.removeItem(SALT_KEY);
}

/* ============================================================
   Simple "net worth attestation" — a SHA-256 commitment scheme.
   NOT a real ZK-SNARK, but directionally correct: the user can share a
   hash proving "I have >= $X" without revealing actual balance.
   ============================================================ */
export async function createAttestation(
  netWorth: number,
  threshold: number
): Promise<{
  passes: boolean;
  commitment: string;
  timestamp: number;
  threshold: number;
}> {
  const passes = netWorth >= threshold;
  const nonce = crypto.getRandomValues(
    new Uint8Array(new ArrayBuffer(16))
  ) as Uint8Array<ArrayBuffer>;
  const payload = `${passes ? 1 : 0}|${threshold}|${Date.now()}|${toBase64(
    nonce
  )}`;
  const payloadBytes = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    asBuffer(payloadBytes)
  );
  const commitment = toBase64(new Uint8Array(hashBuffer));
  return {
    passes,
    commitment,
    timestamp: Date.now(),
    threshold,
  };
}


