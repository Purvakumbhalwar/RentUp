const CACHE_NAME = 'mern-estate-v1';
const IMAGE_CACHE_NAME = 'mern-estate-images-v1';
const API_CACHE_NAME = 'mern-estate-api-v1';

// Cache strategies
const CACHE_FIRST = 'cache-first';
const NETWORK_FIRST = 'network-first';
const STALE_WHILE_REVALIDATE = 'stale-while-revalidate';

// URLs to cache on install
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Image extensions to cache
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Check if URL is an image
const isImage = (url) => {
  return imageExtensions.some(ext => url.pathname.toLowerCase().includes(ext)) ||
         url.href.includes('firebasestorage.googleapis.com') ||
         url.href.includes('hubspotusercontent');
};

// Check if URL is an API call
const isAPI = (url) => {
  return url.pathname.startsWith('/api/');
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);
  
  // Handle images with cache-first strategy
  if (isImage(requestURL)) {
    event.respondWith(
      handleImageRequest(event.request)
    );
    return;
  }
  
  // Handle API requests with network-first strategy
  if (isAPI(requestURL)) {
    event.respondWith(
      handleAPIRequest(event.request)
    );
    return;
  }
  
  // Handle other requests with stale-while-revalidate
  event.respondWith(
    handleOtherRequests(event.request)
  );
});

// Cache-first strategy for images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version immediately
      // Update cache in background
      fetchAndCache(request, cache);
      return cachedResponse;
    }
    
    // If not in cache, fetch and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Image caching error:', error);
    return fetch(request);
  }
}

// Network-first strategy for API calls
async function handleAPIRequest(request) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    
    try {
      // Try network first
      const response = await fetch(request);
      if (response.ok) {
        // Cache successful responses for 5 minutes
        const responseToCache = response.clone();
        responseToCache.headers.append('sw-cache-timestamp', Date.now().toString());
        cache.put(request, responseToCache);
      }
      return response;
    } catch (networkError) {
      // Network failed, try cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        // Check if cache is still fresh (5 minutes)
        const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < fiveMinutes) {
          return cachedResponse;
        }
      }
      throw networkError;
    }
  } catch (error) {
    console.error('API caching error:', error);
    return fetch(request);
  }
}

// Stale-while-revalidate for other requests
async function handleOtherRequests(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Return cached version immediately if available
    if (cachedResponse) {
      // Update cache in background
      fetchAndCache(request, cache);
      return cachedResponse;
    }
    
    // If not cached, fetch and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('General caching error:', error);
    return fetch(request);
  }
}

// Helper function to fetch and cache in background
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.error('Background cache update error:', error);
  }
}

// Clean up old cache entries periodically
setInterval(() => {
  caches.open(IMAGE_CACHE_NAME).then(cache => {
    cache.keys().then(keys => {
      // Keep only the most recent 100 images
      if (keys.length > 100) {
        const keysToDelete = keys.slice(0, keys.length - 100);
        keysToDelete.forEach(key => cache.delete(key));
      }
    });
  });
}, 60000); // Run every minute
