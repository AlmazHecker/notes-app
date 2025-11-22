import { FileSystemNoteStrategy } from "@/shared/lib/storage/FileSystemNoteStrategy";
import { NoteStorageStrategy } from "@/shared/lib/storage/storage";
import { Note } from "@/entities/note/types";

class NoteService {
  constructor(
    private strategy: NoteStorageStrategy = new FileSystemNoteStrategy()
  ) {}

  getByName = (id: string) => this.strategy.getByName(id);
  getFileByName = (id: string) => this.strategy.getFileByName(id);
  update = (note: Note) => this.strategy.update(note);
  delete = (id: string) => this.strategy.delete(id);
  getAll = () => this.strategy.getAll();
  create = (note: Omit<Note, "createdAt" | "updatedAt">) =>
    this.strategy.create(note);
  import = (id: string, blob: Blob) => this.strategy.import(id, blob);
  getTotalSize = () => this.strategy.getTotalSize();
}

export const noteService = new NoteService();
