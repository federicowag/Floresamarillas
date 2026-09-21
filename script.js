/* ===========================================================
   Felices 5 meses · script
   ─────────────────────────────────────────────────────────
   Para cambiar cosas, tocá solo este bloque de AJUSTES 👇
   =========================================================== */

const AJUSTES = {
  // Día en que empezaron (año-mes-día). Cambialo por el de ustedes.
  fechaInicio: "2026-04-21",

  // Cuántas flores tiene el ramo (21, por el 21 de septiembre).
  cantidadFlores: 21,

  // Cada cuántos segundos pasa sola a la foto siguiente.
  segundosPorFoto: 3.5,

  // Volumen de la canción (0 = mudo, 1 = al mango).
  volumen: 0.55,

  // Las fotos del carrusel, en orden. Para sumar más: copiá la imagen
  // dentro de la carpeta "fotos/" y agregá una línea acá abajo.
  fotos: [
    "fotos/foto-1.jpg",
    "fotos/foto-2.jpg",
    "fotos/foto-3.jpg",
    "fotos/foto-4.jpg",
    "fotos/foto-5.jpg",
    "fotos/foto-6.jpg",
    "fotos/foto-7.jpg",
    "fotos/foto-8.jpg",
    "fotos/foto-9.jpg",
    "fotos/foto-10.jpg"
  ]
};

const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ═══════════════ 1. El ramo de flores amarillas ═══════════════ */

const ORIGEN = { x: 200, y: 392 };          // de donde salen todos los tallos
const AMARILLOS = ["#ffd230", "#ffc107", "#ffde59", "#f9b233", "#ffcb2f", "#ffe17d"];
const VERDES    = ["#7aa84f", "#6b9a45", "#87b75c"];

// tres hileras: la de atrás más abierta y chiquita, la de adelante más grande
const HILERAS = [
  { cantidad: 9, rx: 180, ry: 300, escala: 0.80, abanico: 66 },
  { cantidad: 7, rx: 130, ry: 215, escala: 0.95, abanico: 52 },
  { cantidad: 5, rx:  78, ry: 130, escala: 1.12, abanico: 38 }
];

const NS = "http://www.w3.org/2000/svg";
const crear = (tag, attrs = {}) => {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
};
const alAzar = (a, b) => a + Math.random() * (b - a);
const unoDe  = (lista) => lista[Math.floor(Math.random() * lista.length)];

const CAPAS = ["capa-tallos", "capa-hojas", "capa-papel", "capa-flores", "capa-lazo"];

function vaciarRamo() {
  CAPAS.forEach((id) => { document.getElementById(id).textContent = ""; });
}

