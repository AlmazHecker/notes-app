import { create } from "zustand";
import { entryService } from "./service";
import type { Entry } from "./types";

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
      const entries = await entryService.getAll();
      // folders first
      const sorted = [...entries].sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return b.updatedAt - a.updatedAt;
      });

      set({ entries: sorted });
    } catch (_e) {
      set({ entries: [] });
    }
  },
  async deleteEntry(id: string) {
    await entryService.delete(id);
    await get().getEntries();
  },
  async renameEntry(id: string, newLabel: string) {
    await entryService.rename(id, newLabel);
    await get().getEntries();
  },
  async createFolder(label: string) {
    await entryService.createFolder(label);
    await get().getEntries();
  },
  async setPath(ids: string[]) {
    const currentDir = await entryService.initialize(ids);
    set({ pathIds: ids, dir: currentDir });
  },
  async moveNote(noteId: string, targetFolderId: string) {
    await entryService.move(noteId, targetFolderId);
    await get().getEntries();
  },
}));
