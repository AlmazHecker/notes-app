import { create } from "zustand";
import { Note } from "@/shared/lib/notesDB";
import { noteService } from "./service";
import { getFolderHandle, verifyPermission } from "@/shared/lib/fileApi";

interface NoteState {
  notes: Note[];
  fetchNotes: () => Promise<Note[]>;
  verifyPermission: () => Promise<boolean>;
  isLoading: boolean;
  hasPermission: boolean;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  hasPermission: true, // by default
  fetchNotes: async () => {
    set({ isLoading: true });
    const notes = await noteService.getAll();
    const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

    set({ notes: sortedNotes, isLoading: false });

    return sortedNotes;
  },
  verifyPermission: async () => {
    try {
      set({ isLoading: true });

      const handle = await getFolderHandle();

      if (!(await verifyPermission(handle))) {
        set({ hasPermission: false });
        return false;
      }
      set({ hasPermission: true });

      return true;
    } catch (e) {
      set({ hasPermission: false });
      return false;
    }
  },
}));
