import JSZip from "jszip";
import { getEscapedHtml } from "../utils";
import { NoteStorageStrategy } from "./storage";
import { Note, NoteMeta } from "@/entities/note/types";
import { NoteZipTransfer } from "./NoteZipTransfer";

const INDEX_FILE = "index.json";

export class FileSystemNoteStrategy implements NoteStorageStrategy {
  private index: Record<string, NoteMeta> = {};
  private root!: FileSystemDirectoryHandle;
  private directoryStack: FileSystemDirectoryHandle[] = [];
  private pathStack: string[] = [];
  private pathIdStack: string[] = [];

  private get currentDir() {
    return this.directoryStack[this.directoryStack.length - 1];
  }

  public async initialize() {
    this.root = await navigator.storage.getDirectory();
    this.directoryStack = [this.root];
    this.pathStack = [];
    this.pathIdStack = [];
    await this.loadIndex();
  }

  public async initializeWithPathIds(ids: string[]) {
    await this.initialize();
    for (const id of ids) {
      try {
        await this.cd(id);
      } catch (e) {
        // Stop if a folder in the path is missing
        break;
      }
    }
  }

  private async loadIndex() {
    try {
      const handle = await this.currentDir.getFileHandle(INDEX_FILE, {
        create: true,
      });
      const file = await handle.getFile();
      const text = await file.text();
      this.index = text ? JSON.parse(text) : {};
    } catch (e) {
      this.index = {};
    }
  }

