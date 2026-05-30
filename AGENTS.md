# AI Agent Guide & Reference (AGENTS.md)

Strict operational rules and constraints for AI agents. Read this before modifying code.

## 1. Stack & Critical Architecture (FSD)
* **Stack:** React 19, TS (Strict), Vite, React Router 7 (Hash Routing), Zustand, Tailwind v4, Radix, Tiptap.
* **Crypto:** Web Crypto API (AES-GCM), hash-wasm (Argon2id).
* **Architecture:** Strict Feature-Sliced Design (FSD layers: app, pages, widgets, features, entities, shared).
* **CRITICAL - NO BARREL FILES (`index.ts`):** Absolutely forbidden to prevent Vite/HMR slowdowns. Use **Explicit Deep Imports** only.
  * *Correct:* `import { useEntryStore } from '@/entities/entry/api/store'`
  * *Incorrect:* `import { useEntryStore } from '@/entities/entry'`
* **No Cross-Imports:** Modules within `features/` or `entities/` cannot cross-import each other on the same layer. Compose them at `widgets/` or `pages/`.

## 2. Common Commands
* `npm run lint` Run Biome check and write fixes. Always run this before completing a task.
* `npm run format` Run Biome code formatter and write fixes.
* `npm run build` Verify strict TypeScript compilation and production bundling.
* `npm run build:gh-pages` Build the static package specifically optimized for GitHub Pages.
* **Testing:** No test framework is configured. **Do not generate test files** (`*.test.ts`, `*.spec.ts`).

## 3. Core Business Logic & Domain Rules
* **Local-First / No Backend:** No external APIs. Data flow strictly goes through `src/entities/entry/service.ts`.
* **OPFS Manifest:** Single `index.json` stores directory structure, tags, and snippets. Any file CRUD action **must synchronously update `index.json`** to avoid breaking the UI.
* **Memory Optimization:** Full note payloads are stored as raw `Uint8Array`. Never load full note files into memory for list rendering; use the lightweight `snippet` property from `index.json`.
* **Encryption Guardrails:** Encrypted note content must never touch local storage, RAM (unnecessarily), or OPFS in plaintext.

---

# How an AI Agent Should Work

## Safe Editing Guidelines
1. **Handle OPFS Asynchrony:** File operations are async. Ensure Zustand stores and UI elements handle loading states and `await` transactions.
2. **Binary Streams:** Note contents are `Uint8Array`. Do not accidentally stringify or corrupt binary data during state changes.
3. **No Schema Migrations:** No DB migration pipeline exists. Any changes to `index.json` structure must be backward-compatible in `service.ts`.

## Protected Files (DO NOT MODIFY automatically)
Do not alter without explicit, direct user instructions:
* `src/entities/entry/service.ts` (Core OPFS engine; high data-corruption risk)
* `pwa/service-worker.ts` & `vite-plugins/dynamic-manifest.ts` (PWA build assets)
* `package-lock.json` / `dist/`

## Prompting Shortcuts
* UI: Use Radix UI primitives + Tailwind. Do not build custom accessible primitives.
* Data: Treat `service.ts` modifications with maximum scrutiny. Data loss is permanent.