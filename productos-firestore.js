import { collection, getDocs, orderBy, query, where } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

async function cargarProductoDePrueba() {
  const elemento = document.querySelector('[data-firestore-product="pagina-web"]');
  if (!elemento) return;

  try {
    const consulta = query(
      collection(db, "productos"),
      where("activo", "==", true),
      orderBy("orden")
    );
    const resultado = await getDocs(consulta);
    const productos = resultado.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));
    const paginaWeb = productos.find((producto) => producto.id === "pagina-web");

    if (paginaWeb && typeof paginaWeb.descripcion === "string") {
      elemento.textContent = paginaWeb.descripcion;
    }
  } catch (error) {
    // El texto original del HTML permanece visible si Firestore no responde.
    console.warn("No se pudieron cargar los productos desde Firestore.", error);
  }
}

cargarProductoDePrueba();
