import { create } from "zustand";
import { Note } from "@/lib/notesDB";
import { NoteService } from "./service";

interface NoteState {
  notes: Note[];
  fetchNotes: () => Promise<Note[]>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],

  fetchNotes: async () => {
    const notes = await NoteService.getAll();
    const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

    set({ notes: sortedNotes });

    return sortedNotes;
  },
}));
