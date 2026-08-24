/* ==========================================
   GESTIÓN Y ESTADO DEL CARRITO DE COMPRAS (ASTRO)
   ========================================== */

// 1. Inicialización segura recuperando LocalStorage
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("starnatural_cart") || "[]");
} catch (e) {
  console.error("Error al leer starnatural_cart de localStorage:", e);
  cart = [];
}

/**
 * Agrega un producto al carrito por su ID
 */
function addToCart(productId) {
  const productsList = window.PRODUCTS || (typeof PRODUCTS !== "undefined" ? PRODUCTS : []);
  const existing = cart.find(item => item.id === productId);

  if (existing) { 
    existing.qty += 1; 
  } else { 
    const itemToAdd = productsList.find(p => p.id === productId);
    if (itemToAdd) {
      cart.push({ ...itemToAdd, qty: 1 });
    } else {
      console.warn(`Producto con ID ${productId} no fue encontrado.`);
      return;
    }
  }
  
  saveAndRefreshCart();
  openCartModal();
}

/**
 * Modifica la cantidad de un ítem en el carrito
 */
function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) { 
    cart = cart.filter(i => i.id !== productId); 
  }
  saveAndRefreshCart();
}

/**
 * Persiste el carrito en LocalStorage, actualiza la UI y sincroniza el scope global
 */
function saveAndRefreshCart() {
  localStorage.setItem("starnatural_cart", JSON.stringify(cart));
  window.cart = cart; // Sincronización crucial para Wompi Checkout
  updateCartUI();
}

/**
 * Refresca la interfaz del carrito y contadores
 */
function updateCartUI() {
  const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  if (cartCountEl) cartCountEl.innerText = totalCount;
  if (cartTotalEl) cartTotalEl.innerText = `$${totalPrice.toLocaleString("es-CO")} COP`;

  const itemsContainer = document.getElementById("cart-items-container");
  if (itemsContainer) {
    if (cart.length === 0) {
      const cartEmoji = (typeof EMOJIS !== "undefined" && EMOJIS.cart) 
        ? EMOJIS.cart 
        : "https://fonts.gstatic.com/s/e/notoemoji/latest/1f6d2/512.webp";

      itemsContainer.innerHTML = `
        <div style="text-align: center; color: #64748b; padding: 2rem 1rem;">
          <img src="${cartEmoji}" class="animated-emoji" alt="Carrito vacío" style="width: 64px; height: 64px; margin-bottom: 0.5rem;">
          <p style="font-size: 1rem; font-weight: 600; margin: 0;">Tu carrito está vacío</p>
          <p style="font-size: 0.85rem; margin-top: 4px;">Agrega productos para comenzar tu compra.</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div>
            <div style="font-weight:700;">${item.name}</div>
            <div style="font-size:0.85rem; color:#64748b;">$${(item.price * item.qty).toLocaleString("es-CO")} COP</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
          </div>
        </div>
      `).join("");
    }
  }
}

/**
 * Control del Modal del Carrito
 */
function openCartModal() {
  const modal = document.getElementById("cart-modal");

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("active");
    modal.style.display = "flex";
  }

  document.body.classList.add("cart-open");
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal");

  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("active");
    modal.style.display = "none";
  }

  document.body.classList.remove("cart-open");
}

// --- EXPONER PROPIEDADES Y FUNCIONES GLOBALMENTE ---
window.cart = cart;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.saveAndRefreshCart = saveAndRefreshCart;
window.updateCartUI = updateCartUI;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;

// Inicialización automática de la UI al cargar la página
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    saveAndRefreshCart();
  });
} else {
  saveAndRefreshCart();
}