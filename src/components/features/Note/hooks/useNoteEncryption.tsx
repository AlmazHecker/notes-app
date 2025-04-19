import { usePasswordStore } from "./usePasswordStore";

export const useNoteEncryption = () => {
  const { password, setPassword } = usePasswordStore();

  const encryptContent = (content: string, password: string) => {
    let encrypted = "";
    for (let i = 0; i < content.length; i++) {
      const charCode =
        content.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted);
  };

  const decryptContent = (encryptedContent: string, password: string) => {
    try {
      const content = atob(encryptedContent);
      let decrypted = "";
      for (let i = 0; i < content.length; i++) {
        const charCode =
          content.charCodeAt(i) ^ password.charCodeAt(i % password.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (e) {
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
