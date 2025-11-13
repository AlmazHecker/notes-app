import { usePasswordStore } from "./usePasswordStore";
import { argon2id } from "hash-wasm";

export const useNoteEncryption = () => {
  const { password, setPassword } = usePasswordStore();

  const strToBuffer = (str: string): ArrayBuffer =>
    new TextEncoder().encode(str).buffer;

  const bufferToStr = (buffer: ArrayBuffer): string =>
    new TextDecoder().decode(buffer);

  const bufferToBase64 = (buffer: Uint8Array<ArrayBuffer>): string =>
    btoa(String.fromCharCode(...new Uint8Array(buffer)));

  const base64ToBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  const deriveKey = async (password: string, salt: Uint8Array) => {
    const keyBytesRaw = await argon2id({
      password,
      salt,
      parallelism: 1,
      iterations: 3,
      memorySize: 2 ** 16, // 64 MB
      hashLength: 32,
      outputType: "binary",
    });

    const keyBytes = new Uint8Array(keyBytesRaw as unknown as ArrayBuffer);

    return crypto.subtle.importKey(
      "raw",
      keyBytes.buffer,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const encryptContent = async (content: string, password: string) => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      strToBuffer(content)
    );

    const combined = new Uint8Array(
      salt.byteLength + iv.byteLength + encrypted.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    return bufferToBase64(combined);
  };

  const decryptContent = async (encryptedContent: string, password: string) => {
    const combined = base64ToBuffer(encryptedContent);
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await deriveKey(password, new Uint8Array(salt));
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      ciphertext
    );

    return bufferToStr(decrypted);
  };

  return { password, setPassword, encryptContent, decryptContent };
};
