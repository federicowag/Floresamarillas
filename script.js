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
    ramo.classList.remove("abierto");
    void ramo.offsetWidth;                 // reinicia las animaciones
  }

  requestAnimationFrame(() => ramo.classList.add("abierto"));

  lluviaDePetalos();
  if (navigator.vibrate) navigator.vibrate([18, 40, 18]);

  if (primeraVez) {
    setTimeout(() => {
      ramo.scrollIntoView({ behavior: menosMovimiento ? "auto" : "smooth", block: "start" });
    }, 420);
  }
}

boton.addEventListener("click", abrirRamo);

/* ═══════════════ 3. Lluvia de pétalos ═══════════════ */

const lluvia = document.getElementById("lluvia");

function lluviaDePetalos() {
  if (menosMovimiento) return;

  const cuantos = window.innerWidth < 500 ? 34 : 46;

  for (let i = 0; i < cuantos; i++) {
    const p = document.createElement("span");
    const corazon = i % 8 === 0;
    p.className = corazon ? "petalo corazon" : "petalo";
    if (corazon) p.textContent = Math.random() < .5 ? "💛" : "🌼";

    const tam = alAzar(9, 18);
    const dur = alAzar(4.5, 8);
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

/* ═══════════════ 4. Contador de días ═══════════════ */

function contar() {
  const inicio = new Date(AJUSTES.fechaInicio + "T00:00:00");
  const hoy = new Date();
  if (isNaN(inicio)) return;

  const dias = Math.max(0, Math.floor((hoy - inicio) / 86400000));
  let meses = (hoy.getFullYear() - inicio.getFullYear()) * 12 + (hoy.getMonth() - inicio.getMonth());
  if (hoy.getDate() < inicio.getDate()) meses--;

  document.getElementById("dato-dias").textContent = dias;
  document.getElementById("dato-meses").textContent = Math.max(0, meses);
  document.getElementById("dato-flores").textContent = AJUSTES.cantidadFlores;
}

/* ═══════════════ 5. Carrusel de fotitos ═══════════════ */

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

/* ═══════════════ 6. Arrancamos ═══════════════ */

armarRamo();
armarCarrusel();
contar();
arrancarSolo();

// por las dudas: si el navegador estaba ocupado cargando las fotos,
// nos aseguramos de que el carrusel quede andando igual
window.addEventListener("load", () => { if (!solo) arrancarSolo(); });
window.addEventListener("pageshow", () => { if (!solo) arrancarSolo(); });
