import { create } from "zustand";
import { noteService } from "./service";
import { Note, NoteMeta } from "@/entities/note/types";

interface NoteState {
  notes: NoteMeta[];
  pathIds: string[];
  dir: string;
  getNotes: () => Promise<void>;
  getNote: (noteId: string) => Promise<Note | null>;
  createFolder: (label: string) => Promise<void>;
  setPath: (ids: string[]) => Promise<void>;
  moveNote: (noteId: string, targetFolderId: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  renameEntry: (id: string, newLabel: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  path: [],
  pathIds: [],
  dir: "",
  async getNotes() {
    try {
      const notes = await noteService.getAll();
      const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

      set({ notes: sortedNotes });
    } catch (e) {
      set({ notes: [] });
    }
  },
  async getNote(noteId: string) {
    return noteService.getByName(noteId);
  },
  async deleteEntry(id: string) {
    await noteService.delete(id);
    await get().getNotes();
  },
  async renameEntry(id: string, newLabel: string) {
    await noteService.renameEntry(id, newLabel);
    await get().getNotes();
  },
  async createFolder(label: string) {
    await noteService.createFolder(label);
    await get().getNotes();
  },
  async setPath(ids: string[]) {
    const currentDir = await noteService.initialize(ids);
    set({ pathIds: ids, dir: currentDir });
  },
  async moveNote(noteId: string, targetFolderId: string) {
    await noteService.moveEntry(noteId, targetFolderId);
    await get().getNotes();
  },
}));
