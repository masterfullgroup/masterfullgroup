import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const raiz = new URL("../", import.meta.url);
const paginas = [
  "index.html",
  "servicios.html",
  "planes.html",
  "proceso.html",
  "portafolio.html",
  "contacto.html",
];

test("todas las páginas cargan el fondo tecnológico", async () => {
  for (const pagina of paginas) {
    const html = await readFile(new URL(pagina, raiz), "utf8");
    assert.match(html, /class="fondo-tecnologico"/);
    assert.match(html, /<script src="fondo-3d\.js\?v=1"><\/script>/);
  }
});

test("el build incluye un Worker compatible y todos los recursos", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  await access(workerUrl);

  const { default: worker } = await import(
    `${workerUrl.href}?prueba=${Date.now()}`
  );

  for (const pagina of paginas) {
    const respuesta = await worker.fetch(
      new Request(`https://masterfull.test/${pagina}`)
    );
    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers.get("content-type") || "", /^text\/html/);
  }

  const fondo = await worker.fetch(
    new Request("https://masterfull.test/fondo-3d.js")
  );
  assert.equal(fondo.status, 200);
  assert.match(await fondo.text(), /class FondoTecnologico/);
});
