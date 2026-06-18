## 1. Build setup

- [x] 1.1 Instalar `vite-plugin-css-injected-by-js` como devDependency en `packages/core` — `pnpm add -D vite-plugin-css-injected-by-js`
- [x] 1.2 Agregar el plugin en `packages/core/vite.config.ts` — importar y añadir `cssInjectedByJs()` al array de plugins
- [x] 1.3 Cambiar `sideEffects` en `packages/core/package.json` de `["**/*.css"]` a `false`

## 2. Verificar build

- [x] 2.1 Correr `pnpm build:core` y verificar que `dist/style.css` ya NO se genera
- [x] 2.2 Verificar que `dist/index.js` contiene el CSS inyectado (buscar `__vite_style__` o el texto de los tokens CSS)

## 3. Changeset y publicación

- [ ] 3.1 Correr `pnpm changeset` — patch para `@deandre-dock/buttons` describiendo el fix (CSS auto-inyectado, no requiere import manual)
- [ ] 3.2 Publicar `@deandre-dock/buttons@1.0.1` manualmente con `npm publish` desde `packages/core/`
- [ ] 3.3 Verificar en un proyecto React externo que `import { Button } from '@deandre-dock/buttons'` renderiza con estilos sin ningún import CSS adicional
