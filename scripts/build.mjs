import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

const raiz = resolve(import.meta.dirname, "..");
const destino = resolve(raiz, "dist");
const archivos = [
  "index.html",
  "servicios.html",
  "planes.html",
  "proceso.html",
  "portafolio.html",
  "contacto.html",
  "styles.css",
  "script.js",
  "fondo-3d.js",
  "img/pagina-web-basica.webp",
  "img/plataforma-profesional.webp",
  "img/web-profesional-modelo.webp",
];

const tipos = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
};

await rm(destino, { recursive: true, force: true });
await mkdir(resolve(destino, "server"), { recursive: true });
await mkdir(resolve(destino, "static"), { recursive: true });

const recursos = {};

for (const archivo of archivos) {
  const ruta = resolve(raiz, archivo);
  const extension = extname(archivo);
  const binario = extension === ".webp";
  const contenido = await readFile(ruta, binario ? undefined : "utf8");
  const rutaWeb = `/${archivo.replaceAll("\\", "/")}`;

  recursos[rutaWeb] = {
    tipo: tipos[extension] || "application/octet-stream",
    binario,
    contenido: binario ? contenido.toString("base64") : contenido,
  };

  const copia = resolve(destino, "static", relative(raiz, ruta));
  await mkdir(resolve(copia, ".."), { recursive: true });
  await cp(ruta, copia);
}

const worker = `/* Archivo generado automáticamente por scripts/build.mjs */
const recursos = ${JSON.stringify(recursos)};

function decodificarBase64(valor) {
  const binario = atob(valor);
  const bytes = new Uint8Array(binario.length);
  for (let indice = 0; indice < binario.length; indice += 1) {
    bytes[indice] = binario.charCodeAt(indice);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let ruta = decodeURIComponent(url.pathname);

    if (ruta === "/") ruta = "/index.html";
    if (ruta.endsWith("/")) ruta += "index.html";

    const recurso = recursos[ruta];
    if (!recurso) {
      return new Response("Página no encontrada", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    const cuerpo = recurso.binario
      ? decodificarBase64(recurso.contenido)
      : recurso.contenido;

    return new Response(request.method === "HEAD" ? null : cuerpo, {
      status: 200,
      headers: {
        "content-type": recurso.tipo,
        "cache-control": ruta.endsWith(".html")
          ? "public, max-age=0, must-revalidate"
          : "public, max-age=86400",
        "x-content-type-options": "nosniff",
      },
    });
  },
};
`;

await writeFile(resolve(destino, "server", "index.js"), worker, "utf8");
