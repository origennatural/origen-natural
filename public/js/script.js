/* ==========================================
   MÓDULO DE PRODUCTOS Y RENDERIZADO (ASTRO)
   ========================================== */

// Objeto de emojis animados para la interfaz
const EMOJIS = {
  fire: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp",
  factory: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f3ed/512.webp",
  package: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4e6/512.webp",
  shield: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f6e1_fe0f/512.webp"
};

/* ==========================================
   RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
   ========================================== */
function renderProducts(filterText = "") {
  const container = document.getElementById("product-grid");
  if (!container) return;

  if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS)) {
    console.error("La constante PRODUCTS no está disponible.");
    return;
  }

  const query = (filterText || "").toLowerCase().trim();

  const filteredProducts = PRODUCTS.filter(p => {
    if (!query) return true;
    return (p.name && p.name.toLowerCase().includes(query)) ||
           (p.benefit && p.benefit.toLowerCase().includes(query)) ||
           (p.fabricado && p.fabricado.toLowerCase().includes(query)) ||
           (p.netContent && p.netContent.toLowerCase().includes(query)) ||
           (p.invima && p.invima.toLowerCase().includes(query));
  });

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
        <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">No se encontraron productos para "${filterText}"</p>
        <p style="font-size: 0.9rem;">Intenta con otros términos como "origen", "vcol" o "colageno".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProducts.map(product => {
    const ahorro = product.originalPrice - product.price;
    const ahorroFormateado = ahorro > 0 
      ? `<span class="savings-tag"><img src="${EMOJIS.fire}" class="animated-emoji" alt="Fuego"> ¡Ahorras $${ahorro.toLocaleString("es-CO")}!</span>` 
      : '';

    // Detección Inteligente: Si el archivo es .mp4 renderiza <video>, de lo contrario <img>
    const isVideo = product.image && product.image.toLowerCase().endsWith(".mp4");
    
    const mediaHTML = isVideo 
      ? `<video src="${product.image}" class="product-img" autoplay loop muted playsinline preload="metadata"></video>`
      : `<img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />`;

    return `
      <div class="product-card">
        <div class="product-image-wrapper">
          ${mediaHTML}
          
          <!-- BOTÓN DE VISTA RÁPIDA CIRCULAR -->
          <button class="btn-quick-view-circular" onclick="openQuickView('${product.id}')" aria-label="Vista Rápida">
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f441/512.webp" alt="Ojo" class="quick-view-eye-icon" />
          </button>
        </div>

        <div class="product-header" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
          <div style="font-size:0.8rem; color:#475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px;">
            <img src="${EMOJIS.factory}" class="animated-emoji" alt="Fabricado por"> Fabricado por: ${product.fabricado || 'N/A'}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 2px;">
            <h4 class="product-title" style="margin: 0;">${product.name}</h4>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          </div>
        </div>

        <div style="font-size:0.85rem; color:#334155; margin: 0.8rem 0; line-height: 1.4;">
          <p style="margin-bottom:0.3rem; color:#0f172a; font-weight:600; display: flex; align-items: center; gap: 4px;">
            <img src="${EMOJIS.package}" class="animated-emoji" alt="Contenido"> ${product.netContent || 'N/A'}
          </p>
          ${product.benefit ? `<p style="margin-bottom:0.3rem;"><strong>• Beneficio:</strong> ${product.benefit}</p>` : ''}
          ${product.usage ? `<p style="margin-bottom:0.3rem;"><strong>• Modo de Uso:</strong> ${product.usage}</p>` : ''}

          <div style="display:flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.6rem; font-size:0.8rem; align-items: center;">
            ${product.invima ? `<span style="color:#166534; font-weight:600; display: flex; align-items: center; gap: 4px;"><img src="${EMOJIS.shield}" class="animated-emoji" alt="Escudo"> Invima: ${product.invima}</span>` : ''}
          </div>
        </div>
        
        <div class="price-container">
          <div class="prices-row">
            <span class="product-price">$${product.price.toLocaleString("es-CO")} COP</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toLocaleString("es-CO")}</span>` : ''}
          </div>
          ${ahorroFormateado}
        </div>

        <div class="product-footer" style="margin-top: 0.8rem;">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">+ Agregar al Carrito</button>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================
   VISTA RÁPIDA DE PRODUCTO (MODAL)
   ========================================== */
function openQuickView(productId) {
  if (typeof PRODUCTS === "undefined") return;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("image-modal");
  if (!modal) return;

  // 1. Prioriza de forma estricta el video vertical (modalVideo) sobre la miniatura
  const mediaUrl = product.modalVideo || product.image;
  const isVideo = mediaUrl && mediaUrl.toLowerCase().endsWith('.mp4');

  modal.innerHTML = `
    <div class="modal-content product-detail-modal" style="position: relative; max-width: 400px; width: 90%; background: #fff; border-radius: 16px; padding: 1.2rem; margin: auto; max-height: 90vh; overflow-y: auto;">
      
      <!-- Botón de Cierre -->
      <button class="close-btn" onclick="closeQuickView()" style="position: absolute; top: 15px; right: 15px; font-size: 1.6rem; background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 20;">&times;</button>
      
      <!-- CONTENEDOR 9:16 FORZADO -->
      <div style="width: 100%; max-width: 290px; aspect-ratio: 9 / 16; margin: 0 auto 1rem auto; border-radius: 12px; overflow: hidden; background: #000; position: relative;">
        ${
          isVideo
            ? `<video src="${mediaUrl}" controls autoplay loop muted playsinline style="position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important; object-fit: cover !important; aspect-ratio: 9/16 !important; margin: 0 !important; padding: 0 !important;"></video>`
            : `<img src="${mediaUrl}" alt="${product.name}" style="position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important; object-fit: cover !important;" />`
        }
      </div>

      <!-- INFORMACIÓN DEL PRODUCTO -->
      <div class="modal-product-info">
        <span class="product-badge" style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${product.badge || 'Producto'}</span>
        <h3 style="margin: 0.5rem 0; color: #0f172a;">${product.name}</h3>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;"><strong>Laboratorio:</strong> ${product.Laboratorio || product.fabricado || 'N/A'}</p>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;"><strong>Contenido:</strong> ${product.netContent || 'N/A'}</p>
        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.4rem;"><strong>Beneficio:</strong> ${product.benefit || 'N/A'}</p>
        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.8rem;"><strong>Modo de Uso:</strong> ${product.usage || 'N/A'}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 1.2rem; font-weight: bold; color: #0d9488;">$${product.price ? product.price.toLocaleString("es-CO") : 0} COP</span>
          <button class="btn-add-cart" onclick="addToCart('${product.id}'); closeQuickView();" style="padding: 0.6rem 1rem; background: #0d9488; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            + Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("active");
  modal.style.display = "flex";
}

/* ==========================================
   CIERRE DEL MODAL DE VISTA RÁPIDA
   ========================================== */
function closeQuickView() {
  const modal = document.getElementById("image-modal");
  if (!modal) return;

  // Detiene la reproducción de audio/video al cerrar el modal
  const video = modal.querySelector("video");
  if (video) {
    video.pause();
    video.src = "";
  }

  modal.classList.add("hidden");
  modal.classList.remove("active");
  modal.style.display = "none";
}

document.getElementById('image-modal').classList.add('active');