import { Button, ButtonDock } from '@deandre-dock/buttons'
import styles from './Home.module.css'

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

const GenerateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Botones que se adaptan
          <br />
          <span className={styles.accent}>a tu flujo de trabajo</span>
        </h1>
        <p className={styles.subtitle}>
          <code>@deandre-dock/buttons</code> — Un sistema de diseño con un ButtonDock flotante que
          el usuario puede mover, fijar y anclar libremente en pantalla.
        </p>
      </section>

      <section className={styles.demo}>
        <h2 className={styles.sectionTitle}>ButtonDock — pruébalo aquí</h2>
        <p className={styles.hint}>
          Arrastra el handle <strong>⠿</strong> para mover la barra · Usa el botón 🏠 o suéltala en
          su lugar para volver
        </p>

        <div className={styles.dockZone}>
          <ButtonDock layout="block" align="center" showMode>
            <Button variant="primary" leftIcon={<GenerateIcon />}>
              Generar
            </Button>
            <Button variant="secondary" leftIcon={<SaveIcon />}>
              Guardar
            </Button>
            <Button variant="danger" iconOnly leftIcon={<TrashIcon />} aria-label="Eliminar" />
          </ButtonDock>
        </div>
      </section>

      <section className={styles.variants}>
        <h2 className={styles.sectionTitle}>Variantes de Button</h2>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary" size="xs">
            XS
          </Button>
          <Button variant="primary" size="sm">
            SM
          </Button>
          <Button variant="primary" size="md">
            MD
          </Button>
          <Button variant="primary" size="lg">
            LG
          </Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary" loading>
            Cargando
          </Button>
          <Button variant="secondary" disabled>
            Deshabilitado
          </Button>
          <Button variant="primary" leftIcon={<SaveIcon />}>
            Con ícono
          </Button>
          <Button variant="ghost" iconOnly leftIcon={<TrashIcon />} aria-label="Eliminar" />
        </div>
      </section>
    </div>
  )
}
