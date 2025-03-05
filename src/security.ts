import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export function Encryptor(token: string): string {
    const encryptedToken = CryptoJS.AES.encrypt(token, secretKey!).toString();
    return encryptedToken;
}
export function Decryptor(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey!);
    const originalToken = bytes.toString(CryptoJS.enc.Utf8);
    return originalToken;
}

