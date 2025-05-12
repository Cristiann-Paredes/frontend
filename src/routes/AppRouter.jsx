import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import PerfilPage from '../pages/PerfilPage'
import PlanesPage from '../pages/PlanesPage'
import HomePage from '../pages/HomePage'
import AdminClientesPage from '../pages/AdminClientesPage'
import AdminPlanesPage from '../pages/AdminPlanesPage'
import AdminAsignacionesPage from '../pages/AdminAsignacionesPage'



import ProtectedRoute from './ProtectedRoute'
import Navbar from '../components/Navbar'


function AppRouter() {
  return (
    <>
    
      <Navbar />
      
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/clientes"
  element={
    <ProtectedRoute>
      <AdminClientesPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/admin/asignaciones"
          element={
            <ProtectedRoute>
              <AdminAsignacionesPage />
            </ProtectedRoute>
          }
          />

        <Route
          path="/admin/planes"
          element={
            <ProtectedRoute>
              <AdminPlanesPage />
            </ProtectedRoute>
          }
/>

        <Route 
          path="/planes" 
          element={
            <ProtectedRoute>
              <PlanesPage />
            </ProtectedRoute>
          }
        />
        

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default AppRouter