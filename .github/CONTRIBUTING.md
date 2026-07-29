# Guía de Contribución

¡Gracias por querer contribuir a `@deandre-dock/buttons`! Este documento explica cómo hacerlo.

---

## Antes de empezar

- Revisa los [issues abiertos](https://github.com/deandrenn2/dock-buttons/issues) — tu idea puede estar ya en discusión
- Para cambios grandes, abre un issue primero para discutir el enfoque
- Para bugs o mejoras pequeñas, puedes ir directo al PR

---

## Setup del entorno

```bash
# Requisitos: Node >= 18, pnpm >= 9
git clone https://github.com/tu-usuario/dock-buttons
cd dock-buttons
pnpm install
```

Comandos útiles:

```bash
pnpm dev:demo          # demo en http://localhost:5173
pnpm dev:storybook     # storybook en http://localhost:6006
pnpm build:core        # build de la librería
pnpm test              # tests
pnpm lint              # linting
pnpm docs:check        # documentación, enlaces y metadatos
pnpm format            # formateo con Prettier
```

---

## Estructura del proyecto

```
dock-buttons/
├── packages/core/src/
│   ├── shared/        primitivos: tokens CSS, ThemeProvider, utils
│   ├── entities/      componentes puros: Button
│   ├── features/      lógica: drag, position state machine
│   └── widgets/       composiciones: ButtonDock
├── packages/shadcn/   versión para registry de Shadcn/ui
└── apps/
    ├── demo/          app de demostración
    └── storybook/     documentación interactiva
```

La arquitectura sigue **Feature-Sliced Design (FSD)**. Regla clave:

```
shared ← entities ← features ← widgets
```

Un módulo solo puede importar de capas por debajo de él, nunca hacia arriba.

---

## Flujo de trabajo

```
fork → clone → branch → código → story → test → PR
```

### 1. Crea un branch

```bash
git checkout -b feat/nombre-de-la-feature
# o
git checkout -b fix/descripcion-del-bug
```

Prefijos de branch:

- `feat/` — nueva funcionalidad
- `fix/` — corrección de bug
- `docs/` — documentación
- `refactor/` — refactoring sin cambio de comportamiento
- `chore/` — tareas de mantenimiento

### 2. Escribe el código

- Sigue la arquitectura FSD — cada nuevo componente va en la capa correcta
- Un componente nuevo requiere: **implementación + story en Storybook + test**
- Usa los design tokens existentes (`--dock-*`), no valores hardcoded
- Actualiza los README, stories y ejemplos cuando cambie una API o comportamiento público
- El código debe pasar `pnpm lint`, `pnpm docs:check` y `pnpm test` sin errores

### 3. Añade una Storybook story

Cada variante o comportamiento nuevo necesita su story:

```tsx
// apps/storybook/src/entities/MiComponente.stories.tsx
export const MiVariante: Story = {
  args: { variant: 'nueva', children: 'Ejemplo' },
}
```

### 4. Añade un changeset

Usamos [Changesets](https://github.com/changesets/changesets) para versionar:

```bash
pnpm changeset
# Sigue el prompt: selecciona el paquete, tipo de cambio (patch/minor/major) y descripción
```

- `patch` — bug fix o cambio no visible al usuario
- `minor` — nueva feature retrocompatible
- `major` — breaking change

### 5. Abre el PR

El título del PR debe seguir el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(ButtonDock): add keyboard navigation support
fix(Button): correct focus ring in Safari
docs: update ButtonDock API table
```

El PR debe incluir:

- Descripción del cambio y por qué
- Screenshot o video si es un cambio visual
- El changeset generado

---

## Convenciones de código

### TypeScript

- Tipos explícitos en props de componentes públicos
- Usar `type` para tipos, `interface` solo cuando necesitas `extends`
- No usar `any` — usar `unknown` si el tipo es realmente desconocido

### CSS / Estilos

- Usar exclusivamente los tokens `--dock-*` definidos en `shared/tokens/`
- CSS Modules para estilos de componentes (`.module.css`)
- La versión Shadcn usa clases Tailwind + tokens de Shadcn (`--background`, etc.)

### Commits

Seguimos Conventional Commits:

```
tipo(scope): descripción corta

[cuerpo opcional]

[footer opcional]
```

Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Reportar un bug

Usa el [template de bug report](https://github.com/deandrenn2/dock-buttons/issues/new?template=bug_report.md) e incluye:

1. Versión de `@deandre-dock/buttons`
2. Versión de React
3. Descripción del comportamiento esperado vs el actual
4. Pasos para reproducir
5. Código mínimo reproducible (CodeSandbox o StackBlitz)

---

## Proponer una nueva feature

Usa el [template de feature request](https://github.com/deandrenn2/dock-buttons/issues/new?template=feature_request.md) e incluye:

1. El problema que resuelve
2. Tu propuesta de solución
3. Alternativas consideradas
4. ¿Estarías dispuesto a implementarla?

---

## Código de conducta

Este proyecto sigue el [Contributor Covenant](./CODE_OF_CONDUCT.md).
TL;DR: sé amable, respetuoso y constructivo.

---

## Preguntas

Abre un [Discussion](https://github.com/deandrenn2/dock-buttons/discussions) en GitHub — no uses los issues para preguntas generales.
