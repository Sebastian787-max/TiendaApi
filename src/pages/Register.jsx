import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'
import styles from './Register.module.css'

const TIPOS_DOC = [
  { value: 'CC',  label: 'Cédula de Ciudadanía' },
  { value: 'TI',  label: 'Tarjeta de Identidad' },
  { value: 'CE',  label: 'Cédula de Extranjería' },
  { value: 'PA',  label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
]

const EMPTY_FORM = {
  tipoDoc:  '',
  nroDoc:   '',
  nombre:   '',
  email:    '',
  password: '',
  confirm:  '',
}

export default function Register() {
  const { token } = useAuth()
  const navigate  = useNavigate()

  const [form,    setForm]    = useState(EMPTY_FORM)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/dashboard" replace />

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function validate() {
    if (!form.tipoDoc)                  return 'Selecciona un tipo de documento.'
    if (!form.nroDoc.trim())            return 'Ingresa el número de documento.'
    if (!form.nombre.trim())            return 'Ingresa tu nombre completo.'
    if (!form.email.trim())             return 'Ingresa tu correo electrónico.'
    if (form.password.length < 6)       return 'La contraseña debe tener al menos 6 caracteres.'
    if (form.password !== form.confirm) return 'Las contraseñas no coinciden.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/api/Auth/Registrar', {
        tipoDoc:  form.tipoDoc,
        nroDoc:   form.nroDoc,
        nombre:   form.nombre,
        email:    form.email,
        password: form.password,
        roles:    [1],
      })
      setSuccess('¡Cuenta creada! Redirigiendo al login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data
      setError(typeof msg === 'string' ? msg : 'No se pudo crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>A</div>
          <span className={styles.brandName}>AdminPanel</span>
        </div>

        <h1 className={styles.heading}>Crear cuenta</h1>
        <p className={styles.sub}>Completa los datos para registrarte</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          <div className={styles.row2}>
            <label className={styles.label}>
              Tipo de documento
              <select
                className={styles.input}
                name="tipoDoc"
                value={form.tipoDoc}
                onChange={handleChange}
              >
                <option value="">Seleccionar…</option>
                {TIPOS_DOC.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Número de documento
              <input
                className={styles.input}
                type="text"
                name="nroDoc"
                placeholder="Ej: 1234567890"
                value={form.nroDoc}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className={styles.label}>
            Nombre completo
            <input
              className={styles.input}
              type="text"
              name="nombre"
              placeholder="Ej: Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
            />
          </label>

          <label className={styles.label}>
            Correo electrónico
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nombre@empresa.com"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <div className={styles.row2}>
            <label className={styles.label}>
              Contraseña
              <input
                className={styles.input}
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Mín. 6 caracteres"
                value={form.password}
                onChange={handleChange}
              />
            </label>

            <label className={styles.label}>
              Confirmar contraseña
              <input
                className={styles.input}
                type="password"
                name="confirm"
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                value={form.confirm}
                onChange={handleChange}
              />
            </label>
          </div>

          {error   && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Registrando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.loginLink}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </div>

      <div className={styles.decoration} aria-hidden="true" />
    </div>
  )
}