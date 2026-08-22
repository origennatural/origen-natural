/* ==========================================
   CATÁLOGO DE PRODUCTOS Y RENDERIZADO (ASTRO)
   ========================================== */

const PRODUCTS = [
  {
    id: "gaf_plus_300ml",
    name: "GAF-PLUS 300mL",
    badge: "Estrella",
    fabricado: "GrenLab",
    netContent: "Cont. Neto: 300mL (10 Porciones)",
    invima: "PSA-0690-2025",
    benefit: "Regenera articulaciones, fortalece cabello, uñas y elasticidad de la piel.",
    usage: "Tomar 1 copa (30ml) al día, preferiblemente en la mañana.",
    price: 15600,
    originalPrice: 22300,
    image: "/images/gaf_plus_300ml.mp4",
    // BADGES INDEPENDIENTES Y PERSONALIZADOS
    badges: [
      { text: "Vendedor estrella", bg: "badge-purple", icon: "https://aimg.kwcdn.com/upload_aimg/pho/05f39254-a4b9-4289-9174-56337e13689e.png.slim.png" },
      { text: "Fórmula GrenLab", bg: "badge-teal", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp" },
      { text: "Envío Nacional Disponible", bg: "badge-gold", icon: "https://aimg.kwcdn.com/upload_aimg/aftersales/efb13335-b6b6-4984-af7d-a48dbaccb830.png" }
    ]
  },
  {
    id: "origen_disco",
    name: "ORIGEN 15 Discos",
    badge: "Línea ORIGEN",
    fabricado: "Naturalisima",
    netContent: "Cont. Neto: Frasco x 15 Discos (15 Porciones)",
    invima: "PSA-0005343-2024",
    benefit: "Alimento funcional con fibra natural que mejora la digestión y el tránsito intestinal.",
    usage: "Disolver 1 disco en un vaso de agua caliente al día.",
    price: 17800,
    originalPrice: 25450,
    image: "/images/origen-disco.mp4",
    badges: [
      { text: "100% Fibra Natural", bg: "badge-green", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp" },
      { text: "Línea ORIGEN Oficial", bg: "badge-purple", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp" },
      { text: "Despacho en 72 Horas (3 Días Hábiles)", bg: "badge-gold", icon: "https://aimg.kwcdn.com/upload_aimg/aftersales/efb13335-b6b6-4984-af7d-a48dbaccb830.png" }
    ]
  },
  {
    id: "origen_30_comprimidos",
    name: "ORIGEN Natural 30 Comprimidos",
    badge: "Línea ORIGEN Natural",
    fabricado: "ORIGEN Natural",
    netContent: "Cont. Neto: Frasco x 30 Comprimidos (30 Porciones)",
    invima: "PSA-0005343-2024",
    benefit: "Alimento funcional con fibra natural que mejora la digestión y el tránsito intestinal.",
    usage: "Disolver 1 comprimido en un vaso de agua caliente al día.",
    price: 30000,
    originalPrice: 42900,
    image: "/images/origen_30_comprimidos.mp4",
    badges: [
      { text: "Producto Más Vendido", bg: "badge-purple", icon: "https://aimg.kwcdn.com/upload_aimg/pho/05f39254-a4b9-4289-9174-56337e13689e.png.slim.png" },
      { text: "Marca ORIGEN Natural™", bg: "badge-teal", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp" },
      { text: "30 Porciones Rendidoras", bg: "badge-green", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp" }
    ]
  },
  {
    id: "origen_360ml",
    name: "ORIGEN 360mL",
    badge: "Línea ORIGEN",
    fabricado: "Naturalisima",
    netContent: "Cont. Neto: 360mL (12 Porciones)",
    invima: "RSA-0034995-2024",
    benefit: "Regenera articulaciones, fortalece cabello, uñas y elasticidad de la piel.",
    usage: "Tomar 1 copa (30ml) al día, preferiblemente en la mañana.",
    price: 15600,
    originalPrice: 22300,
    image: "/images/origen_360ml.mp4",
    badges: [
      { text: "Regenerador Articular", bg: "badge-teal", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp" },
      { text: "Calidad Naturalisima", bg: "badge-purple", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp" },
      { text: "Oferta Especial", bg: "badge-gold", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp" }
    ]
  },
  {
    id: "origen_400ml",
    name: "ORIGEN 400mL",
    badge: "Línea ORIGEN",
    fabricado: "Laboratorios vanier",
    netContent: "Cont. Neto: 400mL (13 Porciones)",
    invima: "RSAV12136011",
    benefit: "Regenera articulaciones, fortalece cabello, uñas y elasticidad de la piel.",
    usage: "Tomar 1 copa (30ml) al día, preferiblemente en la mañana.",
    price: 15600,
    originalPrice: 22300,
    image: "/images/origen_400ml.mp4",
    badges: [
      { text: "Mayor Contenido 400mL", bg: "badge-green", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp" },
      { text: "Laboratorios Vanier", bg: "badge-purple", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp" },
      { text: "Garantía de Satisfacción", bg: "badge-teal", icon: "https://aimg.kwcdn.com/upload_aimg/aftersales/efb13335-b6b6-4984-af7d-a48dbaccb830.png" }
    ]
  },
  {
    id: "vcol_360ml",
    name: "VCOL 360mL",
    badge: "Estrella",
    fabricado: "Naturalisima",
    netContent: "Cont. Neto: 360mL (12 Porciones)",
    invima: "RSA-0034995-2024",
    benefit: "Regenera articulaciones, fortalece cabello, uñas y elasticidad de la piel.",
    usage: "Tomar 1 copa (30ml) al día, preferiblemente en la mañana.",
    price: 15600,
    originalPrice: 22300,
    image: "/images/vcol-360ml.mp4",
    badges: [
      { text: "VCOL Concentrado", bg: "badge-purple", icon: "https://aimg.kwcdn.com/upload_aimg/pho/05f39254-a4b9-4289-9174-56337e13689e.png.slim.png" },
      { text: "Piel y Uñas Fuertes", bg: "badge-green", icon: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp" },
      { text: "Envío Garantizado", bg: "badge-gold", icon: "https://aimg.kwcdn.com/upload_aimg/aftersales/efb13335-b6b6-4984-af7d-a48dbaccb830.png" }
    ]
  }
];

// Emojis animados Noto
const EMOJIS = {
  fire: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp",
  package: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f37e/512.webp",
  factory: "https://fonts.gstatic.com/s/e/notoemoji/latest/2b50/512.webp",
  shield: "https://fonts.gstatic.com/s/e/notoemoji/latest/2705/512.webp",
  calendar: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f4c5/512.webp",
  cart: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f6d2/512.webp"
};

function renderProducts(filterText = "") {
  const container = document.getElementById("product-grid");
  if (!container) return;

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

    const isVideo = product.image && product.image.toLowerCase().endsWith('.mp4');

    // CONSTRUIR DINÁMICAMENTE LOS BADGES DE ESTE PRODUCTO
    const badgesList = (product.badges || []).map(b => `
      <div class="badge-item ${b.bg}">
        <img src="${b.icon}" alt="icon">
        <span>${b.text}</span>
      </div>
    `).join("");

    return `
      <div class="product-card">
        <div class="product-image-wrapper">
          ${
            isVideo
              ? `<video src="${product.image}" class="product-img" autoplay muted loop playsinline preload="metadata"></video>`
              : `<img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />`
          }
          
          <button class="btn-quick-view-circular" onclick="openQuickView('${product.id}')" aria-label="Vista Rápida">
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f441/512.webp" alt="Ojo" class="quick-view-eye-icon" />
          </button>
        </div>

        <div class="product-header" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
          <div style="font-size:0.8rem; color:#475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px;">
            <img src="${EMOJIS.factory}" class="animated-emoji" alt="Fabricado por"> Fabricado por: ${product.fabricado}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 2px;">
            <h4 class="product-title" style="margin: 0;">${product.name}</h4>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          </div>
        </div>

        <div style="font-size:0.85rem; color:#334155; margin: 0.8rem 0; line-height: 1.4;">
          <p style="margin-bottom:0.3rem; color:#0f172a; font-weight:600; display: flex; align-items: center; gap: 4px;">
            <img src="${EMOJIS.package}" class="animated-emoji" alt="Contenido"> ${product.netContent}
          </p>
          ${product.benefit ? `<p style="margin-bottom:0.3rem;"><strong>• Beneficio:</strong> ${product.benefit}</p>` : ''}
          <p style="margin-bottom:0.3rem;"><strong>• Modo de Uso:</strong> ${product.usage}</p>

          <div style="display:flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.6rem; font-size:0.8rem; align-items: center;">
            ${product.invima ? `<span style="color:#166534; font-weight:600; display: flex; align-items: center; gap: 4px;"><img src="${EMOJIS.shield}" class="animated-emoji" alt="Escudo"> Invima: ${product.invima}</span>` : ''}
          </div>
        </div>
        
        <div class="price-container">
          <div class="prices-row">
            <span class="product-price">$${product.price.toLocaleString("es-CO")} COP</span>
            <span class="original-price">$${product.originalPrice.toLocaleString("es-CO")}</span>
          </div>
          ${ahorroFormateado}
        </div>

        <!-- SLIDER DINÁMICO E INDEPENDIENTE DE BADGES -->
        ${badgesList ? `
          <div class="product-slider-badge-container">
            <div class="product-slider-badge-track" style="animation-duration: ${(product.badges.length * 2.5)}s;">
              ${badgesList}
            </div>
          </div>
        ` : ''}

        <div class="product-footer" style="margin-top: 0.4rem;">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">+ Agregar al Carrito</button>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================
   LÓGICA DEL MODAL DE VISTA RÁPIDA (QUICK VIEW)
   ========================================== */

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("image-modal");
  if (!modal) return;

  const isVideo = product.image && product.image.toLowerCase().endsWith('.mp4');

  modal.innerHTML = `
    <div class="modal-content product-detail-modal" style="position: relative; max-width: 500px; width: 90%; background: #fff; border-radius: 12px; padding: 1.5rem; margin: auto;">
      <button class="close-btn" onclick="closeQuickView()" style="position: absolute; top: 10px; right: 15px; font-size: 1.5rem; background: none; border: none; cursor: pointer;">&times;</button>
      
      <div class="modal-media-container" style="text-align: center; margin-bottom: 1rem;">
        ${
          isVideo
            ? `<video src="${product.image}" controls autoplay loop muted style="width: 100%; max-height: 250px; border-radius: 8px; object-fit: cover;"></video>`
            : `<img src="${product.image}" alt="${product.name}" style="width: 100%; max-height: 250px; border-radius: 8px; object-fit: cover;" />`
        }
      </div>

      <div class="modal-product-info">
        <span class="product-badge" style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">${product.badge || 'Producto'}</span>
        <h3 style="margin: 0.5rem 0; color: #0f172a;">${product.name}</h3>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;"><strong>Fabricado por:</strong> ${product.fabricado}</p>
        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.4rem;"><strong>Contenido:</strong> ${product.netContent}</p>
        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.4rem;"><strong>Beneficio:</strong> ${product.benefit}</p>
        <p style="font-size: 0.85rem; color: #334155; margin-bottom: 0.8rem;"><strong>Modo de Uso:</strong> ${product.usage}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 1.2rem; font-weight: bold; color: #0d9488;">$${product.price.toLocaleString("es-CO")} COP</span>
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

function closeQuickView() {
  const modal = document.getElementById("image-modal");
  if (!modal) return;
  
  const video = modal.querySelector("video");
  if (video) {
    video.pause();
    video.src = "";
  }

  modal.classList.add("hidden");
  modal.classList.remove("active");
  modal.style.display = "none";
}

// Exponer en window
window.PRODUCTS = PRODUCTS;
window.renderProducts = renderProducts;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;