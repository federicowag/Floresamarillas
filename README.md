# 🌼 Felices 5 meses

Sitio romántico, pensado para abrirse desde el celular: al entrar dice
**“Felices 5 meses mi amor”**, un botón despliega un ramo de 21 flores amarillas
(por el 21 de septiembre, día de la primavera) con lluvia de pétalos, y más abajo
hay un carrusel con fotos nuestras.

## Archivos

| Archivo      | Qué tiene |
|--------------|-----------|
| `index.html` | El contenido y los textos |
| `estilos.css`| Los colores, tipografías y el diseño responsive |
| `script.js`  | El ramo (SVG generado), los pétalos y el carrusel |
| `fotos/`     | Las fotos del carrusel |
| `musica/`    | La canción de fondo (`cancion.mp3`) |

## Cómo cambiar cosas

Todo lo que se toca habitualmente está arriba de todo en `script.js`, en el bloque
`AJUSTES`:

```js
const AJUSTES = {
  fechaInicio: "2026-04-21",   // el día en que empezaron (año-mes-día)
  cantidadFlores: 21,          // cuántas flores tiene el ramo
  segundosPorFoto: 3.5,        // cada cuánto pasa sola a la foto siguiente
  volumen: 0.55,               // volumen de la canción (0 a 1)
  fotos: [
    "fotos/foto-1.jpg",
    "fotos/foto-2.jpg",
    ...
  ]
};
```

- **Fecha:** `fechaInicio` es lo que alimenta el contador de “días juntos” y de
  “meses”. Está puesta en el 21 de abril de 2026 (cinco meses justos antes del
  21 de septiembre); cambiala por la de ustedes si es otra.
- **Sumar fotos:** copiá la imagen dentro de `fotos/` y agregá una línea más al
  listado. El carrusel, los puntitos y las flechas se arman solos. Conviene que
  las fotos sean verticales y de menos de ~300 KB para que cargue rápido en el
  celular. Van sin texto: se ven solas.
- **Velocidad del carrusel:** `segundosPorFoto`. Pasa solo de entrada; si lo
  tocás, frena 6 segundos y después sigue.
- **Textos de la carta:** están en `index.html`, dentro de `<div class="carta">`.
- **La canción:** es `musica/cancion.mp3` y se repite en loop. Para cambiarla,
  reemplazá ese archivo por otro mp3 con el mismo nombre. Empieza recién cuando
  se toca el botón del ramo (los celulares no dejan que un sitio arranque música
  solo) y sube el volumen de a poco. Abajo a la derecha queda un botoncito 🔊
  para pausarla o volver a ponerla.

## Dónde está publicado

**https://federicowag.github.io/Floresamarillas/**

Lo sirve GitHub Pages desde la rama `gh-pages`. No hay que hacer nada a mano:
el workflow `.github/workflows/pages.yml` copia la rama de trabajo a `gh-pages`
en cada push y GitHub republica en un minuto. Para trabajar localmente alcanza
con abrir `index.html` en cualquier navegador.

Como el sitio es público, la canción también queda accesible para cualquiera que
tenga el link.

## Detalles

- Hecho con HTML, CSS y JavaScript a mano: sin dependencias ni build.
- Las flores son SVG generado por código, así que se ven nítidas en cualquier pantalla.
- Respeta *reducir movimiento* del sistema (si está activado, no hay lluvia de pétalos).
- Las fotos van con `loading="lazy"` y comprimidas a 1200 px de ancho.
