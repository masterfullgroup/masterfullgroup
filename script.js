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
  const gsap = window.gsap;
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let efectosNav = null;

  if (nav && linksNav.length && gsap) {
    const indicador = document.createElement("span");
    const brillo = document.createElement("span");
    indicador.className = "nav-indicator";
    indicador.setAttribute("aria-hidden", "true");
    brillo.className = "nav-indicator-glint";
    indicador.appendChild(brillo);
    nav.prepend(indicador);
    nav.classList.add("has-indicator");

    const enlaceActual = function () {
      return nav.querySelector('[aria-current="page"]') || nav.querySelector(".active") || linksNav[0];
    };

    const moverIndicador = function (enlace, inmediato, destello) {
      if (!enlace || !nav.clientWidth) return;

      const destino = {
        x: enlace.offsetLeft,
        y: enlace.offsetTop + (enlace.offsetHeight - indicador.offsetHeight) / 2,
        scaleX: enlace.offsetWidth / nav.clientWidth,
        opacity: 1,
      };

      if (inmediato || reducirMovimiento) {
        gsap.set(indicador, destino);
        indicador.style.willChange = "auto";
      } else {
        indicador.style.willChange = "transform, opacity";
        gsap.to(indicador, {
          ...destino,
          duration: 0.38,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: function () { indicador.style.willChange = "auto"; },
        });
      }

      if (destello && !reducirMovimiento) {
        gsap.fromTo(brillo, { xPercent: -20, autoAlpha: 0 }, {
          xPercent: 420,
          autoAlpha: 0.9,
          duration: 0.52,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: function () { gsap.set(brillo, { autoAlpha: 0 }); },
        });
      }
    };

    if (!reducirMovimiento && window.matchMedia("(min-width: 821px)").matches) {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(linksNav, { y: 8, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.32,
          stagger: 0.045,
          clearProps: "transform,opacity,visibility",
        });
    }

    moverIndicador(enlaceActual(), true, false);

    linksNav.forEach(function (enlace) {
      enlace.addEventListener("pointerenter", function (evento) {
        if (evento.pointerType === "touch") return;
        moverIndicador(enlace, reducirMovimiento, true);
        if (!reducirMovimiento) {
          gsap.to(enlace, { y: -2, scale: 1.035, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        }
      });

      enlace.addEventListener("pointerleave", function (evento) {
        if (evento.pointerType === "touch") return;
        if (reducirMovimiento) gsap.set(enlace, { y: 0, scale: 1 });
        else gsap.to(enlace, { y: 0, scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        if (!nav.contains(document.activeElement)) moverIndicador(enlaceActual(), false, false);
      });

      enlace.addEventListener("focus", function () {
        moverIndicador(enlace, false, true);
      });

      enlace.addEventListener("blur", function () {
        requestAnimationFrame(function () {
          moverIndicador(nav.querySelector(":focus") || enlaceActual(), false, false);
        });
      });
    });

    let entradaMovil;
    efectosNav = {
      activar: function (enlace) { moverIndicador(enlace, false, true); },
      abrirMovil: function () {
        requestAnimationFrame(function () {
          moverIndicador(enlaceActual(), true, false);
          if (!reducirMovimiento) {
            entradaMovil = gsap.timeline({ defaults: { ease: "power3.out" } })
              .fromTo(linksNav, { y: 10, autoAlpha: 0 }, {
                y: 0,
                autoAlpha: 1,
                duration: 0.24,
                stagger: 0.035,
                clearProps: "transform,opacity,visibility",
              });
          }
        });
      },
      cerrarMovil: function () {
        if (entradaMovil) entradaMovil.kill();
        gsap.set(linksNav, { clearProps: "transform,opacity,visibility" });
      },
      reajustar: function () { moverIndicador(enlaceActual(), true, false); },
    };

    window.addEventListener("resize", function () {
      requestAnimationFrame(function () { efectosNav?.reajustar(); });
    }, { passive: true });
  }

  /* =========================================================
     MENÚ MÓVIL
     ========================================================= */

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("active");
      const menuAbierto = nav.classList.contains("active");
      menuBtn.setAttribute("aria-expanded", String(menuAbierto));
      menuBtn.setAttribute("aria-label", menuAbierto ? "Cerrar menú" : "Abrir menú");
      if (menuAbierto) efectosNav?.abrirMovil();
      else efectosNav?.cerrarMovil();
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
      efectosNav?.activar(link);

      if (nav) {
        nav.classList.remove("active");
      }

      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Abrir menú");
      }
    });
  });

  /* Tarjetas de servicios: giro con control accesible para mouse, teclado y móvil */
  document.querySelectorAll(".tarjeta-servicio").forEach(function (tarjeta) {
    const botonAbrir = tarjeta.querySelector(".servicio-card-toggle");
    const botonVolver = tarjeta.querySelector(".servicio-card-volver");
    const frente = tarjeta.querySelector(".servicio-frente");
    const reverso = tarjeta.querySelector(".servicio-reverso");

    if (!botonAbrir || !botonVolver || !frente || !reverso) return;

    let fijadaAbierta = false;

    function mostrarReverso(mostrar) {
      tarjeta.classList.toggle("volteada", mostrar);
      botonAbrir.setAttribute("aria-expanded", String(mostrar));
      frente.setAttribute("aria-hidden", String(mostrar));
      reverso.setAttribute("aria-hidden", String(!mostrar));
      frente.inert = mostrar;
      reverso.inert = !mostrar;
    }

    botonAbrir.addEventListener("click", function () {
      fijadaAbierta = true;
      mostrarReverso(true);
      botonVolver.focus();
    });

    botonVolver.addEventListener("click", function () {
      fijadaAbierta = false;
      mostrarReverso(false);
      botonAbrir.focus();
    });

    tarjeta.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse" && !fijadaAbierta) mostrarReverso(true);
    });

    tarjeta.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse" && !fijadaAbierta) mostrarReverso(false);
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
        `https://wa.me/${window.masterfullWhatsapp || "51989927055"}?text=${textoCodificado}`,
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
