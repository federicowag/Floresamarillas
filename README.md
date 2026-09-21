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

## Cómo cambiar cosas

Todo lo que se toca habitualmente está arriba de todo en `script.js`, en el bloque
`AJUSTES`:

```js
const AJUSTES = {
  fechaInicio: "2026-04-21",   // el día en que empezaron (año-mes-día)
  cantidadFlores: 21,          // cuántas flores tiene el ramo
  segundosPorFoto: 3.5,        // cada cuánto pasa sola a la foto siguiente
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

## Cómo verlo

Abriendo `index.html` en cualquier navegador ya funciona.

Para tener un link para mandarle, la forma más simple es **GitHub Pages**:
Settings → Pages → *Deploy from a branch* → elegí la rama y la carpeta `/ (root)`.
En un par de minutos queda en
`https://federicowag.github.io/floresamarillas/`.

## Detalles

- Hecho con HTML, CSS y JavaScript a mano: sin dependencias ni build.
- Las flores son SVG generado por código, así que se ven nítidas en cualquier pantalla.
- Respeta *reducir movimiento* del sistema (si está activado, no hay lluvia de pétalos).
- Las fotos van con `loading="lazy"` y comprimidas a 1200 px de ancho.
