/* =========================================================
   MASTERFULL - FONDO TECNOLÓGICO
   Red de datos con profundidad simulada y malla en perspectiva
   ========================================================= */

(function () {
  "use strict";

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const esMovil = window.matchMedia("(max-width: 768px)");
  const escenas = [];

  class FondoTecnologico {
    constructor(contenedor) {
      this.contenedor = contenedor;
      this.canvas = document.createElement("canvas");
      this.contexto = this.canvas.getContext("2d", { alpha: true });
      this.particulas = [];
      this.ancho = 0;
      this.alto = 0;
      this.visible = true;
      this.animacion = null;
      this.ultimoTiempo = 0;
      this.puntero = { x: 0, y: 0 };
      this.esHero = Boolean(contenedor.closest(".hero"));

      this.canvas.setAttribute("aria-hidden", "true");
      this.contenedor.appendChild(this.canvas);

      this.observadorTamano = new ResizeObserver(() => this.redimensionar());
      this.observadorTamano.observe(this.contenedor);

      this.observadorVisibilidad = new IntersectionObserver(
        (entradas) => {
          this.visible = entradas[0].isIntersecting;
          this.actualizarEstado();
        },
        { rootMargin: "120px 0px" }
      );
      this.observadorVisibilidad.observe(this.contenedor);

      this.redimensionar();
      this.actualizarEstado();
    }

    cantidadParticulas() {
      if (esMovil.matches) return this.esHero ? 24 : 16;
      return this.esHero ? 54 : 30;
    }

    crearParticula(indice) {
      const profundidad = 0.35 + Math.random() * 0.65;

      return {
        x: Math.random() * this.ancho,
        y: Math.random() * this.alto,
        z: profundidad,
        radio: 0.7 + profundidad * 1.55,
        velocidadX: (Math.random() - 0.5) * (0.12 + profundidad * 0.18),
        velocidadY: (Math.random() - 0.5) * (0.08 + profundidad * 0.12),
        pulso: Math.random() * Math.PI * 2,
        acento: indice % 11 === 0,
      };
    }

    redimensionar() {
      const rectangulo = this.contenedor.getBoundingClientRect();
      const ancho = Math.max(1, Math.round(rectangulo.width));
      const alto = Math.max(1, Math.round(rectangulo.height));
      const densidad = Math.min(window.devicePixelRatio || 1, 1.5);

      if (ancho === this.ancho && alto === this.alto) return;

      this.ancho = ancho;
      this.alto = alto;
      this.canvas.width = Math.round(ancho * densidad);
      this.canvas.height = Math.round(alto * densidad);
      this.canvas.style.width = `${ancho}px`;
      this.canvas.style.height = `${alto}px`;
      this.contexto.setTransform(densidad, 0, 0, densidad, 0, 0);
      this.reiniciarParticulas();
      this.dibujar(0);
    }

    reiniciarParticulas() {
      const cantidad = this.cantidadParticulas();
      this.particulas = Array.from(
        { length: cantidad },
        (_, indice) => this.crearParticula(indice)
      );
    }

    dibujarMalla(tiempo) {
      const ctx = this.contexto;
      const horizonte = this.alto * 0.54;
      const base = this.alto * 1.08;
      const centro = this.ancho * 0.63 + this.puntero.x * 7;
      const desplazamiento = reducirMovimiento.matches ? 0 : (tiempo * 0.018) % 34;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonte, this.ancho, this.alto - horizonte);
      ctx.clip();
      ctx.lineWidth = 0.65;

      for (let i = -10; i <= 10; i += 1) {
        ctx.beginPath();
        ctx.moveTo(centro + i * 12, horizonte);
        ctx.lineTo(centro + i * this.ancho * 0.18, base);
        ctx.strokeStyle = "rgba(50, 197, 233, 0.11)";
        ctx.stroke();
      }

      for (let y = horizonte + desplazamiento; y < base; y += 34) {
        const progreso = (y - horizonte) / (base - horizonte);
        const yPerspectiva = horizonte + progreso * progreso * (base - horizonte);
        ctx.beginPath();
        ctx.moveTo(0, yPerspectiva);
        ctx.lineTo(this.ancho, yPerspectiva);
        ctx.strokeStyle = `rgba(50, 197, 233, ${0.035 + progreso * 0.09})`;
        ctx.stroke();
      }

      ctx.restore();
    }

    dibujar(tiempo) {
      const ctx = this.contexto;
      ctx.clearRect(0, 0, this.ancho, this.alto);
      this.dibujarMalla(tiempo);

      const distanciaMaxima = esMovil.matches ? 105 : 145;

      for (let i = 0; i < this.particulas.length; i += 1) {
        const particula = this.particulas[i];
        let conexiones = 0;

        for (let j = i + 1; j < this.particulas.length; j += 1) {
          const vecina = this.particulas[j];
          const dx = particula.x - vecina.x;
          const dy = particula.y - vecina.y;
          const distancia = Math.hypot(dx, dy);

          if (distancia < distanciaMaxima && conexiones < 3) {
            const opacidad =
              (1 - distancia / distanciaMaxima) *
              0.24 *
              Math.min(particula.z, vecina.z);

            ctx.beginPath();
            ctx.moveTo(particula.x, particula.y);
            ctx.lineTo(vecina.x, vecina.y);
            ctx.strokeStyle = `rgba(50, 197, 233, ${opacidad})`;
            ctx.lineWidth = 0.55 + Math.min(particula.z, vecina.z) * 0.45;
            ctx.stroke();
            conexiones += 1;
          }
        }
      }

      this.particulas.forEach((particula) => {
        const pulso = reducirMovimiento.matches
          ? 1
          : 0.84 + Math.sin(tiempo * 0.0016 + particula.pulso) * 0.16;
        const radio = particula.radio * pulso;

        ctx.beginPath();
        ctx.arc(particula.x, particula.y, radio * 3.4, 0, Math.PI * 2);
        ctx.fillStyle = particula.acento
          ? "rgba(32, 216, 122, 0.045)"
          : "rgba(50, 197, 233, 0.04)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particula.x, particula.y, radio, 0, Math.PI * 2);
        ctx.fillStyle = particula.acento
          ? `rgba(78, 236, 156, ${0.42 + particula.z * 0.35})`
          : `rgba(100, 220, 248, ${0.34 + particula.z * 0.45})`;
        ctx.fill();
      });
    }

    mover(delta) {
      this.particulas.forEach((particula) => {
        particula.x += (particula.velocidadX + this.puntero.x * particula.z * 0.012) * delta;
        particula.y += (particula.velocidadY + this.puntero.y * particula.z * 0.008) * delta;

        if (particula.x < -20) particula.x = this.ancho + 20;
        if (particula.x > this.ancho + 20) particula.x = -20;
        if (particula.y < -20) particula.y = this.alto + 20;
        if (particula.y > this.alto + 20) particula.y = -20;
      });
    }

    animar = (tiempo) => {
      const delta = Math.min(2, (tiempo - this.ultimoTiempo) / 16.67 || 1);
      this.ultimoTiempo = tiempo;
      this.mover(delta);
      this.dibujar(tiempo);
      this.animacion = requestAnimationFrame(this.animar);
    };

    actualizarEstado() {
      const debeAnimar =
        this.visible && !document.hidden && !reducirMovimiento.matches;

      if (debeAnimar && !this.animacion) {
        this.ultimoTiempo = performance.now();
        this.animacion = requestAnimationFrame(this.animar);
      } else if (!debeAnimar && this.animacion) {
        cancelAnimationFrame(this.animacion);
        this.animacion = null;
        this.dibujar(0);
      } else if (!debeAnimar) {
        this.dibujar(0);
      }
    }
  }

  function iniciarFondos() {
    document.querySelectorAll(".fondo-tecnologico").forEach((contenedor) => {
      escenas.push(new FondoTecnologico(contenedor));
    });
  }

  window.addEventListener(
    "pointermove",
    (evento) => {
      if (reducirMovimiento.matches || esMovil.matches) return;

      const x = evento.clientX / window.innerWidth - 0.5;
      const y = evento.clientY / window.innerHeight - 0.5;
      escenas.forEach((escena) => {
        escena.puntero.x = x;
        escena.puntero.y = y;
      });
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    escenas.forEach((escena) => escena.actualizarEstado());
  });

  reducirMovimiento.addEventListener("change", () => {
    escenas.forEach((escena) => escena.actualizarEstado());
  });

  esMovil.addEventListener("change", () => {
    escenas.forEach((escena) => {
      escena.reiniciarParticulas();
      escena.dibujar(0);
    });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarFondos);
  } else {
    iniciarFondos();
  }
})();