  private async saveIndex() {
    const handle = await this.currentDir.getFileHandle(INDEX_FILE, {
      create: true,
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(this.index));
    await writable.close();
  }

  async create(newNote: Omit<Note, "createdAt" | "updatedAt">): Promise<Note> {
    const note: Note = {
      ...newNote,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: "note",
    };
    return this.update(note);
  }

  async update(updatedNote: Note) {
    const note = { ...updatedNote, updatedAt: Date.now() };
    const snippet =
      getEscapedHtml(note.content.slice(0, 100)) +
      (note.content.length > 100 ? "..." : "");

    const fileHandle = await this.currentDir.getFileHandle(note.id, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    const data = note.content;
    await writable.write(data);
    await writable.close();

    this.index[note.id] = {
      id: note.id,
      label: note.label,
      tags: note.tags,
      isEncrypted: note.isEncrypted,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      snippet,
      type: "note",
    };
    await this.saveIndex();
    return note;
  }

  async delete(noteId: string) {
    const entry = this.index[noteId];
    if (!entry) return;

    if (entry.type === "folder") {
      // @ts-ignore
      await this.currentDir.removeEntry(noteId, { recursive: true });
    } else {
      await this.currentDir.removeEntry(noteId);
    }

    delete this.index[noteId];
    await this.saveIndex();
  }

  public async clear() {
    // @ts-ignore
    await this.root.remove({ recursive: true });
    await this.initialize();
  }

  async getByName(noteId: string): Promise<Note | null> {
    const entry = this.index[noteId];
    if (!entry || entry.type === "folder") return null;

    const fileHandle = await this.currentDir.getFileHandle(noteId);
    const file = await fileHandle.getFile();

    const content = await file.text();
    return { ...entry, content };
  }

  async getAll(): Promise<NoteMeta[]> {
    return Object.values(this.index);
  }

  async getStorageEstimate(): Promise<StorageEstimate> {
    return navigator.storage.estimate();
  }

  async import(blob: Blob) {
    try {
      const zip = await JSZip.loadAsync(blob);
      await this.mergeImport(zip, this.root, "");
      await this.loadIndex();
    } catch (e) {
      try {
        const text = await blob.text();
        const noteData: Note = JSON.parse(text);
        if (!noteData.id) throw new Error("Invalid note data");
        await this.update(noteData);
      } catch (legacyErr) {
        console.error("Import failed:", legacyErr);
        throw new Error("Failed to import notes");
      }
    }
  }

  private async mergeImport(
    zip: JSZip,
    targetDir: FileSystemDirectoryHandle,
    zipPath: string,
  ) {
    const prefix = zipPath ? zipPath + "/" : "";
    const entries = Object.keys(zip.files).filter((path) => {
      if (!path.startsWith(prefix)) return false;
      const relative = path.slice(prefix.length);
      if (!relative || relative === "/") return false;
      const parts = relative.split("/");
      return parts.length === 1 || (parts.length === 2 && parts[1] === "");
    });

    for (const entryPath of entries) {
      const entry = zip.files[entryPath];
      const name = entryPath.slice(prefix.length).replace(/\/$/, "");

      if (entry.dir) {
        const subDirHandle = await targetDir.getDirectoryHandle(name, {
          create: true,
        });
        await this.mergeImport(zip, subDirHandle, entryPath.replace(/\/$/, ""));
      } else if (name === INDEX_FILE) {
        const zipIndex: Record<string, NoteMeta> = JSON.parse(
          await entry.async("text"),
        );
        let localIndex: Record<string, NoteMeta> = {};
        try {
          const handle = await targetDir.getFileHandle(INDEX_FILE);
          const file = await handle.getFile();
          const text = await file.text();
          localIndex = text ? JSON.parse(text) : {};
        } catch (e) {}

        const mergedIndex = { ...localIndex, ...zipIndex };
        const handle = await targetDir.getFileHandle(INDEX_FILE, {
          create: true,
        });
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(mergedIndex));
        await writable.close();
      } else {
        const blob = await entry.async("blob");
        const fileHandle = await targetDir.getFileHandle(name, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      }
    }
  }

  async cd(folderId: string): Promise<void> {
    const entry = this.index[folderId];
    if (!entry || entry.type !== "folder") {
      throw new Error("Folder not found");
    }

    const handle = await this.currentDir.getDirectoryHandle(folderId);
    this.directoryStack.push(handle);
    this.pathStack.push(entry.label);
    this.pathIdStack.push(folderId);
    await this.loadIndex();
  }

  async goBack(): Promise<void> {
    if (this.directoryStack.length > 1) {
      this.directoryStack.pop();
      this.pathStack.pop();
      this.pathIdStack.pop();
      await this.loadIndex();
    }
  }

  getCurrentPath(): string[] {
    return this.pathStack;
  }

  getPathIds(): string[] {
    return this.pathIdStack;
  }

  async createFolder(label: string): Promise<NoteMeta> {
    const id = crypto.randomUUID();
    await this.currentDir.getDirectoryHandle(id, { create: true });

    const folderMeta: NoteMeta = {
      id,
      label,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isEncrypted: false,
      snippet: "",
      type: "folder",
    };

    this.index[id] = folderMeta;
    await this.saveIndex();

    // Initialize the folder with an empty index
    const folderHandle = await this.currentDir.getDirectoryHandle(id);
    const indexHandle = await folderHandle.getFileHandle(INDEX_FILE, {
      create: true,
    });
    const writable = await indexHandle.createWritable();
    await writable.write(JSON.stringify({}));
    await writable.close();

    return folderMeta;
  }

  private async updateFolderIndex(
    folderHandle: FileSystemDirectoryHandle,
    updateFn: (index: Record<string, NoteMeta>) => void,
  ) {
    const indexHandle = await folderHandle.getFileHandle(INDEX_FILE, {
      create: true,
    });
    const file = await indexHandle.getFile();
    const text = await file.text();
    const index = text ? JSON.parse(text) : {};

    updateFn(index);

    const writable = await indexHandle.createWritable();
    await writable.write(JSON.stringify(index));
    await writable.close();
  }

  async moveEntry(id: string, targetFolderId: string): Promise<void> {
    const entry = this.index[id];
    if (!entry) return;

    if (id === targetFolderId) return;

    let handle: FileSystemFileHandle | FileSystemDirectoryHandle;
    if (entry.type === "folder") {
      handle = await this.currentDir.getDirectoryHandle(id);
    } else {
      handle = await this.currentDir.getFileHandle(id);
    }

    const targetDirHandle =
      await this.currentDir.getDirectoryHandle(targetFolderId);

    // @ts-ignore
    if (typeof handle.move === "function") {
      // @ts-ignore
      await handle.move(targetDirHandle);
    } else {
      throw new Error("Your browser does not support moving files in OPFS");
    }

    delete this.index[id];
    await this.saveIndex();

    await this.updateFolderIndex(targetDirHandle, (targetIndex) => {
      targetIndex[id] = { ...entry, updatedAt: Date.now() };
    });
  }

  async exportFull(): Promise<Blob> {
    const zip = new JSZip();
    await NoteZipTransfer.zipDirectory(this.root, zip);
    return await zip.generateAsync({ type: "blob" });
  }
}
