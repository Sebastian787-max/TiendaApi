import { useState, useEffect, useCallback } from 'react'
import api from '../api/axiosInstance'
import Modal from '../components/Modal'
import styles from './Categorias.module.css'

const EMPTY_FORM = { nombre: '', estado: true }

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  // Modal crear/editar
  const [showModal,  setShowModal]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [formError,  setFormError]  = useState('')

  // Confirmar borrado
  const [deleteId,   setDeleteId]   = useState(null)
  const [deleting,   setDeleting]   = useState(false)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchCategorias = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/Categoria/Lista')
      setCategorias(data.response ?? [])
    } catch {
      setError('No se pudieron cargar las categorías.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategorias() }, [fetchCategorias])

  // ── Modal helpers ──────────────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(c) {
    setEditTarget(c)
    setForm({ nombre: c.nombre ?? '', estado: c.estado ?? true })
    setFormError('')
    setShowModal(true)
  }

  function closeModal() { setShowModal(false); setEditTarget(null) }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // ── Guardar ────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    if (!form.nombre.trim()) { setFormError('El nombre es obligatorio.'); return }

    setSaving(true)
    setFormError('')

    // El backend recibe Categoria directo: { nombre, estado }
    const payload = { nombre: form.nombre.trim(), estado: form.estado }

    try {
      if (editTarget) {
        await api.put(`/api/Categoria/Editar/${editTarget.idCategoria}`, payload)
      } else {
        await api.post('/api/Categoria/Guardar', payload)
      }
      closeModal()
      fetchCategorias()
    } catch (err) {
      setFormError(err.response?.data?.msj ?? 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  // ── Eliminar ───────────────────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/api/Categoria/Eliminar/${deleteId}`)
      setDeleteId(null)
      fetchCategorias()
    } catch {
      alert('No se pudo eliminar. Puede tener productos asociados.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Categorías</h1>
          <p className={styles.sub}>
            {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} registrada{categorias.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          + Nueva categoría
        </button>
      </div>

      {loading && <p className={styles.stateMsg}>Cargando categorías…</p>}
      {error   && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          {categorias.length === 0 ? (
            <div className={styles.empty}>
              <p>No hay categorías todavía.</p>
              <button className={styles.btnPrimary} onClick={openCreate}>Crear la primera</button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.idCategoria}>
                    <td className={styles.tdMuted}>#{c.idCategoria}</td>
                    <td className={styles.tdBold}>{c.nombre}</td>
                    <td>
                      <span className={`${styles.badge} ${c.estado ? styles.badgeOk : styles.badgeLow}`}>
                        {c.estado ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnEdit}   onClick={() => openEdit(c)}>Editar</button>
                        <button className={styles.btnDelete} onClick={() => setDeleteId(c.idCategoria)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal crear / editar */}
      {showModal && (
        <Modal
          title={editTarget ? `Editar — ${editTarget.nombre}` : 'Nueva categoría'}
          onClose={closeModal}
        >
          <form className={styles.form} onSubmit={handleSave} noValidate>
            <label className={styles.label}>
              Nombre *
              <input
                className={styles.input}
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Electrónica"
                autoFocus
              />
            </label>

            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
                className={styles.checkbox}
              />
              Categoría activa
            </label>

            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Crear categoría'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmar eliminación */}
      {deleteId && (
        <Modal title="Confirmar eliminación" onClose={() => setDeleteId(null)}>
          <p className={styles.confirmText}>
            ¿Eliminar esta categoría? Si tiene productos asociados, la operación fallará.
          </p>
          <div className={styles.modalFooter}>
            <button className={styles.btnSecondary} onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancelar
            </button>
            <button className={styles.btnDanger} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando…' : 'Sí, eliminar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
