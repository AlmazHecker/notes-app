import type JSZip from "jszip";

export async function zipDirectory(
  dirHandle: FileSystemDirectoryHandle,
  zip: JSZip,
): Promise<void> {
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "directory") {
      const folder = zip.folder(name);
      if (folder) {
        await zipDirectory(handle, folder);
      }
    } else {
      const file = await handle.getFile();
      zip.file(name, file);
    }
  }
}

export async function unzipToDirectory(
  zip: JSZip,
  targetDir: FileSystemDirectoryHandle,
  zipPath = "",
  skipFiles: string[] = [],
): Promise<void> {
  const prefix = zipPath ? `${zipPath}/` : "";

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

    if (skipFiles.includes(name)) continue;

    if (entry.dir) {
      const subDirHandle = await targetDir.getDirectoryHandle(name, {
        create: true,
      });

      await unzipToDirectory(
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
