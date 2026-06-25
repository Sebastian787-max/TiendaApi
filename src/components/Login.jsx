import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'
import styles from './Login.module.css'

export default function Login() {
  const { token, login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // Si ya hay sesión activa, ir directo al dashboard
  if (token) return <Navigate to="/dashboard" replace />

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')   // limpiar error al tipear
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/api/Auth/login', form)
      // data = { token, nombre, roles }
      login(data)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message
        ?? err.response?.data
        ?? 'Credenciales incorrectas. Intenta de nuevo.'
      setError(typeof msg === 'string' ? msg : 'Error al iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Marca */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>A</div>
          <span className={styles.brandName}>AdminPanel</span>
        </div>

        <h1 className={styles.heading}>Bienvenido de vuelta</h1>
        <p className={styles.sub}>Ingresa tus credenciales para continuar</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

          <label className={styles.label}>
            Contraseña
            <input
              className={styles.input}
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>

        <p className={styles.registerLink}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.link}>Regístrate</Link>
        </p>
      </div>

      {/* Fondo decorativo */}
      <div className={styles.decoration} aria-hidden="true" />
    </div>
  )
}
