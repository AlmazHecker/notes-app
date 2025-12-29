import { create } from "zustand";
import { noteService } from "./service";
import { Note, NoteMeta } from "@/entities/note/types";

interface NoteState {
  notes: NoteMeta[];
  getNotes: () => Promise<void>;
  getNote: (noteId: string) => Promise<Note | null>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],

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
    try {
      const note = await noteService.getByName(noteId);
      return note;
    } catch (e) {
      return null;
    }
  },
}));
