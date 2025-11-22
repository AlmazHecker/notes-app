import { create } from "zustand";
import { noteService } from "./service";
import { Note } from "@/entities/note/types";
import { requestPermission, verifyPermission } from "@/shared/lib/fileApi";

interface NoteState {
  notes: Note[];
  getNotes: () => Promise<Note[]>;
  getNote: (noteId: string) => Promise<Note | void>;
  isLoading: boolean;
  hasPermission: boolean;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  isNotFound: false,
  hasPermission: true,

  async getNotes() {
    try {
      set({ isLoading: true });
      if (!get().hasPermission) await requestPermission();

      const notes = await noteService.getAll();
      const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

      set({ notes: sortedNotes, isLoading: false, hasPermission: true });

      return sortedNotes;
    } catch (e) {
      set({
        isLoading: false,
        hasPermission: await verifyPermission(),
      });
      return [];
    }
  },
  async getNote(noteId: string) {
    try {
      if (!get().hasPermission) await requestPermission();
      const note = await noteService.getByName(noteId);

      set({ hasPermission: true });
      return note;
    } catch (e) {
      set({
        hasPermission: await verifyPermission(),
      });
    }
  },
}));
