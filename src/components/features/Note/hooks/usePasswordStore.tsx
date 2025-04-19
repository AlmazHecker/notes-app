import { create } from "zustand";

interface PasswordStore {
  password: string;
  setPassword: (password: string) => void;
}

export const usePasswordStore = create<PasswordStore>((set) => ({
  password: "",
  setPassword: (password) => set({ password }),
}));
