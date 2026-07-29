import { useState } from 'react'
import { Button, ButtonDock } from '@deandre-dock/buttons'
import { STUDENTS, SUBJECTS } from '../../entities/student/model/mockData'
import type { Student } from '../../entities/student/model/types'
import styles from './Gradebook.module.css'

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
  </svg>
)
const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)
const PrintIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)

function gradeColor(grade: number | null): string {
  if (grade === null) return '#94a3b8'
  if (grade >= 9) return '#15803d'
  if (grade >= 7) return '#0f172a'
  if (grade >= 5) return '#b45309'
  return '#dc2626'
}

function average(student: Student): string {
  const vals = Object.values(student.grades).filter((v): v is number => v !== null)
  if (!vals.length) return '—'
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
}

export function GradebookPage() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }, 1000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.title}>Planilla de Calificaciones</h1>
          <p className={styles.subtitle}>Grado 8° — Período 2 · {STUDENTS.length} estudiantes · {SUBJECTS.length} materias</p>
        </div>

        <ButtonDock sessionStorageKey="demo-gradebook-button-dock" showMode>
          <Button variant="ghost" leftIcon={<FilterIcon />} size="sm">Filtrar</Button>
          <Button variant="secondary" leftIcon={<ExportIcon />} size="sm">Exportar</Button>
          <Button variant="ghost" leftIcon={<PrintIcon />} size="sm">Imprimir</Button>
          <Button
            variant="primary"
            leftIcon={<SaveIcon />}
            size="sm"
            loading={saving}
            onClick={handleSave}
          >
            {saved ? '¡Guardado!' : 'Guardar'}
          </Button>
        </ButtonDock>
      </div>

      <div className={styles.hint}>
        ☝ Arrastra el handle de la barra de acciones para moverla. Recarga esta página para
        comprobar que conserva su estado y posición durante la sesión. Usa el botón 🏠 o suéltala en
        su lugar reservado para volver.
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stickyCol}>#</th>
              <th className={styles.stickyCol2}>Estudiante</th>
              {SUBJECTS.map((s) => (
                <th key={s.id} title={s.name}>{s.shortName}</th>
              ))}
              <th className={styles.avgCol}>Prom.</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((student, i) => (
              <tr key={student.id} className={i % 2 === 0 ? styles.even : ''}>
                <td className={styles.stickyCol} style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  {i + 1}
                </td>
                <td className={styles.stickyCol2}>{student.name}</td>
                {SUBJECTS.map((s) => {
                  const g = student.grades[s.id] ?? null
                  return (
                    <td key={s.id} style={{ color: gradeColor(g), fontWeight: g !== null && g < 5 ? 600 : 400 }}>
                      {g ?? '—'}
                    </td>
                  )
                })}
                <td className={styles.avgCol}>{average(student)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
