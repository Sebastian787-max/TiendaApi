import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout        from './components/Layout'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Dashboard     from './pages/Dashboard'
import Productos     from './pages/Productos'
import Categorias    from './pages/Categorias'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas — todas dentro de Layout (sidebar + header) */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/productos"  element={<Productos />} />
            <Route path="/categorias" element={<Categorias />} />
          </Route>

          {/* Cualquier otra ruta → dashboard (o login si no hay sesión) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}