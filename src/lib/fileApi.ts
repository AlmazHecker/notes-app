const DB_NAME = "noteApp";
const STORE_NAME = "settings";

export async function saveFolderHandle(handle: FileSystemDirectoryHandle) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(handle, "folderHandle");
  await tx.done;
}

export async function getFolderHandle(): Promise<FileSystemDirectoryHandle> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  let handle = await tx.objectStore(STORE_NAME).get("folderHandle");

  if (!handle) {
    handle = await window.showDirectoryPicker();
    await requestPersistence();

    saveFolderHandle(handle);
  }
  return handle;
}

async function openDB() {
  return await (
    await import("idb")
  ).openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

export async function requestPersistence(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist();
  }
  return false;
}

export async function verifyPermission(handle: FileSystemDirectoryHandle) {
  const options: FileSystemHandlePermissionDescriptor = { mode: "readwrite" };
  if ((await handle.queryPermission(options)) === "granted") {
    return true;
  }
  if ((await handle.requestPermission(options)) === "granted") {
    return true;
  }
  return false;
}
