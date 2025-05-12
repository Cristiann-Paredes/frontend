import { useState, useEffect } from 'react'
import AdminClientesPage from './AdminClientesPage'
import AdminPlanesPage from './AdminPlanesPage'
import AdminAsignacionesPage from './AdminAsignacionesPage' // Importar el nuevo componente
import './PerfilPage.css'

function PerfilPage() {
  const [activeTab, setActiveTab] = useState('clientes')
  const [rol, setRol] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No autorizado')
      return
    }

    fetch('http://localhost:3000/api/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.rol) {
          setRol(data.rol) // Guardar el rol del usuario
        } else {
          setError('Error al cargar el perfil')
        }
      })
      .catch(() => setError('Error de conexión'))
  }, [])

  const renderContent = () => {
    if (rol === 'cliente') {
      return <p className="text-red-500">Acceso denegado: solo administradores</p>
    }

    switch (activeTab) {
      case 'clientes':
        return <AdminClientesPage />
      case 'planes':
        return <AdminPlanesPage />
      case 'asignaciones': // Nueva pestaña
        return <AdminAsignacionesPage />
      default:
        return <p>Selecciona una opción del menú.</p>
    }
  }

  if (error) return <p className="text-red-500 p-6">{error}</p>
  if (!rol) return <p className="p-6">Cargando...</p>

  return (
    <div className="perfil-container">
      <aside className="perfil-aside">
        <div className="perfil-avatar">👤</div>
        <div className="perfil-nombre">Administrador</div>
        <div className="perfil-rol">{rol === 'admin' ? 'Administrador' : 'Cliente'}</div>

        <div className="perfil-menu">
          {rol === 'admin' && (
            <>
              <button
                className={activeTab === 'clientes' ? 'active' : ''}
                onClick={() => setActiveTab('clientes')}
              >
                Gestión de Clientes
              </button>
              <button
                className={activeTab === 'planes' ? 'active' : ''}
                onClick={() => setActiveTab('planes')}
              >
                Gestión de Planes
              </button>
              <button
                className={activeTab === 'asignaciones' ? 'active' : ''}
                onClick={() => setActiveTab('asignaciones')}
              >
                Gestión de Asignaciones
              </button>
            </>
          )}
        </div>

        <button
          className="perfil-logout"
          onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="perfil-main">
        {renderContent()}
      </main>
    </div>
  )
}

export default PerfilPage