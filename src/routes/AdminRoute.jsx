import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null
  const isAdmin = payload?.rol === 'admin'

  if (!isAdmin) {
    return <Navigate to="/login" />
  }

  return children
}

export default AdminRoute
