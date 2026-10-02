import { getApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const auth = getAuth(getApp());
const loginView = document.getElementById("login-view");
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");
const passwordInput = document.getElementById("login-password");
const passwordToggle = document.getElementById("toggle-password");
const authLoading = document.getElementById("auth-loading");
const adminView = document.getElementById("admin-view");
const adminEmail = document.getElementById("admin-email");
const logoutButton = document.getElementById("logout-button");
const panelLoading = document.getElementById("panel-loading");
const panelError = document.getElementById("panel-error");
const commercialForm = document.getElementById("commercial-form");
const saveButton = document.getElementById("save-button");
const saveMessage = document.getElementById("save-message");

const CAMPOS_PRECIO = [
  "precio_web_basica",
  "precio_web_profesional",
  "precio_plataforma_profesional",
];
const CAMPO_WHATSAPP = "whatsapp";

function setLoginMessage(message) {
  loginMessage.textContent = message;
}

function showLogin(message = "") {
  authLoading.hidden = true;
  adminView.hidden = true;
  loginView.hidden = false;
  setLoginMessage(message);
}

function showPanel(user) {
  authLoading.hidden = true;
  loginView.hidden = true;
  adminView.hidden = false;
  adminEmail.textContent = user.email || "Sesión administradora";
}

async function cargarConfiguracionComercial() {
  panelLoading.hidden = false;
  panelError.hidden = true;
  commercialForm.hidden = true;
  try {
    const snapshot = await getDoc(doc(db, "configuracion", "comercial"));
    if (!snapshot.exists()) {
      panelLoading.hidden = true;
      panelError.textContent = "No se encontró configuracion/comercial en Firestore.";
      panelError.hidden = false;
      return;
    }

    const data = snapshot.data();
    mostrarConfiguracion(data);
    panelLoading.hidden = true;
    commercialForm.hidden = false;
  } catch (error) {
    panelLoading.hidden = true;
    panelError.textContent = "No se pudo cargar la configuración comercial. Revisa los permisos de Firestore.";
    panelError.hidden = false;
    console.error("Error al leer configuracion/comercial:", error);
  }
}

function mostrarConfiguracion(data) {
  for (const campo of [...CAMPOS_PRECIO, CAMPO_WHATSAPP]) {
    const input = commercialForm.elements.namedItem(campo);
    if (input && data[campo] !== undefined && data[campo] !== null) {
      input.value = String(data[campo]);
    }
  }
}

function leerYValidarFormulario() {
  const valores = {};

  for (const campo of CAMPOS_PRECIO) {
    const input = commercialForm.elements.namedItem(campo);
    const valor = input.value.trim();
    const numero = Number(valor);
    if (!valor || !Number.isInteger(numero) || numero <= 0) {
      input.focus();
      throw new Error("Ingresa precios enteros mayores que cero en todos los campos.");
    }
    valores[campo] = numero;
  }

  const whatsappInput = commercialForm.elements.namedItem(CAMPO_WHATSAPP);
  const whatsapp = whatsappInput.value.trim();
  if (!whatsapp) {
    whatsappInput.focus();
    throw new Error("Ingresa un número de WhatsApp.");
  }
  if (!/^51\d{9}$/.test(whatsapp)) {
    whatsappInput.focus();
    throw new Error("Usa el formato 51989927055: código de Perú y nueve dígitos.");
  }
  valores[CAMPO_WHATSAPP] = whatsapp;
  return valores;
}

function mostrarMensajeGuardado(mensaje, exito = false) {
  saveMessage.textContent = mensaje;
  saveMessage.classList.toggle("is-success", exito);
}

passwordToggle.addEventListener("click", () => {
  const mostrar = passwordInput.type === "password";
  passwordInput.type = mostrar ? "text" : "password";
  passwordToggle.setAttribute("aria-pressed", String(mostrar));
  passwordToggle.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
  passwordToggle.title = mostrar ? "Ocultar contraseña" : "Mostrar contraseña";
  passwordToggle.querySelector("[data-eye-open]").hidden = mostrar;
  passwordToggle.querySelector("[data-eye-closed]").hidden = !mostrar;
});

commercialForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  mostrarMensajeGuardado("");

  let valores;
  try {
    valores = leerYValidarFormulario();
  } catch (error) {
    mostrarMensajeGuardado(error.message);
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Guardando...";

  try {
    const referencia = doc(db, "configuracion", "comercial");
    await updateDoc(referencia, valores);

    const confirmacion = await getDoc(referencia);
    if (!confirmacion.exists()) {
      throw new Error("El documento no está disponible para confirmar los cambios.");
    }

    const datosPersistidos = confirmacion.data();
    const persistioTodo = [...CAMPOS_PRECIO, CAMPO_WHATSAPP].every(
      (campo) => datosPersistidos[campo] === valores[campo]
    );
    if (!persistioTodo) {
      throw new Error("Los valores guardados no coinciden con los valores confirmados en Firestore.");
    }

    mostrarConfiguracion(datosPersistidos);
    mostrarMensajeGuardado("Configuración actualizada correctamente", true);
  } catch (error) {
    console.error("No se pudieron guardar o confirmar los cambios comerciales:", error);
    mostrarMensajeGuardado("No se pudieron guardar los cambios");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Guardar cambios";
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoginMessage("");
  loginButton.disabled = true;
  loginButton.textContent = "Iniciando sesión...";
  const email = loginForm.elements.email.value.trim();
  const password = loginForm.elements.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch {
    setLoginMessage("No se pudo iniciar sesión. Verifica el correo y la contraseña.");
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Iniciar sesión";
  }
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    logoutButton.disabled = false;
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showLogin();
    return;
  }

  authLoading.hidden = false;
  loginView.hidden = true;
  adminView.hidden = true;

  try {
    const userSnapshot = await getDoc(doc(db, "usuarios", user.uid));
    const userData = userSnapshot.exists() ? userSnapshot.data() : null;
    if (!userData || userData.activo !== true || userData.rol !== "admin") {
      await signOut(auth);
      showLogin("Esta cuenta no tiene permisos de administrador activos.");
      return;
    }

    showPanel(user);
    await cargarConfiguracionComercial();
  } catch (error) {
    console.error("No se pudo verificar el perfil administrador:", error);
    await signOut(auth);
    showLogin("No se pudo verificar el acceso administrador en Firestore.");
  }
});
