// Importaciones existentes...
import { useState, useEffect } from 'react'
import './PerfilPage.css'
import AdminClientesPage from './AdminClientesPage'
import AdminPlanesPage from './AdminPlanesPage'
import AdminAsignacionesPage from './AdminAsignacionesPage'
import PlanesPage from './PlanesPage'
import EditarPerfilPage from './EditarPerfilPage'
import AdminEstadoPage from './AdminEstadoPage';


function PerfilPage() {
  const [activeTab, setActiveTab] = useState('clientes')
  const [rol, setRol] = useState(null)
  const [nombre, setNombre] = useState('')
  const [imagenPerfil, setImagenPerfil] = useState('')
  const [error, setError] = useState('')

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setError('No autorizado');
    return;
  }

  fetch('http://localhost:3000/api/perfil', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Error al cargar el perfil');
      }

      if (data.rol) {
        setRol(data.rol);
        setNombre(data.nombre);
        setImagenPerfil(data.imagenPerfil);
        if (data.rol === 'cliente') setActiveTab('mis-planes');
      } else {
        throw new Error('Error al cargar el perfil');
      }
    })
    .catch((err) => {
      setError(err.message);
      // Redirigir al login automáticamente en 30 segundos
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 20000);
    });
}, []);


  const renderContent = () => {
  if (rol === 'cliente') {
    if (activeTab === 'editar-perfil') return <EditarPerfilPage />;
    return <PlanesPage />;
  }
  switch (activeTab) {
    case 'clientes':
      return <AdminClientesPage />;
    case 'planes':
      return <AdminPlanesPage />;
    case 'asignaciones':
      return <AdminAsignacionesPage />;
    case 'control estado':
      return <AdminEstadoPage />;  
    case 'editar-perfil':
      return <EditarPerfilPage />;
    default:
      return <p>Selecciona una opción del menú.</p>;
  }
};


if (error) {
  return (
  <div className="perfil-error">
  <p><strong>{error}</strong></p>

  <img src="/conexion.png" alt="Logo" className="perfil-error-logo" />

  <p>Serás redirigido al login...</p>
  <button onClick={() => window.location.href = '/login'}>
    Ir al login ahora
  </button>
</div>

  );
}

  if (!rol) return <p className="p-6">Cargando...</p>

  return (
    <div className="perfil-container">
      <aside className="perfil-aside">
        <div className="perfil-avatar">
          {imagenPerfil ? (
            <img src={imagenPerfil} alt="Avatar" className="avatar-sidebar" />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
        </div>
        <div className="perfil-nombre">{nombre || (rol === 'admin' ? 'Administrador' : 'Cliente')}</div>
        <div className="perfil-rol">{rol === 'admin' ? 'Administrador' : 'Cliente'}</div>

        <div className="perfil-menu">
          {rol === 'admin' ? (
            <>
              <button className={activeTab === 'clientes' ? 'active' : ''} onClick={() => setActiveTab('clientes')}>Gestión de Clientes</button>
              <button className={activeTab === 'planes' ? 'active' : ''} onClick={() => setActiveTab('planes')}>Gestión de Planes</button>
              <button className={activeTab === 'asignaciones' ? 'active' : ''} onClick={() => setActiveTab('asignaciones')}>Gestión de Asignaciones</button>
              <button className={activeTab === 'control estado' ? 'active' : ''} onClick={() => setActiveTab('control estado')}>Control de Estado</button>
              <button className={activeTab === 'editar-perfil' ? 'active' : ''} onClick={() => setActiveTab('editar-perfil')}>Editar Perfil</button>
            </>
          ) : (
            <>
              <button className={activeTab === 'mis-planes' ? 'active' : ''} onClick={() => setActiveTab('mis-planes')}>Mis Planes</button>
              <button className={activeTab === 'editar-perfil' ? 'active' : ''} onClick={() => setActiveTab('editar-perfil')}>Editar Perfil</button>
              <button className={activeTab === 'control estado' ? 'active' : ''} onClick={() => setActiveTab('control estado')}>Control de Estado</button>

            </>
          )}
        </div>

        <button className="perfil-logout" onClick={() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }}>
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
