## 1. Fix sideEffects en packages/core

- [x] 1.1 Cambiar `"sideEffects": false` por `"sideEffects": ["./dist/index.js", "./dist/index.cjs"]` en `packages/core/package.json`
- [x] 1.2 Crear changeset: `pnpm changeset` — patch para `@deandre-dock/buttons` describiendo el fix (CSS injection ya no es tree-shaken por bundlers consumidores)
- [ ] 1.3 Publicar `@deandre-dock/buttons@1.0.3` vía CI (push → merge Version Packages PR)

## 2. Crear apps/test-consumer

- [x] 2.1 Crear `apps/test-consumer/` con `package.json` — dependencias: `@deandre-dock/buttons` desde npm (no `workspace:*`), `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
- [x] 2.2 Crear `apps/test-consumer/vite.config.ts` — sin alias para `@deandre-dock/buttons`, puerto 5174
- [x] 2.3 Crear `apps/test-consumer/index.html` y `src/main.tsx` con `ThemeProvider` envolviendo la app
- [x] 2.4 Crear `apps/test-consumer/src/App.tsx` — sección "Core" con `ButtonDock` + `Button` (primary, secondary, danger, loading), sin ningún import CSS adicional
- [ ] 2.5 Verificar que `pnpm install` y `pnpm dev` arrancan el app en `localhost:5174` con estilos cargando correctamente
- [ ] 2.6 Confirmar en DevTools que `--dock-color-primary-500` y `--dock-space-4` están definidas en `:root`

## 3. Shadcn variant en test-consumer

- [x] 3.1 Configurar Tailwind CSS en `apps/test-consumer/` (requerido por shadcn/ui)
- [ ] 3.2 Correr `npx shadcn@latest init` dentro de `apps/test-consumer/` para configurar shadcn
- [ ] 3.3 Correr `npx shadcn@latest add https://cdn.jsdelivr.net/npm/@deandre-dock/buttons-shadcn@latest/dist/registry.json` — instala `button-dock.tsx`, `use-dock-state.ts`, `use-drag.ts`
- [ ] 3.4 Agregar sección "Shadcn Variant" en `App.tsx` usando el `ButtonDock` instalado por el CLI
- [ ] 3.5 Verificar que la variante shadcn renderiza con los CSS tokens de shadcn (`--background`, `--border`, etc.)

## 4. Documentar test-consumer

- [x] 4.1 Crear `apps/test-consumer/README.md` con pasos: `npm install`, correr shadcn CLI, `pnpm dev`
- [x] 4.2 Agregar `apps/test-consumer/` al `.gitignore` root con excepción de `node_modules` — o agregar al monorepo con flag para excluir del build CI
