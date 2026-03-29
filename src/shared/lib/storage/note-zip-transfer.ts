import JSZip from "jszip";

/**
 * Utility class for zipping and unzipping notes and folders.
 */
export class NoteZipTransfer {
  /**
   * Recursively adds the contents of a directory handle to a JSZip object.
   * @param dirHandle The OPFS directory handle to read from.
   * @param zip The JSZip folder object to write to.
   * @param skipFiles List of filenames to skip (e.g., specific index files at root).
   */
  public static async zipDirectory(
    dirHandle: FileSystemDirectoryHandle,
    zip: JSZip,
  ): Promise<void> {
    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === "directory") {
        const folder = zip.folder(name);
        if (folder) {
          await this.zipDirectory(handle, folder);
        }
      } else {
        const file = await handle.getFile();
        zip.file(name, file);
      }
    }
  }

  /**
   * Recursively extracts the contents of a JSZip object into an OPFS directory handle.
   * @param zip The JSZip object or folder to read from.
   * @param targetDir The OPFS directory handle to write to.
   * @param zipPath Current path within the ZIP structure.
   * @param skipFiles List of filenames to skip during extraction.
   */
  public static async unzipToDirectory(
    zip: JSZip,
    targetDir: FileSystemDirectoryHandle,
    zipPath = "",
    skipFiles: string[] = [],
  ): Promise<void> {
    const prefix = zipPath ? zipPath + "/" : "";

    // JSZip stores all paths flat. We need to find direct children of zipPath.
    const entries = Object.keys(zip.files).filter((path) => {
      if (!path.startsWith(prefix)) return false;
      const relative = path.slice(prefix.length);
      if (!relative || relative === "/") return false;

      const parts = relative.split("/");
      // parts.length === 1 for files or folder/ (no trailing zip entries for folders usually,
      // but JSZip often has entry for folder/ if created with .folder())
      return parts.length === 1 || (parts.length === 2 && parts[1] === "");
    });

    for (const entryPath of entries) {
      const entry = zip.files[entryPath];
      const name = entryPath.slice(prefix.length).replace(/\/$/, "");

      if (skipFiles.includes(name)) continue;

      if (entry.dir) {
        const subDirHandle = await targetDir.getDirectoryHandle(name, {
          create: true,
        });
        await this.unzipToDirectory(
          zip,
          subDirHandle,
          entryPath.replace(/\/$/, ""),
          skipFiles,
        );
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
}
