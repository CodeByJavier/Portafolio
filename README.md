# Volta · Web de negocio (nombre provisional)

Web para vender páginas web a negocios. La idea: tus webs son **escaparates
de una calle de noche**. Cada tienda tiene su letrero de neón, una marquesina con luz LED y la
web dentro del cristal. Los clientes reales llevan el cartel «Abierto»; las
demos, «Maqueta». Después de la calle amanece, y el resto de la página es
claro y fácil de leer.

HTML, CSS y JavaScript sin librerías. Las fuentes van dentro de la web: no
se cargan de Google, así que va más rápida y no hay problemas con el RGPD.

## Qué incluye

- **La calle.** Nueve escaparates (2 clientes reales y 7 maquetas). Los
  letreros se encienden con un parpadeo al verlos. Al pasar el ratón, la web
  se desplaza dentro del cristal, como si te asomaras. En el móvil la calle
  se recorre deslizando de lado.
- **El local vacío.** La llamada a la acción tiene forma de local con la
  persiana a medio subir.
- **Cómo funciona.** Cuatro pasos unidos por un cable. Al llegar a esa parte,
  la corriente recorre el cable y enciende las bombillas una tras otra.
- **El precio en un ticket de caja**, con la fecha del día. Es texto de verdad,
  así que se puede copiar y lo lee un lector de pantalla.
- **Programa de recomendación** presentado como un vale recortable.
- **Preguntas frecuentes** con `<details>` nativo.
- Si el sistema tiene activado «reducir movimiento», no hay parpadeos ni
  animaciones. Sin JavaScript, todo se ve encendido.

## Cambiar el nombre de la marca

El nombre provisional es **Volta**. Para cambiarlo:

1. En `index.html`, busca y reemplaza `Volta` y `VOLTA` (cabecera, ticket,
   pie, título y mensajes de WhatsApp).
2. Cambia el dibujo del logotipo si ya no encaja: es el `<svg class="brand__mark">`
   de la cabecera y `assets/img/favicon.svg`.
3. Vuelve a hacer `assets/img/og.jpg`, la imagen que se ve al compartir el
   enlace: es una captura de 1200 × 630 de la portada.

## Datos que cambiarán

| Qué | Dónde |
|---|---|
| Número de WhatsApp | `js/script.js`, constante `WHATSAPP_NUMBER` (con 34 delante, sin espacios). Cambia todos los botones a la vez. |
| Teléfono visible | `index.html`, al final («o al 627 57 99 75»). |
| Precio | `index.html`: el ticket, la línea de la portada y la pregunta del IVA. |
| Dirección final de la web | `index.html`, etiqueta `og:image`. Tiene que ser la dirección completa. |

## Añadir un escaparate nuevo

1. Haz tres capturas de la web:
   - De escritorio, de 1440 px de ancho, de la portada hacia abajo (unas tres
     pantallas). Guárdala en `.webp` a 720 y a 480 px de ancho: `nombre-720.webp`
     y `nombre-480.webp`.
   - De móvil, a 180 px de ancho: `nombre-movil.webp`.
   - Ponlas en `assets/shots/`.
2. En `index.html`, copia un `<li class="shop">` entero y cambia:
   - el nombre, el enlace y el texto del letrero;
   - los colores de `style="--neon: …; --wall: …"` (neón y pared);
   - las rutas de las imágenes y el número de la tienda.
3. Si es un cliente real, añade la clase `shop--real` y cambia el cartel a
   `<span class="shop__tag shop__tag--open">Abierto</span>`.

## Estructura

```
index.html
css/style.css
js/script.js
assets/fonts/   Big Shoulders Display (titulares y neones), Instrument Sans (texto), IBM Plex Mono (ticket y etiquetas)
assets/shots/   capturas de cada web
assets/img/     favicon, silueta de la ciudad y la imagen para compartir
```

## Publicar

Las instrucciones están en [PUBLICAR.md](PUBLICAR.md).
