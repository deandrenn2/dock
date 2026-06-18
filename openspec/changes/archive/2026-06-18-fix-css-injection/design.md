## Context

Vite library builds extraen todo el CSS a un archivo `dist/style.css` separado. El bundle JS resultante no contiene ninguna referencia a ese archivo. Cuando un consumidor instala el paquete e importa sus exports, el bundler de su proyecto (Vite, webpack, etc.) carga `dist/index.js` pero nunca descubre `dist/style.css` — no hay nada que lo indique.

Los componentes de `@deandre-dock/buttons` usan exclusivamente CSS custom properties (`var(--dock-*)`) para colores, spacing, radii y tipografía. Sin esas variables en el DOM, los componentes se renderizan con los valores fallback del navegador (negro, sans-serif, 0px, etc.).

## Goals / Non-Goals

**Goals:**
- Los estilos funcionan con una importación mínima: `import { Button } from '@deandre-dock/buttons'`
- El build sigue siendo un proceso único (`vite build`)
- Sin cambios a la API pública del paquete

**Non-Goals:**
- Soporte optimizado para SSR (la inyección runtime no es SSR-safe; queda como deuda futura)
- Eliminar los CSS Modules — siguen siendo la forma de escribir estilos de componentes
- Cambiar el sistema de tokens (siguen siendo CSS custom properties)

## Decisions

### D1: `vite-plugin-css-injected-by-js` como mecanismo de inyección

El plugin intercepta el CSS extraído por Vite y genera código JS que crea un `<style>` tag e inserta el CSS en el DOM cuando el módulo se carga por primera vez. Es idempotente (no inserta dos veces) y tiene ~400 estrellas de uso como devDependency en librerías React.

```ts
// vite.config.ts
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

plugins: [react(), dts({ include: ['src'], rollupTypes: true }), cssInjectedByJs()]
```

**Alternativas descartadas:**
- Documentar import manual: mala DX, rompe el contrato de "instala y funciona"
- Exportar `./style.css` en package.json: sigue requiriendo import manual
- Refactorizar a CSS-in-JS: cambio masivo, pierde la separación de concerns actual

### D2: Eliminar `sideEffects: ["**/*.css"]` de package.json

Con el CSS inyectado en el JS, `dist/` no contiene archivos `.css`. El campo `sideEffects` puede volver a `false` — no hay CSS que tree-shaker deba preservar. Esto mejora marginalmente el tree-shaking para consumidores que solo importan parte del paquete.

### D3: `dist/style.css` deja de publicarse

El paquete npm `1.0.0` tiene `dist/style.css`. Desde `1.0.1`, ese archivo no existirá. Si algún consumidor lo importaba directamente (`import '@deandre-dock/buttons/dist/style.css'`), se romperá. Es un breaking change menor pero dado que `1.0.0` no funcionaba sin él, el riesgo es aceptable en un patch.

## Risks / Trade-offs

- **FOUC en SSR**: Si un consumidor usa SSR (Next.js, Remix), el `<style>` se inyecta en el cliente pero no en el servidor. El HTML inicial puede renderizarse sin estilos hasta que JS hidrata. Mitigación: documentar que para SSR se recomienda importar el CSS manualmente o usar la variante shadcn.
- **Bundle size**: El CSS (~6.24 kB, gzip 1.37 kB) pasa del archivo separado al bundle JS. Para la mayoría de los consumers esto es irrelevante.

## Migration Plan

1. Instalar `vite-plugin-css-injected-by-js` en `packages/core`
2. Actualizar `vite.config.ts`
3. Cambiar `sideEffects` a `false` en `package.json`
4. Build + verificar que `dist/style.css` no existe y que `index.js` contiene el CSS inyectado
5. Changeset patch + publicar `@deandre-dock/buttons@1.0.1`
