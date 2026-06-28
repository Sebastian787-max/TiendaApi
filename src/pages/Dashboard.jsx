import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

const cards = [
  { to: '/productos',   label: 'Productos',   desc: 'Gestiona tu catálogo',  icon: '📦' },
  { to: '/categorias',  label: 'Categorías',  desc: 'Organiza por tipo',     icon: '🏷️' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>
          Hola, {user?.nombre?.split(' ')[0] ?? 'Usuario'} 👋
        </h1>
        <p className={styles.sub}>Aquí tienes un resumen rápido de tu panel.</p>
      </div>

      <div className={styles.grid}>
        {cards.map(card => (
          <div
            key={card.label}
            className={styles.card}
            onClick={() => navigate(card.to)}
          >
            <div className={styles.cardIcon}>{card.icon}</div>
            <div>
              <p className={styles.cardLabel}>{card.label}</p>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
