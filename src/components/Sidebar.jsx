import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Inicio',      icon: '⊞' },
  { to: '/productos',   label: 'Productos',   icon: '📦' },
  { to: '/categorias',  label: 'Categorías',  icon: '🏷️' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay oscuro en móvil */}
      {open && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        {/* Logo / marca */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>A</span>
          <span className={styles.brandName}>AdminPanel</span>
          {/* Botón cerrar en móvil */}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar menú">✕</button>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>Menú</p>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
