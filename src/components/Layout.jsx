import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  // Iniciales del usuario para el avatar
  const initials = user?.nombre
    ? user.nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  // El backend devuelve roles como array; mostramos el primero
  const roleLabel = Array.isArray(user?.roles) && user.roles.length > 0
    ? user.roles[0]
    : 'Usuario'

  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.main}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <div />   {/* espacio izquierdo para futura búsqueda */}
          <div className={styles.userArea}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.nombre ?? 'Usuario'}</span>
              <span className={styles.userRole}>{roleLabel}</span>
            </div>
            <div className={styles.avatar}>{initials}</div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
              ⏻
            </button>
          </div>
        </header>

        {/* ── Contenido de la página activa ── */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}