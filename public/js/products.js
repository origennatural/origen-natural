/* ==========================================
   CATÁLOGO DE PRODUCTOS Y RENDERIZADO
   ========================================== */

const PRODUCTS = [
  {
    id: "origen_30_comprimidos",
    name: "ORIGEN Natural 30 Comprimidos",
    badge: "Línea ORIGEN Natural",
    laboratorio: "ORIGEN Natural",
    netContent: "Cont. Neto: Frasco x 30 Comprimidos (30 Porciones)",
    invima: "PSA-0005343-2024",
    benefit: "Alimento funcional con fibra natural que mejora la digestión y el tránsito intestinal.",
    usage: "Disolver 1 comprimido en un vaso de agua caliente al día.",
    price: 30000,
    originalPrice: 42900,
    image: "/images/origen_30_comprimidos.mp4",
    modalVideo: "/videos/origen-natural-720-1280.mp4",
    badges: [
      { text: "Producto Más Vendido", bg: "badge-purple", icon: "https://aimg.kwcdn.com/upload_aimg/pho/05f39254-a4b9-4289-9174-56337e13689e.png.slim.png" },
      { text: "Marca ORIGEN Natural™", bg: "badge-teal", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp" },
      { text: "30 Porciones Rendidoras", bg: "badge-green", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp" }
    ]
  }
];

const EMOJIS = {
  fire: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp",
  package: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f37e/512.webp",
  factory: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp",
  shield: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp",
  calendar: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4c5/512.webp",
  cart: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f6d2/512.webp"
};

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function escapeHTML(str) {
  return String(str || '').replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[match]);
}

function renderProducts(filterText = "") {
  const container = document.getElementById("product-grid");
  if (!container) return;

  const query = (filterText || "").toLowerCase().trim();

  const filteredProducts = PRODUCTS.filter(p => {
    if (!query) return true;
    return (p.name && p.name.toLowerCase().includes(query)) ||
           (p.benefit && p.benefit.toLowerCase().includes(query)) ||
           (p.laboratorio && p.laboratorio.toLowerCase().includes(query)) ||
           (p.netContent && p.netContent.toLowerCase().includes(query)) ||
           (p.invima && p.invima.toLowerCase().includes(query));
  });

  if (filteredProducts.length === 0) {
    const safeFilterText = escapeHTML(filterText);
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
        <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">No se encontraron productos para "${safeFilterText}"</p>
        <p style="font-size: 0.9rem;">Intenta con otros términos como "origen", "vcol" o "colageno".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProducts.map(product => {
    const ahorro = product.originalPrice - product.price;
    const ahorroFormateado = ahorro > 0 
      ? `<span class="savings-tag"><img src="${EMOJIS.fire}" class="animated-emoji" alt="Fuego"> ¡Ahorras ${currencyFormatter.format(ahorro)}!</span>` 
      : '';

    const isVideo = product.image && product.image.toLowerCase().endsWith('.mp4');

    const rawBadges = (product.badges || []).map(b => `
      <div class="badge-item ${b.bg}">
        <img src="${b.icon}" alt="" aria-hidden="true" width="16" height="16">
        <span>${escapeHTML(b.text)}</span>
      </div>
    `).join("");

    const badgesList = rawBadges + rawBadges;

    return `
      <article class="product-card">
        <div class="product-image-wrapper">
          ${
            isVideo
              ? `<video src="${product.image}" class="product-img" autoplay muted loop playsinline preload="metadata"></video>`
              : `<img src="${product.image}" alt="${escapeHTML(product.name)}" class="product-img" loading="lazy" />`
          }
          
          <button type="button" class="btn-quick-view-circular" onclick="openQuickView('${product.id}')" aria-label="Vista Rápida de ${escapeHTML(product.name)}">
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f441/512.webp" alt="Ojo" class="quick-view-eye-icon" />
          </button>
        </div>

        <div class="product-header" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
          <div style="font-size:0.8rem; color:#475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px;">
            <img src="${EMOJIS.factory}" class="animated-emoji" alt="" aria-hidden="true"> Laboratorio: ${escapeHTML(product.laboratorio)}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 2px;">
            <h4 class="product-title" style="margin: 0;">${escapeHTML(product.name)}</h4>
            ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ''}
          </div>
        </div>

        <div style="font-size:0.85rem; color:#334155; margin: 0.8rem 0; line-height: 1.4;">
          <p style="margin-bottom:0.3rem; color:#0f172a; font-weight:600; display: flex; align-items: center; gap: 4px;">
            <img src="${EMOJIS.package}" class="animated-emoji" alt="" aria-hidden="true"> ${escapeHTML(product.netContent)}
          </p>
          ${product.benefit ? `<p style="margin-bottom:0.3rem;"><strong>• Beneficio:</strong> ${escapeHTML(product.benefit)}</p>` : ''}
          <p style="margin-bottom:0.3rem;"><strong>• Modo de Uso:</strong> ${escapeHTML(product.usage)}</p>

          <div style="display:flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.6rem; font-size:0.8rem; align-items: center;">
            ${product.invima ? `<span style="color:#166534; font-weight:600; display: flex; align-items: center; gap: 4px;"><img src="${EMOJIS.shield}" class="animated-emoji" alt="" aria-hidden="true"> Invima: ${escapeHTML(product.invima)}</span>` : ''}
          </div>
        </div>
        
        <div class="price-container">
          <div class="prices-row">
            <span class="product-price">${currencyFormatter.format(product.price)} COP</span>
            <span class="original-price">${currencyFormatter.format(product.originalPrice)}</span>
          </div>
          ${ahorroFormateado}
        </div>

        ${rawBadges ? `
          <div class="product-slider-badge-container">
            <div class="product-slider-badge-track">
              ${badgesList}
            </div>
          </div>
        ` : ''}

        <div class="product-footer" style="margin-top: 0.4rem;">
          <button type="button" class="btn-add-cart" onclick="addToCart('${product.id}')">+ Agregar al Carrito</button>
        </div>
      </article>
    `;
  }).join("");
}

/* ==========================================
   LÓGICA DEL MODAL (VIDEO VERTICAL 9:16)
   ========================================== */

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("image-modal");
  if (!modal) return;

  const videoSrc = product.modalVideo;

console.log("VIDEO MODAL FORZADO:", videoSrc);
  const isVideo = videoSrc && videoSrc.toLowerCase().endsWith('.mp4');

  modal.innerHTML = `
    <div class="modal-content product-detail-modal">
      <button type="button" class="close-btn" onclick="closeQuickView()" aria-label="Cerrar vista rápida">&times;</button>
      
      <!-- CONTENEDOR ESPECÍFICO 9:16 VERTICAL -->
      <div class="modal-video-wrapper">
        ${
          isVideo
            ? `<video id="modal-video-player" src="${videoSrc}" autoplay loop muted playsinline controlsList="nodownload noplaybackrate" disablePictureInPicture oncontextmenu="return false" class="modal-vertical-media"></video>`
            : `<img src="${product.image}" alt="${escapeHTML(product.name)}" class="modal-vertical-media" />`
        }
      </div>

      <div class="modal-product-info">
        <span class="product-badge" style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${escapeHTML(product.badge || 'Producto')}</span>
        <h3 style="margin: 0.5rem 0; color: #0f172a;">${escapeHTML(product.name)}</h3>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;"><strong>Laboratorio:</strong> ${escapeHTML(product.laboratorio)}</p>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;"><strong>Contenido:</strong> ${escapeHTML(product.netContent)}</p>
        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.4rem;"><strong>Beneficio:</strong> ${escapeHTML(product.benefit)}</p>
        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.8rem;"><strong>Modo de Uso:</strong> ${escapeHTML(product.usage)}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 1.2rem; font-weight: bold; color: #0d9488;">${currencyFormatter.format(product.price)} COP</span>
          <button type="button" class="btn-add-cart" onclick="addToCart('${product.id}'); closeQuickView();" style="padding: 0.6rem 1rem; background: #0d9488; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            + Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("active");
  modal.style.display = "flex";

  const modalVideo = document.getElementById("modal-video-player");
  if (modalVideo) {
    modalVideo.play().catch(() => {
      /* Prevención de bloqueo Autoplay en iOS / Android */
    });
  }
}

function closeQuickView() {
  const modal = document.getElementById("image-modal");
  if (!modal) return;

  const video = modal.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  modal.classList.add("hidden");
  modal.classList.remove("active");
  modal.style.display = "none";
}