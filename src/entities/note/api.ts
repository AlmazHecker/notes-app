import { create } from "zustand";
import { noteService } from "./service";
import { Note } from "@/entities/note/types";
import { requestPermission, verifyPermission } from "@/shared/lib/fileApi";

interface NoteState {
  notes: Note[];
  getNotes: () => Promise<void>;
  getNote: (noteId: string) => Promise<Note | void>;
  hasPermission: boolean;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  hasPermission: true,

  async getNotes() {
    try {
      if (!get().hasPermission) await requestPermission();

      const notes = await noteService.getAll();
      const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

      set({ notes: sortedNotes, hasPermission: true });
    } catch (e) {
      set({ notes: [], hasPermission: await verifyPermission() });
    }
  },
  async getNote(noteId: string) {
    try {
      if (!get().hasPermission) await requestPermission();
      const note = await noteService.getByName(noteId);

      set({ hasPermission: true });
      return note;
    } catch (e) {
      set({ hasPermission: await verifyPermission() });
    }
  },
}));
