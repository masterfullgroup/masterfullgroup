import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const FALLBACK_WHATSAPP = "51989927055";

function actualizarPrecios(configuracion) {
  for (const elemento of document.querySelectorAll("[data-comercial-price]")) {
    const campo = elemento.dataset.comercialPrice;
    const precio = configuracion[campo];

    if (typeof precio === "number" && Number.isFinite(precio)) {
      elemento.textContent = String(precio);
    }
  }
}

function formatearWhatsApp(numero) {
  const local = numero.startsWith("51") ? numero.slice(2) : numero;
  return local.match(/.{1,3}/g)?.join(" ") || local;
}

function actualizarWhatsApp(numeroConfigurado) {
  const numero = String(numeroConfigurado || "").replace(/\D/g, "");
  if (!/^51\d{9}$/.test(numero)) return;

  window.masterfullWhatsapp = numero;

  for (const enlace of document.querySelectorAll('a[href*="wa.me/"]')) {
    const url = new URL(enlace.href);
    url.pathname = `/${numero}`;
    enlace.href = url.toString();
  }

  const numeroVisible = formatearWhatsApp(numero);
  for (const enlace of document.querySelectorAll("[data-whatsapp-display]")) {
    enlace.textContent = `WhatsApp: ${numeroVisible}`;
  }
}

async function cargarConfiguracionComercial() {
  try {
    const referencia = doc(db, "configuracion", "comercial");
    const resultado = await getDoc(referencia);
    if (!resultado.exists()) return;

    const configuracion = resultado.data();
    actualizarPrecios(configuracion);
    actualizarWhatsApp(configuracion.whatsapp || FALLBACK_WHATSAPP);
  } catch (error) {
    // Los precios y enlaces conservan sus valores del HTML si Firestore falla.
    console.warn("No se pudo cargar la configuración comercial de Firestore.", error);
  }
}

cargarConfiguracionComercial();
