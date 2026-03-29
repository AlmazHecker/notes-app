import { create } from "zustand";
import { noteService } from "./service";
import { Entry } from "./types";

interface EntryState {
  entries: Entry[];
  pathIds: string[];
  dir: string;
  getEntries: () => Promise<void>;
  createFolder: (label: string) => Promise<void>;
  setPath: (ids: string[]) => Promise<void>;
  moveNote: (noteId: string, targetFolderId: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  renameEntry: (id: string, newLabel: string) => Promise<void>;
}

export const useEntryStore = create<EntryState>((set, get) => ({
  entries: [],
  path: [],
  pathIds: [],
  dir: "",
  async getEntries() {
    try {
      const entries = await noteService.getAll();
      const sorted = [...entries].sort((a, b) => b.updatedAt - a.updatedAt);

      set({ entries: sorted });
    } catch (e) {
      set({ entries: [] });
    }
  },
  async deleteEntry(id: string) {
    await noteService.delete(id);
    await get().getEntries();
  },
  async renameEntry(id: string, newLabel: string) {
    await noteService.rename(id, newLabel);
    await get().getEntries();
  },
  async createFolder(label: string) {
    await noteService.createFolder(label);
    await get().getEntries();
  },
  async setPath(ids: string[]) {
    const currentDir = await noteService.initialize(ids);
    set({ pathIds: ids, dir: currentDir });
  },
  async moveNote(noteId: string, targetFolderId: string) {
    await noteService.move(noteId, targetFolderId);
    await get().getEntries();
  },
}));
