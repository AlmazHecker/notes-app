export class CryptoHelper {
  private static algorithm = "AES-GCM";
  private static key: CryptoKey | null = null;

  public static async init(password: string): Promise<void> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const salt = encoder.encode("fixed-salt-for-demo"); // In production, generate random salt

    const baseKey = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: this.algorithm, length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  public static async encrypt(text: string): Promise<string> {
    if (!this.key) throw new Error("CryptoHelper not initialized");

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);

    const ciphertext = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      this.key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  public static async decrypt(encrypted: string): Promise<string> {
    if (!this.key) throw new Error("CryptoHelper not initialized");

    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      this.key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }
}
