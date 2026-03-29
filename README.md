# Notes

Simple notes app based on OPFS(Origin Private File System) with optional end-to-end encryption.

## Features

- **Local Storage**: Notes and folders are stored directly on the user's device using the OPFS
- **Folder Organization**: Group items into folders for better structure
- **Note Encryption**: Secure your sensitive files with AES-256-GCM encryption and Argon2id key derivation
- **Resizable Panes**: Fully adjustable interface layout
- **Rich Text Editing**: Powered by Tiptap editor for a great writing experience
- **Simple Interface**: Clean, intuitive UI for managing files and folders
- **Import & Export**: Backup or transfer your notes and folders with easy import/export support

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AlmazHecker/notes-app.git
   ```

2. Install dependencies:

   ```bash
   cd notes-app
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **First Run**: When you first open the app, you'll be prompted to select a folder where notes will be stored.

2. **Creating Notes**:
   - Click the "+" button to create a new note
   - Give your note a title and start writing
   - Click the save icon in the top-right corner

3. **Managing Encrypted Notes**:
   - Encrypted notes show a lock icon
   - Clicking an encrypted note prompts for password
   - Wrong passwords show immediate feedback

## Encryption Details

### Security Implementation

- **AES-GCM 256-bit** encryption via Web Crypto API
- **Argon2id** key derivation (via hash-wasm)
- **Unique initialization vectors** (12 bytes) and **salts** (16 bytes) for each encryption
- **Magic header validation** to ensure successful decryption
- **No plaintext storage** of sensitive data

## Technical Details

### Stack

- React
- TypeScript
- Tiptap (Text editor)
- Lucide React (Icons)
- Vite (Build tool)
- Zustand (State Management)

### Storage

Notes are stored in the **Origin Private File System (OPFS)**.

- Each note is stored as a **separate file** containing only raw content.
- A single `index.json` file stores metadata for fast access.

```
opfs/
  ├── index.json
  ├── note_<id>
  ├── note_<id>
  └── ...
```

### Index (`index.json`)

Maps entry IDs to metadata:

```json
{
  "note-id": {
    "id": "note-id",
    "type": "file",
    "label": "Note Title",
    "createdAt": 1234567890,
    "updatedAt": 1234567890,
    "isEncrypted": false,
    "tags": [],
    "snippet": "Short content preview..."
  },
  "folder-id": {
    "id": "folder-id",
    "type": "folder",
    "label": "My Folder",
    "createdAt": 1234567890,
    "updatedAt": 1234567890,
    "isEncrypted": false
  }
}
```

Used for:

- Fast entry listing and folder organization
- Sorting and filtering
- Rendering previews without loading full content

### Note Files

Each note file containing raw content is loaded **on demand** when opening a note. Encrypted contents are often handled as `Uint8Array`.

### Data Model

```ts
export type BaseEntry = {
  id: string;
  label: string;
  createdAt: number;
  updatedAt: number;
  isEncrypted: boolean;
};

export type FolderEntry = BaseEntry & {
  type: "folder";
};

export type NoteEntry = BaseEntry & {
  type: "file";
  snippet: string;
  tags?: string[];
};

export type Entry = FolderEntry | NoteEntry;

export type Note = NoteEntry & {
  content: RawNoteContent;
};

export type RawNoteContent = Uint8Array<ArrayBuffer>;
```

## Future Features

- [ ] Tagging and categorization
- [ ] Markdown support

## Browser Support

This app requires a modern browser with support for:

- Web Crypto API

## Contributing

Contributions are welcome! Please open an issue or pull request for any improvements.

## License

MIT
