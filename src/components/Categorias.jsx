import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import styles from './Categorias.module.css'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  useEffect(() => {
    api.get('/api/Categoria')
      .then(({ data }) => setCategorias(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setError('No se pudieron cargar las categorías.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Categorías</h1>
          <p className={styles.sub}>
            {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} disponible{categorias.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading && <p className={styles.stateMsg}>Cargando categorías…</p>}
      {error   && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          {categorias.length === 0 ? (
            <div className={styles.empty}>No hay categorías registradas.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c, i) => (
                  <tr key={c.id}>
                    <td className={styles.tdMuted}>{i + 1}</td>
                    <td className={styles.tdBold}>{c.nombre}</td>
                    <td className={styles.tdMuted}>{c.descripcion ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
