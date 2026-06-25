import styles from './Modal.module.css'

/**
 * Modal reutilizable.
 * Props:
 *   title    — string: título del encabezado
 *   onClose  — fn: cierra el modal
 *   children — contenido del cuerpo
 */
export default function Modal({ title, onClose, children }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}   // evita cierre al hacer clic dentro
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}