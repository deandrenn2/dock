import '../../shadcn.css'
import { Button, ButtonDock as CoreButtonDock } from '@deandre-dock/buttons'
import { ButtonDock as ShadcnButtonDock } from '@deandre-dock/shadcn/components/button-dock'
import styles from './Shadcn.module.css'

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export function ShadcnPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Comparativa de variantes</h1>
        <p className={styles.subtitle}>
          Ambas comparten la misma lógica de drag &amp; dock. La diferencia es el sistema de
          estilos: tokens CSS propios vs. tokens de{' '}
          <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
            Shadcn/ui
          </a>
          .
        </p>
      </section>

      <div className={styles.grid}>
        {/* ── Core ───────────────────────────────────────────── */}
        <section className={styles.card}>
          <header className={styles.cardHeader}>
            <span className={styles.badge}>@deandre-dock/buttons</span>
            <h2 className={styles.cardTitle}>Core</h2>
            <p className={styles.cardDesc}>
              Tokens CSS propios (<code>--dock-*</code>), sin dependencias de UI framework. Ideal
              para proyectos que no usan Tailwind.
            </p>
          </header>

          <div className={styles.dockZone}>
            <CoreButtonDock layout="block" align="center" showMode>
              <Button variant="primary" leftIcon={<ZapIcon />}>
                Generar
              </Button>
              <Button variant="secondary" leftIcon={<SaveIcon />}>
                Guardar
              </Button>
              <Button variant="danger" iconOnly leftIcon={<TrashIcon />} aria-label="Eliminar" />
            </CoreButtonDock>
          </div>

          <dl className={styles.meta}>
            <div>
              <dt>Estilos</dt>
              <dd>CSS Modules + custom props</dd>
            </div>
            <div>
              <dt>Tailwind</dt>
              <dd>No requerido</dd>
            </div>
            <div>
              <dt>Theming</dt>
              <dd>
                <code>ThemeProvider</code> / vars CSS
              </dd>
            </div>
          </dl>
        </section>

        {/* ── Shadcn ─────────────────────────────────────────── */}
        <section className={styles.card}>
          <header className={styles.cardHeader}>
            <span className={[styles.badge, styles.badgeShadcn].join(' ')}>
              @deandre-dock/buttons-shadcn
            </span>
            <h2 className={styles.cardTitle}>Shadcn/ui</h2>
            <p className={styles.cardDesc}>
              Usa los tokens de Shadcn (<code>bg-background</code>, <code>border-border</code>…). Se
              instala vía <code>shadcn add</code> y hereda el tema de tu proyecto.
            </p>
          </header>

          <div className={[styles.dockZone, styles.dockZoneShadcn].join(' ')}>
            <ShadcnButtonDock layout="block" align="center" showMode>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity">
                <ZapIcon /> Generar
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-border bg-background hover:bg-accent transition-colors">
                <SaveIcon /> Guardar
              </button>
              <button
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                aria-label="Eliminar"
              >
                <TrashIcon />
              </button>
            </ShadcnButtonDock>
          </div>

          <dl className={styles.meta}>
            <div>
              <dt>Estilos</dt>
              <dd>Tailwind + tokens Shadcn</dd>
            </div>
            <div>
              <dt>Tailwind</dt>
              <dd>Requerido</dd>
            </div>
            <div>
              <dt>Theming</dt>
              <dd>Variables CSS de Shadcn</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className={styles.install}>
        <h2 className={styles.sectionTitle}>Instalación</h2>
        <div className={styles.codeGrid}>
          <div>
            <p className={styles.codeLabel}>Core (npm)</p>
            <pre className={styles.code}>
              <code>npm i @deandre-dock/buttons</code>
            </pre>
          </div>
          <div>
            <p className={styles.codeLabel}>Shadcn registry</p>
            <pre className={styles.code}>
              <code>npx shadcn add https://dock-ui.dev/r/button-dock</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
