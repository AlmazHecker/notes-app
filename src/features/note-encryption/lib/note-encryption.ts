import { argon2id } from "hash-wasm";
import type { NoteEntry } from "@/entities/entry/types";

const MAGIC_HEADER = "NOTE_APP_v1|";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function strToBuffer(str: string): ArrayBuffer {
  return encoder.encode(str).buffer;
}

function bufferToStr(buffer: ArrayBuffer): string {
  return decoder.decode(buffer);
}

async function deriveKey(password: string, salt: Uint8Array) {
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

export async function encrypt(
  content: string,
  password: string,
): Promise<NoteEntry["content"]> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const data = MAGIC_HEADER + content;

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    strToBuffer(data),
  );

  const combined = new Uint8Array(
    salt.byteLength + iv.byteLength + encrypted.byteLength,
  );

  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

  return combined;
}

export async function decrypt(
  encrypted: NoteEntry["content"],
  password: string,
): Promise<string> {
  const salt = encrypted.slice(0, 16);
  const iv = encrypted.slice(16, 28);
  const ciphertext = encrypted.slice(28);

  const key = await deriveKey(password, new Uint8Array(salt));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    ciphertext,
  );

  const text = bufferToStr(decrypted);

  if (!text.startsWith(MAGIC_HEADER)) {
    throw new Error("Invalid password");
  }

  return text.slice(MAGIC_HEADER.length);
}
