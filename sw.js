/**
 * Service Worker for PWA Support
 * Implements offline-first caching strategy
 */

const CACHE_NAME = 'itinerary-v1';
const CACHE_VERSION = 1;

// Static assets to pre-cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/css/variables.css',
    '/src/css/base.css',
    '/src/css/layout.css',
    '/src/css/components.css',
    '/src/css/responsive.css',
    '/src/js/app.js',
    '/src/js/config.js',
    '/src/js/modules/countdown.js',
    '/src/js/modules/crowd.js',
    '/src/js/modules/weather.js',
    '/src/js/modules/navigation.js',
    '/src/js/modules/animations.js',
    '/src/js/modules/error-handler.js'
];

// External resources to cache on fetch
const EXTERNAL_CACHE_PATTERNS = [
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/
];

/**
 * Install event - Pre-cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Pre-caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                // Skip waiting to activate immediately
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Pre-cache failed:', error);
            })
    );
});

/**
 * Activate event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - Implement caching strategies
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // API requests - Network first
    if (url.hostname.includes('api.')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // External fonts - Cache first
    if (EXTERNAL_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Static assets - Cache first with network fallback
    event.respondWith(cacheFirst(request));
});

/**
 * Cache-first strategy
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first failed:', error);

        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }

        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Network-first strategy (for API calls)
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful API responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.warn('[SW] Network-first failed, trying cache:', error);

        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
