# dock-buttons monorepo

Monorepo para el ecosistema `@deandre-dock/buttons` — un ButtonGroup flotante e inteligente para React.

## Paquetes

| Paquete                                            | Versión                                                                                                                         | Descripción                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`@deandre-dock/buttons`](packages/core/)          | [![npm](https://img.shields.io/npm/v/@deandre-dock/buttons)](https://www.npmjs.com/package/@deandre-dock/buttons)               | Librería principal (React + tokens propios) |
| [`@deandre-dock/buttons-shadcn`](packages/shadcn/) | [![npm](https://img.shields.io/npm/v/@deandre-dock/buttons-shadcn)](https://www.npmjs.com/package/@deandre-dock/buttons-shadcn) | Registry para Shadcn/ui                     |

## Apps

| App                                 | Descripción                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`apps/demo`](apps/demo/)           | Demo pública en [deandrenn2.github.io/dock-buttons](https://deandrenn2.github.io/dock-buttons/) |
| [`apps/storybook`](apps/storybook/) | Documentación interactiva de componentes                                                        |

---

## Desarrollo local

```bash
# Clonar y preparar
git clone https://github.com/deandrenn2/dock-buttons
cd dock-buttons
pnpm install

# Iniciar la demo
pnpm dev:demo

# Iniciar Storybook
pnpm dev:storybook

# Build de la librería
pnpm build:core

# Tests
pnpm test

# Lint
pnpm lint
```

## Estructura

```
packages/
  core/        @deandre-dock/buttons          — librería principal
  shadcn/      @deandre-dock/buttons-shadcn   — registry para Shadcn/ui
apps/
  demo/        Vite + React + Tailwind (gradebook UI)
  storybook/   Storybook 8
.github/
  workflows/   CI/CD (build, test, deploy, release)
```

## Publicación

Este monorepo usa [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset        # crear entrada de changeset (patch/minor/major)
pnpm build:core       # build antes de publicar
```

CI crea una "Version Packages" PR automáticamente. Merge → publica a npm.

La publicación usa npm Trusted Publishing mediante `.github/workflows/release.yml`.
Los dos paquetes deben autorizar exactamente el repositorio `deandrenn2/dock-buttons`
y el workflow `release.yml` en su configuración de Trusted Publisher. Si el repositorio
cambia de nombre, actualiza también esos campos en npm, los `package.json`, los README y
la ruta base de GitHub Pages.

## Contribuir

Lee [CONTRIBUTING.md](.github/CONTRIBUTING.md) antes de abrir un PR.

## Licencia

MIT © dock-buttons contributors
