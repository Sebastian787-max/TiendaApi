import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Envuelve rutas que requieren sesión activa.
 * Si no hay token → redirige a /login.
 * Si hay token   → renderiza los children normalmente.
 */
export default function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}