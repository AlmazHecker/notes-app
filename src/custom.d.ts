/// <reference types="vite-plugin-pwa/client" />

export {}

declare global {
    interface Window {
        __BASE_PATH__: string,
    }
}