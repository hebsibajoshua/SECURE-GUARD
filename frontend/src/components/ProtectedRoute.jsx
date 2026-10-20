import { Navigate } from 'react-router-dom'
import { isAuthenticated, getCurrentUser } from '../services/auth'

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  const user = getCurrentUser()
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />
  }
  return children
}
