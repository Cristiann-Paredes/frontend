import { useState, useEffect } from 'react';
import './PerfilPage.css';
import AdminClientesPage from './AdminClientesPage';
import AdminPlanesPage from './AdminPlanesPage';
import AdminAsignacionesPage from './AdminAsignacionesPage';
import PlanesPage from './PlanesPage';
import EditarPerfilPage from './EditarPerfilPage';
import AdminEstadoPage from './AdminEstadoPage';
import ControlEstadoCliente from './ControlEstadoCliente';

function PerfilPage() {
  const [activeTab, setActiveTab] = useState('clientes');
  const [rol, setRol] = useState(null);
  const [nombre, setNombre] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState('');
  const [error, setError] = useState('');
  const [mostrarMenu, setMostrarMenu] = useState(true);
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);

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
        if (!res.ok) throw new Error(data.msg || 'Error al cargar el perfil');
        setRol(data.rol);
        setNombre(data.nombre);
        setImagenPerfil(data.imagenPerfil);
        if (data.rol === 'cliente') setActiveTab('mis-planes');
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 20000);
      });

    const manejarResize = () => {
      const esAhoraMovil = window.innerWidth <= 768;
      setEsMovil(esAhoraMovil);
      if (!esAhoraMovil) setMostrarMenu(true);
    };

    window.addEventListener('resize', manejarResize);
    return () => window.removeEventListener('resize', manejarResize);
  }, []);

  const ocultarAsideCliente = rol === 'cliente' && esMovil &&
    (activeTab === 'mis-planes' || activeTab === 'editar-perfil' || activeTab === 'control estado');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (rol === 'cliente' && esMovil) setMostrarMenu(false);
    window.scrollTo(0, 0); // Cierra el menú y hace scroll arriba
  };

  const renderContent = () => {
    if (rol === 'cliente') {
      if (activeTab === 'editar-perfil') return <EditarPerfilPage />;
      if (activeTab === 'control estado') return <ControlEstadoCliente />;
      return <PlanesPage />;
    }

    switch (activeTab) {
      case 'clientes': return <AdminClientesPage />;
      case 'planes': return <AdminPlanesPage />;
      case 'asignaciones': return <AdminAsignacionesPage />;
      case 'control estado': return <AdminEstadoPage />;
      case 'editar-perfil': return <EditarPerfilPage />;
      default: return <p>Selecciona una opción del menú.</p>;
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

  if (!rol) return <p className="p-6">Cargando...</p>;

  return (
    <div className="perfil-container">
      {rol === 'cliente' && esMovil && (
        <button className="menu-toggle-btn" onClick={() => setMostrarMenu(!mostrarMenu)}>
          ☰
        </button>
      )}

      <aside className={`perfil-aside ${ocultarAsideCliente && !mostrarMenu ? 'oculto' : ''}`}>
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
              <button className={activeTab === 'clientes' ? 'active' : ''} onClick={() => handleTabChange('clientes')}>Gestión de Clientes</button>
              <button className={activeTab === 'planes' ? 'active' : ''} onClick={() => handleTabChange('planes')}>Gestión de Planes</button>
              <button className={activeTab === 'asignaciones' ? 'active' : ''} onClick={() => handleTabChange('asignaciones')}>Gestión de Asignaciones</button>
              <button className={activeTab === 'control estado' ? 'active' : ''} onClick={() => handleTabChange('control estado')}>Control de Estado</button>
              <button className={activeTab === 'editar-perfil' ? 'active' : ''} onClick={() => handleTabChange('editar-perfil')}>Editar Perfil</button>
            </>
          ) : (
            <>
              <button className={activeTab === 'mis-planes' ? 'active' : ''} onClick={() => handleTabChange('mis-planes')}>Mis Planes</button>
              <button className={activeTab === 'editar-perfil' ? 'active' : ''} onClick={() => handleTabChange('editar-perfil')}>Editar Perfil</button>
              <button className={activeTab === 'control estado' ? 'active' : ''} onClick={() => handleTabChange('control estado')}>Mi Estado</button>
            </>
          )}
        </div>

        <button className="perfil-logout" onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}>
          Cerrar sesión
        </button>
      </aside>

      <main className="perfil-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default PerfilPage;
