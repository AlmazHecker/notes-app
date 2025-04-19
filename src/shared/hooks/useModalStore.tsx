import { create } from "zustand";

type ModalStore = {
  showSetPasswordModal: boolean;
  showEnterPasswordModal: boolean;
  actions: {
    openSetPasswordModal: () => void;
    closeSetPasswordModal: () => void;
    openEnterPasswordModal: () => void;
    closeEnterPasswordModal: () => void;
  };
};

export const useModalStore = create<ModalStore>((set) => ({
  showSetPasswordModal: false,
  showEnterPasswordModal: false,
  actions: {
    openSetPasswordModal: () => set({ showSetPasswordModal: true }),
    closeSetPasswordModal: () => set({ showSetPasswordModal: false }),
    openEnterPasswordModal: () => set({ showEnterPasswordModal: true }),
    closeEnterPasswordModal: () => set({ showEnterPasswordModal: false }),
  },
}));

export const useSetPasswordModalOpen = () =>
  useModalStore((state) => state.showSetPasswordModal);
export const useEnterPasswordModalOpen = () =>
  useModalStore((state) => state.showEnterPasswordModal);
export const useModalActions = () => useModalStore((state) => state.actions);
