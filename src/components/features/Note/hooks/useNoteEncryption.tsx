import { usePasswordStore } from "./usePasswordStore";

export const useNoteEncryption = () => {
  const { password, setPassword } = usePasswordStore();

  // Helper function to convert a string to ArrayBuffer
  const strToBuffer = (str: string): ArrayBuffer => {
    return new TextEncoder().encode(str).buffer;
  };

  // Helper function to convert ArrayBuffer to string
  const bufferToStr = (buffer: ArrayBuffer): string => {
    return new TextDecoder().decode(buffer);
  };

  // Helper function to convert ArrayBuffer to base64
  const bufferToBase64 = (buffer: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  };

  // Helper function to convert base64 to ArrayBuffer
  const base64ToBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Derive a cryptographic key from password
  const deriveKey = async (
    password: string,
    salt: ArrayBuffer
  ): Promise<CryptoKey> => {
    const passwordBuffer = strToBuffer(password);
    const importedKey = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      importedKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const encryptContent = async (
    content: string,
    password: string
  ): Promise<string | null> => {
    try {
      // Generate a random salt (16 bytes)
      const salt = crypto.getRandomValues(new Uint8Array(16));

      // Generate a random IV (12 bytes recommended for AES-GCM)
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Derive the key
      const key = await deriveKey(password, salt);

      // Encrypt the content
      const encryptedContent = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        strToBuffer(content)
      );

      // Combine salt + iv + encrypted content
      const combined = new Uint8Array(
        salt.byteLength + iv.byteLength + encryptedContent.byteLength
      );
      combined.set(new Uint8Array(salt), 0);
      combined.set(new Uint8Array(iv), salt.byteLength);
      combined.set(
        new Uint8Array(encryptedContent),
        salt.byteLength + iv.byteLength
      );

      return bufferToBase64(combined);
    } catch (e) {
      console.error("Encryption error:", e);
      return null;
    }
  };

  const decryptContent = async (
    encryptedContent: string,
    password: string
  ): Promise<string | null> => {
    try {
      // Convert from base64 to buffer
      const combined = base64ToBuffer(encryptedContent);

      // Extract salt (first 16 bytes)
      const salt = combined.slice(0, 16);

      // Extract iv (next 12 bytes)
      const iv = combined.slice(16, 16 + 12);

      // Extract actual ciphertext (rest)
      const ciphertext = combined.slice(16 + 12);

      // Derive the key
      const key = await deriveKey(password, salt);

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        ciphertext
      );

      return bufferToStr(decrypted);
    } catch (e) {
      console.error("Decryption error:", e);
      return null;
    }
  };

  return {
    password,
    setPassword,
    encryptContent,
    decryptContent,
  };
};
