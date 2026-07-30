import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const storybookUrl =
  import.meta.env['VITE_STORYBOOK_URL'] ??
  (import.meta.env.DEV ? 'http://localhost:6006/' : `${import.meta.env.BASE_URL}storybook/`)

const BookIcon = () => (
  <svg
    aria-hidden="true"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
)

const GitHubIcon = () => (
  <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.96 10.96 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
  </svg>
)

export function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>⬡</span>
        <span className={styles.name}>@deandre-dock/buttons</span>
      </div>
      <div className={styles.navigation}>
        <nav className={styles.nav} aria-label="Navegación de la demo">
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : '')}>
            Inicio
          </NavLink>
          <NavLink to="/gradebook" className={({ isActive }) => (isActive ? styles.active : '')}>
            Planilla
          </NavLink>
          <NavLink to="/shadcn" className={({ isActive }) => (isActive ? styles.active : '')}>
            Shadcn
          </NavLink>
        </nav>
        <span className={styles.divider} aria-hidden="true" />
        <a
          className={styles.storybookLink}
          href={storybookUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir Storybook en una pestaña nueva"
        >
          <BookIcon />
          <span>Storybook</span>
        </a>
        <a
          className={styles.iconLink}
          href="https://github.com/deandrenn2/dock-buttons"
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir el repositorio en GitHub"
          title="GitHub"
        >
          <GitHubIcon />
        </a>
      </div>
    </header>
  )
}
