import React, { useEffect, useState } from 'react';
import './ControlEstadoCliente.css';

const ControlEstadoCliente = () => {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const hoy = new Date();
        const fin = new Date(data.fechaVencimiento);
        const diferencia = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
        setEstado({ nombre: data.nombre, imagenPerfil: data.imagenPerfil, diasRestantes: diferencia });
      })
      .catch(() => setEstado({ error: 'No se pudo cargar el estado' }));
  }, []);

  if (!estado) return <p className="estado-cliente-cargando">Cargando estado...</p>;
  if (estado.error) return <p className="estado-cliente-error">{estado.error}</p>;

  return (
    <div className="estado-cliente-container">
      <h2>Estado de tu cuenta</h2>
      <div className="estado-cliente-card">
        <img src={estado.imagenPerfil} alt="Perfil" className="estado-cliente-avatar" />
        <div className="estado-cliente-info">
          <p className="estado-cliente-nombre">{estado.nombre}</p>
          <p className="estado-cliente-dias">{estado.diasRestantes} días restantes</p>
          <div className="estado-cliente-barra">
            <div
              className="estado-cliente-barra-interna"
              style={{ width: `${Math.min(100, estado.diasRestantes * 100 / 30)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlEstadoCliente;
