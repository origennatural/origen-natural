/* ==========================================
   SERVICE WORKER - ORIGEN NATURAL PWA (ASTRO)
   ========================================== */

// 1. Nombre de la caché
const CACHE_NAME = "origennatural-v1.1.5";

// 2. Lista de recursos ajustados a la estructura de Astro
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  // Hojas de estilo CSS
  "/css/GoogleSansFlex.css",
  "/css/styles.css",
  "/css/base.css",
  "/css/navbar.css",
  "/css/products.css",
  "/css/cart.css",
  "/css/checkout.css",
  "/css/estilos-catalogo.css",
  // Módulos JavaScript
  "/js/products.js",
  "/js/cart.js",
  "/js/ui.js",
  "/js/checkout.js",
  "/js/app.js",
  // SDK Widget de Wompi
  "https://checkout.wompi.co/widget.js"
];

// 3. INSTALACIÓN: Guarda los recursos en la caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Precachando archivos en Astro...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 4. ACTIVACIÓN: Limpia cachés antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Borrando caché antigua:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 5. INTERCEPTACIÓN DE PETICIONES (Network First con Fallback a Caché)
self.addEventListener("fetch", (event) => {
  // Ignorar peticiones que no sean GET o dirigidas a APIs transaccionales de Wompi
  if (event.request.method !== "GET" || event.request.url.includes("wompi.co/v1")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Guardar copia actualizada en caché si la respuesta es válida
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Responder desde caché si el usuario está offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback a la página principal si navega estando offline
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});