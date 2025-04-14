export const getHardcodedKey = async () => {
  const raw = new TextEncoder().encode("BEBRA123".padEnd(32, "_")); // 32 bytes
  return crypto.subtle.importKey("raw", raw, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

// cryptoUtils.ts
export const encode = (data: ArrayBuffer | Uint8Array) =>
  btoa(
    String.fromCharCode(
      ...new Uint8Array(data instanceof Uint8Array ? data.buffer : data),
    ),
  );

export const decode = (base64: string) =>
  new Uint8Array(
    atob(base64)
      .split("")
      .map((c) => c.charCodeAt(0)),
  );

export const exportKey = async (key: CryptoKey) =>
  encode(await crypto.subtle.exportKey("raw", key));

export const importKey = async (base64: string) =>
  crypto.subtle.importKey("raw", decode(base64).buffer, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);

export const encrypt = async (key: CryptoKey, data: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(data),
  );
  return { encrypted, iv };
};

export const decrypt = async (key: CryptoKey, enc: string, iv: string) =>
  new TextDecoder().decode(
    await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: decode(iv) },
      key,
      decode(enc).buffer,
    ),
  );

export const genKey = () =>
  crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
