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
  const contentContainer = document.getElementById("modal-media-content");

  if (!modal || !contentContainer) {
    console.error("Falta el modal #image-modal o #modal-media-content en el HTML");
    return;
  }

  const isVideo = product.image && product.image.toLowerCase().endsWith(".mp4");

  if (isVideo) {
    contentContainer.innerHTML = `
      <video 
        src="${product.image}" 
        controls 
        autoplay 
        loop 
        playsinline 
        style="width: 100%; max-height: 75vh; border-radius: 10px; display: block; background: #000;">
        Tu navegador no soporta la reproducción de video.
      </video>
    `;
  } else {
    contentContainer.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 100%; max-height: 75vh; object-fit: contain; border-radius: 10px; display: block;" />
    `;
  }

  modal.classList.remove("hidden");
}

function closeMediaModal() {
  const modal = document.getElementById("image-modal");
  const contentContainer = document.getElementById("modal-media-content");
  
  if (modal) {
    modal.classList.add("hidden");
  }
  if (contentContainer) {
    contentContainer.innerHTML = "";
  }
}

/* ==========================================
   EVENTOS DEL BUSCADOR DE PRODUCTOS
   ========================================== */
function setupSearchEvents() {
  const searchInput = document.getElementById('product-search-input');
  const searchWrapper = document.querySelector('.search-input-wrapper');
  const clearBtn = document.getElementById('clear-search-btn');

  if (!searchInput) return;

  if (searchWrapper) {
    searchInput.addEventListener('focus', () => {
      searchWrapper.classList.add('active');
    });

    searchInput.addEventListener('blur', () => {
      searchWrapper.classList.remove('active');
    });
  }

  searchInput.addEventListener('input', () => {
    const value = searchInput.value;
    
    if (searchWrapper) {
      if (value.trim().length > 0) {
        searchWrapper.classList.add('has-value');
      } else {
        searchWrapper.classList.remove('has-value');
      }
    }

    if (clearBtn) {
      if (value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    renderProducts(value);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (searchWrapper) searchWrapper.classList.remove('has-value');
      clearBtn.classList.add('hidden');
      renderProducts('');
      searchInput.focus();
    });
  }
}

// --- EXPONER FUNCIONES GLOBALMENTE ---
window.renderProducts = renderProducts;
window.openQuickView = openQuickView;
window.closeMediaModal = closeMediaModal;

// Inicialización automática al cargar el DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    setupSearchEvents();
  });
} else {
  renderProducts();
  setupSearchEvents();
}