# Portafolio de Leo

La página utiliza React y conserva sus estilos, videos, contenido y controles.

## Desarrollo

```sh
npm ci
npm run dev
```

Abre `http://127.0.0.1:5174`. Los cambios en `src/` se compilan automáticamente; recarga el navegador para verlos.

## Publicación

```sh
npm run build
```

Antes de publicar cambios en React, ejecuta esta compilación e incluye `assets/js/app.js` y su archivo de licencias en el commit. GitHub Pages puede seguir publicando los archivos estáticos desde la misma rama, sin cambiar su configuración. Los enlaces a los recursos son relativos y funcionan también bajo `/portfolio/`.

## Archivos

- `src/components/App.jsx`: estructura y contenido de la página, renderizados por React.
- `src/hooks/usePortfolio.js`: estado del menú, atajos, paneles, video y controles de audio.
- `src/main.jsx`: inicio de React.
- `assets/css/styles.css`: estilos existentes de escritorio y móvil.
- `assets/audio/` y `assets/video/`: música y fondos animados.
- `scripts/build.mjs`: compilación y servidor local.
- `assets/js/`: aplicación compilada y licencias; se genera con `npm run build`.

La lógica editable está en `src/`; no edites directamente la aplicación compilada.
