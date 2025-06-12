import { useEffect, useState } from 'react';
import './ControlEstadoCliente.css';

const API_URL = import.meta.env.VITE_API_URL;

function ControlEstadoCliente() {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.confirmEmail) {
          // Correo no confirmado
          setEstado({ noConfirmado: true });
          return;
        }

        if (data.fechaInicio && data.fechaVencimiento) {
          const inicio = new Date(data.fechaInicio);
          const fin = new Date(data.fechaVencimiento);
          const hoy = new Date();

          const total = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
          const restantes = Math.max(0, Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24)));
          const porcentajeRestante = Math.min(100, Math.round((restantes / total) * 100));

          setEstado({
            nombre: data.nombre,
            fechaInicio: data.fechaInicio,
            fechaVencimiento: data.fechaVencimiento,
            diasRestantes: restantes,
            porcentaje: porcentajeRestante,
            imagenPerfil: data.imagenPerfil || ''
          });
        } else {
          setEstado({ sinFechas: true });
        }
      })
      .catch(err => {
        console.error('Error al obtener perfil:', err);
        setEstado({ error: true });
      });
  }, []);

  if (!estado) return <p className="estado-loading">Cargando estado...</p>;

  if (estado.error) {
    return <p className="estado-error">❌ No se pudo cargar el estado. Intenta más tarde.</p>;
  }

  if (estado.noConfirmado) {
    return <p className="estado-aviso">⚠️ Debes confirmar tu correo para ver el estado de tu cuenta.</p>;
  }

  if (estado.sinFechas) {
    return <p className="estado-aviso">📅 Aún no tienes fechas asignadas para tu plan.</p>;
  }

  return (
    <div className="estado-container">
      <div className="estado-card">
        <h2 className="estado-titulo">Estado de tu Cuenta</h2>
        <p><strong>Nombre:</strong> {estado.nombre}</p>

        <div className="estado-foto">
          <img src={estado.imagenPerfil} alt="Perfil" />
        </div>

        <p><strong>Días restantes:</strong> {estado.diasRestantes} días</p>

        <div className="barra-estado">
          <div
            className={`barra-progreso ${
              estado.porcentaje >= 70 ? 'verde' :
              estado.porcentaje >= 40 ? 'amarilla' :
              'roja'
            }`}
            style={{ width: `${estado.porcentaje}%` }}
          >
            <span className="barra-texto">{estado.porcentaje}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlEstadoCliente;

