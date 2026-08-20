/* ==========================================
   PASARELA DE PAGO WOMPI Y CHECKOUT
   ========================================== */

const WOMPI_PUBLIC_KEY = "pub_prod_hTKZ7t71m1Xue0eFgOc3vSvKTvcUl1gZ"; 
// NOTA: Para producción, la firma de integridad idealmente se genera desde un endpoint Serverless / API de Astro para no exponer el Secreto.
const WOMPI_INTEGRITY_SECRET = "prod_integrity_DcxdEMXNcfNVP0vLgE2RDmIK61d3ldNU";

/**
 * Genera el hash SHA-256 requerido por Wompi para validar la integridad.
 */
async function generateIntegritySignature(reference, amountInCents, currency, secret) {
  const cadenaConcatenada = `${reference}${amountInCents}${currency}${secret}`;
  const encodedText = new TextEncoder().encode(cadenaConcatenada);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Carga dinámica del SDK de Wompi si no está disponible en window.
 */
function loadWompiScript() {
  return new Promise((resolve, reject) => {
    if (typeof WidgetCheckout !== 'undefined') {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de Wompi'));
    document.body.appendChild(script);
  });
}

/**
 * Maneja el flujo de pago con el widget Wompi
 */
async function handleWompiCheckout() {
  // 1. Validar estado del carrito (acceso seguro al objeto global cart)
  const currentCart = window.cart || [];
  if (currentCart.length === 0) {
    alert("Agrega al menos un producto al carrito.");
    return;
  }

  // 2. Extraer y validar inputs del formulario
  const name = document.getElementById("customer-name")?.value.trim() || "";
  const idNum = document.getElementById("customer-id")?.value.trim() || "";
  const email = document.getElementById("customer-email")?.value.trim() || "";
  const phone = document.getElementById("customer-phone")?.value.trim() || "";
  const city = document.getElementById("customer-city")?.value.trim() || "";
  const address = document.getElementById("customer-address")?.value.trim() || "";
  const notes = document.getElementById("customer-notes")?.value.trim() || "";

  if (!name || !idNum || !email || !phone || !city || !address) {
    alert("Por favor completa todos los datos de envío obligatorios.");
    return;
  }

  try {
    // 3. Asegurar carga del script del widget
    await loadWompiScript();

    // 4. Cálculo de valores
    const totalPrice = currentCart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const amountInCents = Math.round(totalPrice * 100);
    const currency = "COP";
    const reference = `SN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 5. Firma de Integridad
    const signature = await generateIntegritySignature(
      reference, 
      amountInCents, 
      currency, 
      WOMPI_INTEGRITY_SECRET
    );

    // 6. Instancia del Widget Checkout
    const checkout = new WidgetCheckout({
      currency: currency,
      amountInCents: amountInCents,
      reference: reference,
      publicKey: WOMPI_PUBLIC_KEY,
      signature: { integrity: signature },
      customerData: {
        email: email,
        fullName: name,
        phoneNumber: phone,
        phoneNumberPrefix: '+57',
        legalId: idNum,
        legalIdType: 'CC'
      }
    });

    // 7. Apertura y callback
    checkout.open(function (result) {
      const transaction = result.transaction;

      if (transaction && transaction.status === 'APPROVED') {
        const referenceId = transaction.id || reference;
        
        // Formatear resumen
        const orderSummary = currentCart.map(i => 
          `• *${i.name}* (x${i.qty}) - $${(i.price * i.qty).toLocaleString("es-CO")}\n` +
          `   - Fabricado por: ${i.fabricado || 'N/A'}\n` +
          `   - Contenido: ${i.netContent || 'N/A'}`
        ).join("\n\n");

        const message = 
`✅ *¡NUEVO PEDIDO PAGADO EN NATURAL MEDIX!*
----------------------------------
📌 *Referencia Wompi:* ${referenceId}
💰 *Monto Pagado:* $${totalPrice.toLocaleString("es-CO")} COP

🛒 *DETALLE DE PRODUCTOS:*
${orderSummary}

👤 *DATOS DE ENVÍO:*
• *Nombre:* ${name}
• *CC/NIT:* ${idNum}
• *Teléfono:* ${phone}
• *Ciudad:* ${city}
• *Dirección:* ${address}
${notes ? `• *Notas:* ${notes}` : ''}`;

        const whatsappUrl = `https://wa.me/573027109685?text=${encodeURIComponent(message)}`;

        // Desplegar recibo
        if (typeof window.showOrderReceipt === 'function') {
          window.showOrderReceipt({
            ref: referenceId,
            total: totalPrice,
            cart: [...currentCart],
            customer: { name, idNum, email, phone, city, address, notes },
            whatsappUrl: whatsappUrl
          });
        }

        // Limpiar carrito
        window.cart = [];
        if (typeof window.saveAndRefreshCart === 'function') window.saveAndRefreshCart();
        if (typeof window.closeCartModal === 'function') window.closeCartModal();

      } else if (transaction && transaction.status === 'DECLINED') {
        alert("La transacción fue rechazada por la entidad financiera.");
      } else if (transaction && transaction.status === 'ERROR') {
        alert("Ocurrió un error procesando el pago en la pasarela.");
      }
    });

  } catch (error) {
    console.error("Error al iniciar el checkout de Wompi:", error);
    alert("No se pudo iniciar la pasarela de pagos. Por favor intenta más tarde.");
  }
}

// Exponer la función globalmente para Astro
window.handleWompiCheckout = handleWompiCheckout;