## Why

`@deandre-dock/buttons` publica `dist/style.css` como archivo separado pero ningún bundler lo carga automáticamente cuando el consumidor importa el paquete. Los componentes dependen 100% de CSS custom properties (`--dock-color-*`, `--dock-space-*`, etc.) definidas en ese archivo; sin él, los botones aparecen sin estilos. El consumidor no tiene ninguna señal de que debe importar el archivo — la librería se ve rota sin documentación extra.

## What Changes

- Agregar `vite-plugin-css-injected-by-js` al build de `packages/core`
- El CSS (tokens + estilos de componentes) se inyecta automáticamente en el DOM cuando el módulo JS se importa
- `dist/style.css` deja de generarse — el CSS vive dentro del bundle JS
- Limpiar `sideEffects` en `package.json` (ya no aplica a ningún archivo CSS publicado)
- Bump patch de `@deandre-dock/buttons` para distribuir el fix

## Capabilities

### New Capabilities

- `css-auto-load`: Los estilos de `@deandre-dock/buttons` cargan automáticamente al importar el paquete, sin pasos manuales del consumidor

### Modified Capabilities

_(ninguna — no hay cambios de comportamiento externo, solo mejora de integración)_

## Impact

- `packages/core/package.json` — nueva devDependency, limpieza de `sideEffects`
- `packages/core/vite.config.ts` — nuevo plugin
- `dist/` — `style.css` desaparece; `index.js` e `index.cjs` crecen levemente (~6 kB gzip: 1.37 kB)
- Requiere publicar `@deandre-dock/buttons@1.0.1`
