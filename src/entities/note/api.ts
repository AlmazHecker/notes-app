import { create } from "zustand";
import { noteService } from "./service";
import { Note, NoteMeta } from "@/entities/note/types";

interface NoteState {
  notes: NoteMeta[];
  path: string[];
  pathIds: string[];
  getNotes: () => Promise<void>;
  getNote: (noteId: string) => Promise<Note | null>;
  cdInto: (folderId: string) => Promise<void>;
  goBack: () => Promise<void>;
  createFolder: (label: string) => Promise<void>;
  setPath: (ids: string[]) => Promise<void>;
  moveNote: (noteId: string, targetFolderId: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  path: [],
  pathIds: [],

  async getNotes() {
    try {
      const notes = await noteService.getAll();
      const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
      const path = noteService.getCurrentPath();
      const pathIds = noteService.getPathIds();

      set({ notes: sortedNotes, path, pathIds });
    } catch (e) {
      set({ notes: [], path: [], pathIds: [] });
    }
  },
  async getNote(noteId: string) {
    try {
      const note = await noteService.getByName(noteId);
      return note;
    } catch (e) {
      return null;
    }
  },
  async cdInto(folderId: string) {
    await noteService.cd(folderId);
    await get().getNotes();
  },
  async goBack() {
    await noteService.goBack();
    await get().getNotes();
  },
  async deleteEntry(id: string) {
    await noteService.delete(id);
    await get().getNotes();
  },
  async createFolder(label: string) {
    await noteService.createFolder(label);
    await get().getNotes();
  },
  async setPath(ids: string[]) {
    await noteService.initializeWithPathIds(ids);
    await get().getNotes();
  },
  async moveNote(noteId: string, targetFolderId: string) {
    await noteService.moveEntry(noteId, targetFolderId);
    await get().getNotes();
  },
}));
