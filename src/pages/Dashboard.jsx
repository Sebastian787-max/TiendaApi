import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()

  const cards = [
    { label: 'Productos',   desc: 'Gestiona tu catálogo',       icon: '📦', to: '/productos'  },
    { label: 'Categorías',  desc: 'Organiza por tipo',          icon: '🏷️', to: '/categorias' },
  ]

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>
            Hola, {user?.nombre?.split(' ')[0] ?? 'Usuario'} 👋
          </h1>
          <p className={styles.sub}>Aquí tienes un resumen rápido de tu panel.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map(card => (
          <a key={card.label} href={card.to} className={styles.card}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div>
              <p className={styles.cardLabel}>{card.label}</p>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}