function armarRamo() {
  const capaPapel  = document.getElementById("capa-papel");
  const capaTallos = document.getElementById("capa-tallos");
  const capaHojas  = document.getElementById("capa-hojas");
  const capaFlores = document.getElementById("capa-flores");
  const capaLazo   = document.getElementById("capa-lazo");

  // ── papel que envuelve el ramo ──
  capaPapel.appendChild(crear("path", {
    class: "papel",
    d: "M200,400 L132,296 Q200,326 268,296 Z",
    fill: "#ecd9b0", stroke: "#d7bd8c", "stroke-width": "2", "stroke-linejoin": "round"
  }));
  capaPapel.appendChild(crear("path", {
    class: "papel",
    d: "M200,400 L162,300 Q200,318 238,300 Z",
    fill: "#f9ecd2", opacity: ".95"
  }));

  // ── las flores, hilera por hilera (primero las de atrás) ──
  let n = 0;
  const posiciones = [];

  HILERAS.forEach((h) => {
    for (let i = 0; i < h.cantidad && n < AJUSTES.cantidadFlores; i++, n++) {
      const t = h.cantidad === 1 ? 0 : (i / (h.cantidad - 1)) * 2 - 1;   // -1 … 1
      const ang = (t * h.abanico * Math.PI) / 180;

      const x = ORIGEN.x + h.rx * Math.sin(ang) + alAzar(-6, 6);
      const y = ORIGEN.y - h.ry * (0.45 + 0.55 * Math.cos(ang)) + alAzar(-8, 8);
      const escala = h.escala * alAzar(0.9, 1.08);

      posiciones.push({ x, y, escala, indice: n });
    }
  });

  posiciones.forEach((p, i) => {
    const demora = (i * 55) + "ms";

    // ── tallo ──
    const cx = ORIGEN.x + (p.x - ORIGEN.x) * 0.18;
    const cy = (ORIGEN.y + p.y) / 2;
    const tallo = crear("path", {
      class: "tallo",
      d: `M${ORIGEN.x},${ORIGEN.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      stroke: unoDe(VERDES),
      "stroke-width": (3.2 * p.escala).toFixed(1),
      style: `transition-delay:${demora}`
    });
    capaTallos.appendChild(tallo);
    const largo = tallo.getTotalLength();
    tallo.style.setProperty("--largo", largo.toFixed(1));

    // ── hojita (en una de cada dos) ──
    if (i % 2 === 0) {
      const m = tallo.getPointAtLength(largo * alAzar(0.42, 0.62));
      const lado = p.x < ORIGEN.x ? -1 : 1;
      const giro = alAzar(-35, 35) + (lado > 0 ? 25 : -25);
      const hoja = crear("ellipse", {
        class: "hoja",
        cx: (m.x + 11 * lado).toFixed(1), cy: m.y.toFixed(1),
        rx: (13 * p.escala).toFixed(1), ry: (5.2 * p.escala).toFixed(1),
        fill: unoDe(VERDES), opacity: ".95",
        transform: `rotate(${giro.toFixed(0)} ${(m.x + 11 * lado).toFixed(1)} ${m.y.toFixed(1)})`,
        style: `transform-origin:${m.x.toFixed(1)}px ${m.y.toFixed(1)}px; transition-delay:${(i * 55 + 120)}ms`
      });
      capaHojas.appendChild(hoja);
    }

    // ── flor ──
    capaFlores.appendChild(armarFlor(p, demora));
  });

  // ── lazo ──
  const lazo = crear("g", { class: "lazo" });
  lazo.appendChild(crear("path", {
    d: "M200,352 C176,336 150,340 152,356 C154,372 182,368 200,352 Z",
    fill: "#ffb3c1", stroke: "#f78fa7", "stroke-width": "1.5"
  }));
  lazo.appendChild(crear("path", {
    d: "M200,352 C224,336 250,340 248,356 C246,372 218,368 200,352 Z",
    fill: "#ffb3c1", stroke: "#f78fa7", "stroke-width": "1.5"
  }));
  lazo.appendChild(crear("path", {
    d: "M198,356 C190,372 182,382 172,390", fill: "none",
    stroke: "#f78fa7", "stroke-width": "3", "stroke-linecap": "round"
  }));
  lazo.appendChild(crear("path", {
    d: "M202,356 C210,372 220,380 232,386", fill: "none",
    stroke: "#f78fa7", "stroke-width": "3", "stroke-linecap": "round"
  }));
  lazo.appendChild(crear("circle", { cx: 200, cy: 354, r: 7, fill: "#ff9fb2" }));
  capaLazo.appendChild(lazo);
}

function armarFlor({ x, y, escala }, demora) {
  const g = crear("g", {
    class: "flor",
    style: `transform-origin:${x.toFixed(1)}px ${y.toFixed(1)}px; transition-delay:${demora}`
  });

  const petalos = 8;
  const color = unoDe(AMARILLOS);
  const giroBase = alAzar(0, 45);

  // capa de atrás (da volumen)
  for (let k = 0; k < petalos; k++) {
    const ang = giroBase + (360 / petalos) * k + 22;
    g.appendChild(crear("ellipse", {
      cx: x.toFixed(1), cy: (y - 15 * escala).toFixed(1),
      rx: (6.5 * escala).toFixed(1), ry: (15 * escala).toFixed(1),
      fill: color, opacity: ".55",
      transform: `rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`
    }));
  }
  // capa de adelante
  for (let k = 0; k < petalos; k++) {
    const ang = giroBase + (360 / petalos) * k;
    g.appendChild(crear("ellipse", {
      cx: x.toFixed(1), cy: (y - 16 * escala).toFixed(1),
      rx: (7 * escala).toFixed(1), ry: (16.5 * escala).toFixed(1),
      fill: color, stroke: "rgba(200,130,0,.22)", "stroke-width": ".8"
    , transform: `rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`}));
  }

  // corazón de la flor
  g.appendChild(crear("circle", {
    cx: x.toFixed(1), cy: y.toFixed(1), r: (8 * escala).toFixed(1), fill: "#8a5a2b"
  }));
  const centro = crear("g", {
    class: "centro-flor",
    style: `transform-origin:${x.toFixed(1)}px ${y.toFixed(1)}px`
  });
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI * 2 * k) / 6;
    centro.appendChild(crear("circle", {
      cx: (x + Math.cos(a) * 4 * escala).toFixed(1),
      cy: (y + Math.sin(a) * 4 * escala).toFixed(1),
      r: (1.5 * escala).toFixed(1), fill: "#c98b3f"
    }));
  }
  g.appendChild(centro);
  return g;
}

/* ═══════════════ 2. Botón: que florezca ═══════════════ */

const ramo  = document.getElementById("ramo");
const boton = document.getElementById("boton-ramo");

function abrirRamo() {
  const primeraVez = ramo.hidden;

  if (primeraVez) {
    ramo.hidden = false;
    boton.setAttribute("aria-expanded", "true");
    boton.classList.add("abierto");
    boton.querySelector(".boton-texto").textContent = "Otra vez 💛";
  } else {
    // No alcanza con sacar y poner la clase: la transición que devuelve las
    // flores a scale(0) queda a mitad de camino y se revierte, así que no se
    // vuelven a abrir. Armamos un ramo nuevo (sale distinto cada vez) y
    // brota de cero.
    ramo.classList.remove("abierto");
    vaciarRamo();
    armarRamo();
    void ramo.offsetWidth;
  }

  requestAnimationFrame(() => ramo.classList.add("abierto"));

  estallido();
  lluviaDePetalos();
  sonar();
  if (navigator.vibrate) navigator.vibrate([25, 45, 25, 45, 60]);

  // siempre bajamos al ramo: si no, al tocar "otra vez" desde arriba
  // las flores brotan fuera de la pantalla y no se ven
  setTimeout(() => {
    ramo.scrollIntoView({ behavior: menosMovimiento ? "auto" : "smooth", block: "start" });
  }, 420);
}

boton.addEventListener("click", abrirRamo);

/* ═══════════════ 3. La canción ═══════════════ */

const cancion      = document.getElementById("cancion");
const botonSonido  = document.getElementById("boton-sonido");
const iconoSonido  = botonSonido.querySelector(".icono-sonido");
let subiendoVolumen = null;

function sonar() {
  if (!cancion || !cancion.paused) return;

  cancion.volume = 0;
  const promesa = cancion.play();

  // si el navegador la deja sonar, sube el volumen de a poquito
  Promise.resolve(promesa)
    .then(() => {
      botonSonido.hidden = false;
      pintarSonido();
      clearInterval(subiendoVolumen);
      subiendoVolumen = setInterval(() => {
        const nuevo = Math.min(AJUSTES.volumen, cancion.volume + AJUSTES.volumen / 25);
        cancion.volume = nuevo;
        if (nuevo >= AJUSTES.volumen) clearInterval(subiendoVolumen);
      }, 90);
    })
    .catch(() => {
      // algún navegador la frenó: mostramos el botón para prenderla a mano
      botonSonido.hidden = false;
      pintarSonido();
    });
}

function pintarSonido() {
  const sonando = !cancion.paused;
  iconoSonido.textContent = sonando ? "🔊" : "🔇";
  botonSonido.setAttribute("aria-pressed", sonando ? "true" : "false");
  botonSonido.setAttribute("aria-label", sonando ? "Pausar la música" : "Poner la música");
}

botonSonido.addEventListener("click", () => {
  if (cancion.paused) {
    clearInterval(subiendoVolumen);
    cancion.volume = AJUSTES.volumen;
    cancion.play().then(pintarSonido).catch(pintarSonido);
  } else {
    cancion.pause();
    pintarSonido();
  }
});

cancion.addEventListener("play", pintarSonido);
cancion.addEventListener("pause", pintarSonido);

/* ═══════════════ 4. Lluvia de pétalos ═══════════════ */

const lluvia = document.getElementById("lluvia");
const DIBUJITOS = ["💛", "🌼", "🌻", "✨"];

/* el golpe de efecto: un fogonazo dorado y pétalos disparados desde el botón */
function estallido() {
  if (menosMovimiento) return;

  const caja = boton.getBoundingClientRect();
  const x = caja.left + caja.width / 2;
  const y = caja.top + caja.height / 2;
  const posicion = `left:${x}px; top:${y}px;`;

  // fogonazo que se come la pantalla
  const luz = document.createElement("span");
  luz.className = "destello";
  luz.style.cssText = posicion;
  lluvia.appendChild(luz);
  setTimeout(() => luz.remove(), 1000);

  // dos aros que se expanden
  for (let k = 0; k < 2; k++) {
    const aro = document.createElement("span");
    aro.className = "aro";
    aro.style.cssText = posicion + `animation-delay:${k * 0.14}s;`;
    lluvia.appendChild(aro);
    setTimeout(() => aro.remove(), 1400);
  }

  // pétalos y flores disparados en todas las direcciones
  const cuantas = window.innerWidth < 500 ? 30 : 44;
  for (let i = 0; i < cuantas; i++) {
    const ch = document.createElement("span");
    const angulo = (Math.PI * 2 * i) / cuantas + alAzar(-0.2, 0.2);
    const fuerza = alAzar(110, 320);
    const tam = alAzar(10, 22);
    const dibujito = i % 4 === 0;

    ch.className = dibujito ? "chispa dibujito" : "chispa";
    if (dibujito) ch.textContent = unoDe(DIBUJITOS);

    ch.style.cssText = posicion + `
      --dx:${(Math.cos(angulo) * fuerza).toFixed(0)}px;
      --dy:${(Math.sin(angulo) * fuerza - 60).toFixed(0)}px;
      --giro:${alAzar(-540, 540).toFixed(0)}deg;
      --tam:${tam.toFixed(0)}px;
      --dur:${alAzar(1.1, 1.8).toFixed(2)}s;`;
    lluvia.appendChild(ch);
    setTimeout(() => ch.remove(), 2200);
  }
}

function lluviaDePetalos() {
  if (menosMovimiento) return;

  const cuantos = window.innerWidth < 500 ? 48 : 64;

  for (let i = 0; i < cuantos; i++) {
    const p = document.createElement("span");
    const corazon = i % 5 === 0;
    p.className = corazon ? "petalo corazon" : "petalo";
    if (corazon) p.textContent = unoDe(DIBUJITOS);

    const tam = alAzar(10, 22);
    const dur = alAzar(4, 7.5);
    p.style.left = alAzar(-5, 100) + "vw";
    p.style.setProperty("--dur", dur.toFixed(2) + "s");
    p.style.setProperty("--retraso", alAzar(0, 1.6).toFixed(2) + "s");
    p.style.setProperty("--deriva", alAzar(-90, 90).toFixed(0) + "px");
    p.style.setProperty("--giro", alAzar(-720, 720).toFixed(0) + "deg");
    if (!corazon) { p.style.width = tam + "px"; p.style.height = tam + "px"; }
    else { p.style.fontSize = (tam + 6) + "px"; }

    lluvia.appendChild(p);
    setTimeout(() => p.remove(), (dur + 2) * 1000);
  }
}

/* ═══════════════ 5. Contador de días ═══════════════ */

const MESES_NOMBRE = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function contar() {
  const inicio = new Date(AJUSTES.fechaInicio + "T00:00:00");
  if (isNaN(inicio)) return;

  document.getElementById("desde").textContent =
    `Juntos desde el ${inicio.getDate()} de ${MESES_NOMBRE[inicio.getMonth()]}`;

  // se actualiza solo: a las 00:00 pasa de 4 a 5 meses sin recargar la página
  const latir = () => {
    const ahora = new Date();

    // días completos de calendario, sin que los horarios los corran
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const arranque = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const dias = Math.max(0, Math.round((hoy - arranque) / 86400000));

    let meses = (ahora.getFullYear() - inicio.getFullYear()) * 12 + (ahora.getMonth() - inicio.getMonth());
    if (ahora.getDate() < inicio.getDate()) meses--;

    document.getElementById("dato-dias").textContent = dias;
    document.getElementById("dato-meses").textContent = Math.max(0, meses);

    // el detalle fino, segundo a segundo
    const pasado = Math.max(0, ahora - inicio);
    const horas   = Math.floor(pasado / 3600000) % 24;
    const minutos = Math.floor(pasado / 60000) % 60;
    const segundos = Math.floor(pasado / 1000) % 60;

    const cuenta = (n, palabra) => `<b>${n}</b> ${palabra}${n === 1 ? "" : "s"}`;

    document.getElementById("preciso").innerHTML =
      `y ya llevamos ${cuenta(dias, "día")}, ${cuenta(horas, "hora")}, ` +
      `${cuenta(minutos, "minuto")} y ${cuenta(segundos, "segundo")} juntos`;
  };

  latir();
  setInterval(latir, 1000);
}

/* ═══════════════ 6. Carrusel de fotitos ═══════════════ */

const pista    = document.getElementById("pista");
const puntitos = document.getElementById("puntitos");
let actual = 0;
let solo = null;          // temporizador del pase automático
let descanso = null;      // pausa cuando la tocan

function armarCarrusel() {
  AJUSTES.fotos.forEach((foto, i) => {
    const fig = document.createElement("figure");
    fig.className = "diapo";

    const img = document.createElement("img");
    img.src = foto;
    img.alt = `Foto ${i + 1} de nosotros`;
    img.width = 1200; img.height = 1600;
    img.decoding = "async";
    if (i > 1) img.loading = "lazy";

    fig.appendChild(img);
    pista.appendChild(fig);

    const punto = document.createElement("button");
    punto.className = "puntito";
    punto.type = "button";
    punto.setAttribute("role", "tab");
    punto.setAttribute("aria-label", `Ver foto ${i + 1}`);
    punto.setAttribute("aria-selected", i === 0 ? "true" : "false");
    punto.addEventListener("click", () => { irA(i); pausar(); });
    puntitos.appendChild(punto);
  });

  // marcar el puntito de la foto que se está viendo
  const vigia = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.55) {
        actual = [...pista.children].indexOf(e.target);
        [...puntitos.children].forEach((p, i) =>
          p.setAttribute("aria-selected", i === actual ? "true" : "false"));
      }
    });
  }, { root: pista, threshold: [0.56] });

  [...pista.children].forEach((d) => vigia.observe(d));
}

function irA(i) {
  const total = pista.children.length;
  if (!total) return;
  const destino = pista.children[(i + total) % total];

  // movemos SOLO el carrusel (nada de scrollIntoView: haría saltar la página)
  const cajaPista   = pista.getBoundingClientRect();
  const cajaDestino = destino.getBoundingClientRect();
  const diferencia  = (cajaDestino.left + cajaDestino.width / 2) - (cajaPista.left + cajaPista.width / 2);

  pista.scrollTo({
    left: pista.scrollLeft + diferencia,
    behavior: menosMovimiento ? "auto" : "smooth"
  });
}

function arrancarSolo() {
  detenerSolo();
  if (AJUSTES.fotos.length < 2) return;
  solo = setInterval(() => {
    if (document.hidden) return;
    irA(actual + 1);
  }, Math.max(1500, AJUSTES.segundosPorFoto * 1000));
}
function detenerSolo() { clearInterval(solo); solo = null; }

// cuando la tocan, frena un ratito y después sigue sola
function pausar() {
  detenerSolo();
  clearTimeout(descanso);
  descanso = setTimeout(arrancarSolo, 6000);
}

document.querySelector(".flecha-izq").addEventListener("click", () => { irA(actual - 1); pausar(); });
document.querySelector(".flecha-der").addEventListener("click", () => { irA(actual + 1); pausar(); });

pista.addEventListener("pointerdown", pausar, { passive: true });
pista.addEventListener("wheel", pausar, { passive: true });
pista.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { irA(actual + 1); pausar(); e.preventDefault(); }
  if (e.key === "ArrowLeft")  { irA(actual - 1); pausar(); e.preventDefault(); }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) detenerSolo(); else arrancarSolo();
});

/* ═══════════════ 7. Arrancamos ═══════════════ */

armarRamo();
armarCarrusel();
contar();
arrancarSolo();

// por las dudas: si el navegador estaba ocupado cargando las fotos,
// nos aseguramos de que el carrusel quede andando igual
window.addEventListener("load", () => { if (!solo) arrancarSolo(); });
window.addEventListener("pageshow", () => { if (!solo) arrancarSolo(); });
