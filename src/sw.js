import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

const adjustedManifest = self.__WB_MANIFEST.map(entry => ({
    ...entry,
    url: `${__BASE_PATH__}${entry.url}` // gh-pages lore
}))

// Precaching - handled automatically by Vite PWA plugin
precacheAndRoute(adjustedManifest);

// Cache Google Fonts
registerRoute(
    ({ url }) => {
        // Match both fonts.googleapis.com and the specific CSS request pattern
        return url.origin === 'https://fonts.googleapis.com' ||
            url.origin === 'https://fonts.gstatic.com' ||
            url.href.startsWith('https://fonts.googleapis.com/css2');
    },
    new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            }),
        ],
    })
);

// Cache images
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
)
