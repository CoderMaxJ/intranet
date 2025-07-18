import CryptoJS from 'crypto-js';

// Validate environment variable at runtime
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
if (!secretKey) {
  throw new Error('Missing NEXT_PUBLIC_SECRET_KEY in environment variables');
}

/**
 * Encrypts a plain string using AES and returns the encrypted string.
 * @param token - The string to encrypt
 * @returns AES encrypted string
 */
export function Encryptor(token: string): string {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
}

/**
 * Decrypts an AES-encrypted string and returns the original plaintext.
 * @param encryptedToken - The encrypted string
 * @returns Original decrypted string
 */
export function Decryptor(encryptedToken: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

