# Publicar en GitHub Pages

Esta carpeta ya es un repositorio conectado a GitHub (`CodeByJavier/Portafolio`),
así que no hace falta crear nada nuevo: se sube como cualquier cambio.

La dirección será:

```
https://codebyjavier.github.io/Portafolio/
```

Ojo con la **P mayúscula**: GitHub Pages distingue mayúsculas y minúsculas.
`/portafolio/` daría error 404.

## 1. Quitar lo que ya no se usa

De la versión anterior quedan tres imágenes que la web nueva no usa:
`img/github.jpeg`, `img/pokedex.jpeg` e `img/renova-hogar-preview.jpg`.
Puedes borrarlas desde git (siguen guardadas en el historial):

```bash
git rm -r img
```

## 2. Subir la web nueva

Abre una terminal en esta carpeta y ejecuta:

```bash
git add .
git status
git commit -m "Nueva web de negocio: la calle de los escaparates"
git push
```

Con `git status`, revisa antes del commit que la lista es la esperada:
`index.html`, `css/`, `js/`, `assets/`, `README.md`, `PUBLICAR.md` y las
imágenes borradas.

## 3. Comprobar que Pages está activado

En GitHub, entra en el repositorio y ve a **Settings → Pages**:

1. **Source:** Deploy from a branch.
2. **Branch:** `main`, carpeta `/ (root)`. Pulsa Save.
3. Espera uno o dos minutos. El progreso se ve en la pestaña **Actions**.

## 4. Antes de mandar el enlace a nadie

- Abre cada escaparate y comprueba que lleva a su web. Las maquetas apuntan a
  `codebyjavier.github.io/<repositorio>/`: si alguna de esas webs no está
  publicada, el escaparate dará error.
- Pega el enlace en un chat de WhatsApp contigo mismo. Comprueba que sale la
  imagen de vista previa; la primera vez puede tardar unos minutos.

## Cuando tengas dominio propio

1. Cambia `og:image` en `index.html` por la dirección nueva.
2. En **Settings → Pages → Custom domain**, escribe el dominio. La empresa
   del dominio te dirá qué registros DNS añadir para que apunte a GitHub.
