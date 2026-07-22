/* =========================================================
   MASTERFULL - SCRIPT FINAL
   Menú móvil, navegación, formulario WhatsApp, FAQ,
   animaciones y zoom de imágenes del portafolio
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =========================================================
     ELEMENTOS PRINCIPALES
     ========================================================= */

  const formulario = document.getElementById("formularioContacto");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  const linksNav = document.querySelectorAll(".nav a");

  /* =========================================================
     MENÚ MÓVIL
     ========================================================= */

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("active");
      const menuAbierto = nav.classList.contains("active");
      menuBtn.setAttribute("aria-expanded", String(menuAbierto));
      menuBtn.setAttribute("aria-label", menuAbierto ? "Cerrar menú" : "Abrir menú");
    });
  }

  /* =========================================================
     MENÚ ACTIVO Y CIERRE EN CELULAR
     ========================================================= */

  linksNav.forEach(function (link) {
    link.addEventListener("click", function () {
      linksNav.forEach(function (item) {
        item.classList.remove("active");
      });

      link.classList.add("active");

      if (nav) {
        nav.classList.remove("active");
      }

      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Abrir menú");
      }
    });
  });

  /* =========================================================
     FORMULARIO A WHATSAPP
     ========================================================= */

  if (formulario) {
    formulario.addEventListener("submit", function (event) {
      event.preventDefault();

      const nombre = document.getElementById("nombre")?.value.trim() || "";
      const negocio = document.getElementById("negocio")?.value.trim() || "";
      const servicio = document.getElementById("servicio")?.value.trim() || "";
      const telefono = document.getElementById("telefono")?.value.trim() || "";
      const mensaje = document.getElementById("mensaje")?.value.trim() || "";

      const textoWhatsApp =
        `Hola, quiero recibir información sobre una página web o plataforma digital.\n\n` +
        `Nombre: ${nombre}\n` +
        `Empresa o rubro: ${negocio}\n` +
        `${servicio ? `Servicio que necesito: ${servicio}\n` : ""}` +
        `WhatsApp: ${telefono}\n` +
        `Mensaje: ${mensaje}`;

      const textoCodificado = encodeURIComponent(textoWhatsApp);

      window.open(
        `https://wa.me/51989927055?text=${textoCodificado}`,
        "_blank"
      );

      formulario.reset();
    });
  }

  /* =========================================================
     FAQ ABRIR / CERRAR
     Una sola pregunta abierta a la vez
     ========================================================= */

  const preguntasFAQ = document.querySelectorAll(".faq .pregunta");

  preguntasFAQ.forEach(function (pregunta) {
    const boton = pregunta.querySelector(".pregunta-btn");
    const respuesta = pregunta.querySelector(".respuesta");

    if (!boton || !respuesta) return;

    boton.addEventListener("click", function () {
      const estabaActiva = pregunta.classList.contains("activa");

      preguntasFAQ.forEach(function (item) {
        const respuestaItem = item.querySelector(".respuesta");

        item.classList.remove("activa");

        if (respuestaItem) {
          respuestaItem.style.maxHeight = null;
        }

        const botonItem = item.querySelector(".pregunta-btn");
        if (botonItem) {
          botonItem.setAttribute("aria-expanded", "false");
        }
      });

      if (!estabaActiva) {
        pregunta.classList.add("activa");
        respuesta.style.maxHeight = respuesta.scrollHeight + "px";
        boton.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* =========================================================
     ZOOM DE IMÁGENES DEL PORTAFOLIO
     ========================================================= */

  const imagenesPortafolio = document.querySelectorAll(".imagen-portafolio");
  const visorImagen = document.getElementById("visorImagen");
  const imagenAmpliada = document.getElementById("imagenAmpliada");
  const cerrarVisor = document.getElementById("cerrarVisor");

  function abrirVisor(src, alt) {
    if (!visorImagen || !imagenAmpliada) return;

    imagenAmpliada.src = src;
    imagenAmpliada.alt = alt || "Imagen ampliada";

    visorImagen.classList.add("activo");
    document.body.classList.add("sin-scroll");
  }

  function cerrarVisorImagen() {
    if (!visorImagen || !imagenAmpliada) return;

    visorImagen.classList.remove("activo");
    document.body.classList.remove("sin-scroll");

    setTimeout(function () {
      imagenAmpliada.src = "";
    }, 200);
  }

  imagenesPortafolio.forEach(function (imagen) {
    imagen.addEventListener("click", function () {
      abrirVisor(imagen.src, imagen.alt);
    });
  });

  if (cerrarVisor) {
    cerrarVisor.addEventListener("click", cerrarVisorImagen);
  }

  if (visorImagen) {
    visorImagen.addEventListener("click", function (event) {
      if (event.target === visorImagen) {
        cerrarVisorImagen();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      cerrarVisorImagen();
    }
  });

  /* =========================================================
     ANIMACIONES AL HACER SCROLL
     ========================================================= */

  const elementosParaAnimar = document.querySelectorAll(
    ".tarjeta-servicio, .tarjeta-plan, .tarjeta-proceso, .tarjeta-portafolio, .tarjeta-caso, .tarjeta-testimonio, .beneficio-masterfull, .beneficios-texto, .beneficios-caja, .contacto-texto, .formulario-contacto, .pregunta, .cta-contenido, .hero-texto, .hero-panel, .modulo-item, .animar, .animar-left, .animar-right, .animar-zoom"
  );

  if (elementosParaAnimar.length > 0) {
    elementosParaAnimar.forEach(function (elemento) {
      elemento.classList.add("animar");
      elemento.style.transitionDelay = "0s";
    });

    const observadorAnimaciones = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("mostrar");
            observadorAnimaciones.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    elementosParaAnimar.forEach(function (elemento) {
      observadorAnimaciones.observe(elemento);
    });
  }

  /* =========================================================
     BOTONES DE PLANES
     Efecto visual al hacer clic
     ========================================================= */

  const botonesPlanes = document.querySelectorAll(".planes .boton-plan");

  botonesPlanes.forEach(function (boton) {
    boton.addEventListener("click", function () {
      boton.classList.add("plan-click-activo");

      setTimeout(function () {
        boton.classList.remove("plan-click-activo");
      }, 300);
    });
  });
});
