import { useState, useEffect, useCallback } from 'react'
import api from '../api/axiosInstance'
import Modal from '../components/Modal'
import styles from './Productos.module.css'

const EMPTY_FORM = {
  idCategoria: '',
  nombre:      '',
  precio:      '',
  stock:       '',
  estado:      true,
}

export default function Productos() {
  const [productos,  setProductos]  = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  // Búsqueda
  const [busqueda,   setBusqueda]   = useState('')

  // Modal crear/editar
  const [showModal,  setShowModal]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [formError,  setFormError]  = useState('')

  // Confirmación borrado
  const [deleteId,   setDeleteId]   = useState(null)
  const [deleting,   setDeleting]   = useState(false)

  // ── Fetch productos ────────────────────────────────────────────────────────
  const fetchProductos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/Producto/Lista')
      // El backend devuelve { msj: "ok", response: [...] }
      setProductos(data.response ?? [])
    } catch {
      setError('No se pudieron cargar los productos.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Fetch categorías ───────────────────────────────────────────────────────
  useEffect(() => {
    fetchProductos()
    api.get('/api/Categoria/Lista')
      .then(({ data }) => setCategorias(data.response ?? []))
      .catch(() => {})
  }, [fetchProductos])

  // ── Filtro de búsqueda (cliente) ───────────────────────────────────────────
  const productosFiltrados = productos.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoriaNombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  // ── Modal helpers ──────────────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({
      idCategoria: p.idCategoria ?? '',
      nombre:      p.nombre      ?? '',
      precio:      p.precio      ?? '',
      stock:       p.stock       ?? '',
      estado:      p.estado      ?? true,
    })
    setFormError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditTarget(null)
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ── Guardar (crear o editar) ───────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    if (!form.nombre.trim()) { setFormError('El nombre es obligatorio.'); return }
    if (!form.idCategoria)   { setFormError('Selecciona una categoría.'); return }
    if (!form.precio)        { setFormError('El precio es obligatorio.'); return }

    setSaving(true)
    setFormError('')

    // Payload exacto que espera ProductoCreateDto
    const payload = {
      idCategoria: parseInt(form.idCategoria, 10),
      nombre:      form.nombre.trim(),
      precio:      parseFloat(form.precio),
      stock:       parseInt(form.stock, 10) || 0,
      estado:      form.estado,
    }

    try {
      if (editTarget) {
        await api.put(`/api/Producto/Editar/${editTarget.idProducto}`, payload)
      } else {
        await api.post('/api/Producto/Guardar', payload)
      }
      closeModal()
      fetchProductos()
    } catch (err) {
      setFormError(err.response?.data?.msj ?? 'Error al guardar. Revisa los datos.')
    } finally {
      setSaving(false)
    }
  }

  // ── Eliminar ───────────────────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/api/Producto/Eliminar/${deleteId}`)
      setDeleteId(null)
      fetchProductos()
    } catch {
      alert('No se pudo eliminar el producto.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Encabezado */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Productos</h1>
          <p className={styles.sub}>
            {productosFiltrados.length} de {productos.length} producto{productos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className={styles.btnPrimary} onClick={openCreate}>
          + Agregar producto
        </button>
      </div>

      {/* Buscador */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por nombre o categoría…"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button className={styles.clearBtn} onClick={() => setBusqueda('')}>✕</button>
        )}
      </div>

      {/* Estados */}
      {loading && <p className={styles.stateMsg}>Cargando productos…</p>}
      {error   && <p className={styles.errorMsg}>{error}</p>}

      {/* Tabla */}
      {!loading && !error && (
        <div className={styles.tableWrap}>
          {productosFiltrados.length === 0 ? (
            <div className={styles.empty}>
              <p>{busqueda ? `Sin resultados para "${busqueda}"` : 'No hay productos todavía.'}</p>
              {!busqueda && (
                <button className={styles.btnPrimary} onClick={openCreate}>
                  Crear el primero
                </button>
              )}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map(p => (
                  <tr key={p.idProducto}>
                    <td className={styles.tdMuted}>#{p.idProducto}</td>
                    <td className={styles.tdBold}>{p.nombre}</td>
                    <td className={styles.tdMuted}>{p.categoriaNombre ?? '—'}</td>
                    <td>${Number(p.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`${styles.badge} ${p.stock > 0 ? styles.badgeOk : styles.badgeLow}`}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${p.estado ? styles.badgeOk : styles.badgeLow}`}>
                        {p.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnEdit}   onClick={() => openEdit(p)}>Editar</button>
                        <button className={styles.btnDelete} onClick={() => setDeleteId(p.idProducto)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Modal crear / editar ── */}
      {showModal && (
        <Modal
          title={editTarget ? `Editar — ${editTarget.nombre}` : 'Nuevo producto'}
          onClose={closeModal}
        >
          <form className={styles.form} onSubmit={handleSave} noValidate>

            <label className={styles.label}>
              Nombre *
              <input
                className={styles.input}
                name="nombre"
                value={form.nombre}
                onChange={handleFormChange}
                placeholder="Ej: Camiseta básica"
              />
            </label>

            <label className={styles.label}>
              Categoría *
              <select
                className={styles.input}
                name="idCategoria"
                value={form.idCategoria}
                onChange={handleFormChange}
              >
                <option value="">Seleccionar categoría…</option>
                {categorias.map(c => (
                  <option key={c.idCategoria} value={c.idCategoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.row2}>
              <label className={styles.label}>
                Precio *
                <input
                  className={styles.input}
                  type="number"
                  name="precio"
                  min="0"
                  step="0.01"
                  value={form.precio}
                  onChange={handleFormChange}
                  placeholder="0.00"
                />
              </label>

              <label className={styles.label}>
                Stock
                <input
                  className={styles.input}
                  type="number"
                  name="stock"
                  min="0"
                  value={form.stock}
                  onChange={handleFormChange}
                  placeholder="0"
                />
              </label>
            </div>

            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleFormChange}
                className={styles.checkbox}
              />
              Producto activo
            </label>

            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnSecondary} onClick={closeModal}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Guardando…' : editTarget ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Confirmar eliminación ── */}
      {deleteId && (
        <Modal title="Confirmar eliminación" onClose={() => setDeleteId(null)}>
          <p className={styles.confirmText}>
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
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
