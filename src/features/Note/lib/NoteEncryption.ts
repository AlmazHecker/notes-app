import { RawNoteContent } from "@/entities/note/types";
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

    return crypto.subtle.importKey(
      "raw",
      keyBytesRaw.buffer as ArrayBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );
  }

  static async encrypt(
    content: string,
    password: string,
  ): Promise<RawNoteContent> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);

    const data = this.MAGIC_HEADER + content;
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      this.strToBuffer(data),
    );

    const combined = new Uint8Array(
      salt.byteLength + iv.byteLength + encrypted.byteLength,
    );
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

    return combined;
  }

  static async decrypt(
    encrypted: RawNoteContent,
    password: string,
  ): Promise<string> {
    const salt = encrypted.slice(0, 16);
    const iv = encrypted.slice(16, 28);
    const ciphertext = encrypted.slice(28);

    const key = await NoteEncryption.deriveKey(password, new Uint8Array(salt));
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      ciphertext,
    );

    const text = NoteEncryption.bufferToStr(decrypted);

    if (!text.startsWith(NoteEncryption.MAGIC_HEADER))
      throw new Error("Invalid password");

    return text.slice(NoteEncryption.MAGIC_HEADER.length);
  }
}
