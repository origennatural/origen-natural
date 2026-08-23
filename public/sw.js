/* ==========================================
   SERVICE WORKER - ORIGEN NATURAL PWA
   ========================================== */

const CACHE_NAME = "origennatural-v1.2.7";

const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",

  "/css/GoogleSansFlex.css",
  "/css/styles.css",
  "/css/base.css",
  "/css/navbar.css",
  "/css/products.css",
  "/css/cart.css",
  "/css/checkout.css",
  "/css/estilos-catalogo.css",

  "/js/products.js",
  "/js/cart.js",
  "/js/ui.js",
  "/js/checkout.js",
  "/js/app.js"
];


/* ==========================================
   INSTALACIÓN
   ========================================== */

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then((cache) => {

        console.log(
          "[SW] Instalando nueva caché:",
          CACHE_NAME
        );

        return cache.addAll(ASSETS_TO_CACHE);

      })
      .then(() => self.skipWaiting())

  );

});


/* ==========================================
   ACTIVACIÓN
   ========================================== */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys()
      .then((cacheNames) => {

        return Promise.all(

          cacheNames.map((cacheName) => {

            if (cacheName !== CACHE_NAME) {

              console.log(
                "[SW] Eliminando caché antigua:",
                cacheName
              );

              return caches.delete(cacheName);
            }

          })

        );

      })
      .then(() => self.clients.claim())

  );

});


/* ==========================================
   PETICIONES
   ========================================== */

self.addEventListener("fetch", (event) => {

  const request = event.request;

  // Solo GET
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);


  /* ==========================================
     NO CACHEAR VIDEOS
     ========================================== */

  if (
    url.pathname.endsWith(".mp4") ||
    url.pathname.endsWith(".webm") ||
    url.pathname.endsWith(".mov")
  ) {

    console.log(
      "[SW] Video directo desde red:",
      url.pathname
    );

    return;
  }


  /* ==========================================
     NO INTERFERIR CON WOMPI
     ========================================== */

  if (
    url.hostname.includes("wompi.co")
  ) {
    return;
  }


  /* ==========================================
     NETWORK FIRST
     ========================================== */

  event.respondWith(

    fetch(request)

      .then((networkResponse) => {

        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {

          const copy = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, copy);
            });

        }

        return networkResponse;

      })

      .catch(() => {

        return caches.match(request);

      })

  );

});