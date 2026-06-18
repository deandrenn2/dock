## ADDED Requirements

### Requirement: Test consumer app installs from npm
A standalone app at `apps/test-consumer/` SHALL install `@deandre-dock/buttons` from the npm registry (not the workspace source), providing an end-to-end verification environment for the published package.

#### Scenario: App starts without workspace alias
- **WHEN** a developer runs `pnpm dev` inside `apps/test-consumer/`
- **THEN** the app starts on `localhost:5174` using `@deandre-dock/buttons` resolved from `node_modules`, not from `packages/core/src`

#### Scenario: Core package renders with styles
- **WHEN** the test consumer app loads in the browser
- **THEN** `ButtonDock` and `Button` components render with correct colors, spacing, and typography — without any manual CSS import in the app code

#### Scenario: shadcn variant renders with styles
- **WHEN** the shadcn CLI has been run inside `apps/test-consumer/` to install the registry components
- **THEN** `ButtonDock` from the shadcn variant renders using Shadcn CSS variables and Tailwind classes

### Requirement: Test consumer documents setup steps
The `apps/test-consumer/` directory SHALL include a README that explains how to install dependencies and run the shadcn CLI.

#### Scenario: Developer can set up test consumer from scratch
- **WHEN** a developer reads `apps/test-consumer/README.md`
- **THEN** they can follow the steps to install npm packages, run the shadcn CLI, and start the dev server without external documentation
