import { argon2id } from "hash-wasm";

export class NoteEncryption {
  private static readonly MAGIC_HEADER = "NOTE_APP_v1|";
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  private static strToBuffer(str: string): ArrayBuffer {
    return NoteEncryption.encoder.encode(str).buffer;
  }

  private static bufferToStr(buffer: ArrayBuffer): string {
    return NoteEncryption.decoder.decode(buffer);
  }

  private static bufferToBase64(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer));
  }

  private static base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  private static async deriveKey(password: string, salt: Uint8Array) {
    const keyBytesRaw = await argon2id({
      password,
      salt,
      parallelism: 1,
      iterations: 3,
      memorySize: 2 ** 16,
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
  }

  static async encrypt(content: string, password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);

    const data = this.MAGIC_HEADER + content;
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      this.strToBuffer(data)
    );

    const combined = new Uint8Array(
      salt.byteLength + iv.byteLength + encrypted.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    return this.bufferToBase64(combined);
  }

  static async decrypt(encrypted: string, password: string): Promise<string> {
    const combined = NoteEncryption.base64ToBuffer(encrypted);
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await NoteEncryption.deriveKey(password, new Uint8Array(salt));
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      ciphertext
    );

    const text = NoteEncryption.bufferToStr(decrypted);
    if (!text.startsWith(NoteEncryption.MAGIC_HEADER))
      throw new Error("Invalid password");

    return text.slice(NoteEncryption.MAGIC_HEADER.length);
  }
}
