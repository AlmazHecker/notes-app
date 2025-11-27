const DB_NAME = "noteApp";
const STORE_NAME = "settings";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event: Event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      reject(error);
    };
  });
}

export async function saveFolderHandle(handle: FileSystemDirectoryHandle) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put(handle, "folderHandle");

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFolderHandle(): Promise<FileSystemDirectoryHandle> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise<FileSystemDirectoryHandle>(async (resolve, reject) => {
    const request = store.get("folderHandle");

    request.onsuccess = async () => {
      let handle = request.result;

      if (!handle) {
        try {
          handle = await window.showDirectoryPicker();
          await requestPersistence();
          await saveFolderHandle(handle);
        } catch (err) {
          reject(err);
          return;
        }
      }

      resolve(handle);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function requestPersistence(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    return await navigator.storage.persist();
  }
  return false;
}

const options: FileSystemHandlePermissionDescriptor = { mode: "readwrite" };

export async function verifyPermission() {
  try {
    const handle = await getFolderHandle();

    if ((await handle.queryPermission(options)) === "granted") {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

export async function requestPermission() {
  try {
    const handle = await getFolderHandle();

    if ((await handle.requestPermission(options)) === "granted") {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

export async function withPermission<T>(fn: () => Promise<T>): Promise<T> {
  const granted = await verifyPermission();
  if (!granted) {
    const ok = await requestPermission();
    if (!ok) throw new Error("Permission denied");
  }
  return fn();
}
