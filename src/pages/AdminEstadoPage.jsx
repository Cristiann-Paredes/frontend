import { useState, useEffect } from 'react';
import './AdminEstadoPage.css';

function AdminEstadoPage() {
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/api/perfil/clientes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() => setMensaje('Error al cargar clientes'));
  }, []);

  const handleChange = (id, field, value) => {
    setClientes((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c))
    );
  };

  const guardarCambios = async (id) => {
    const cliente = clientes.find((c) => c._id === id);
    try {
      const res = await fetch(`http://localhost:3000/api/perfil/estado/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaInicio: cliente.fechaInicio,
          fechaVencimiento: cliente.fechaVencimiento,
        }),
      });
      const data = await res.json();
      setMensaje(data.msg || 'Actualizado correctamente');
    } catch {
      setMensaje('Error al guardar cambios');
    }
  };

  const handleReiniciar = () => {
    setConfirmacion({
      texto: '¿Estás seguro de reiniciar los ejercicios?',
      onConfirm: ejecutarReinicio,
    });
  };

  const ejecutarReinicio = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/reiniciar-semanal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMensaje(data.msg || 'Reinicio completado');
    } catch {
      setMensaje('Error al ejecutar el reinicio');
    }
    setConfirmacion(null);
  };

  const handleConfirmar = () => {
    if (confirmacion?.onConfirm) confirmacion.onConfirm();
  };

  const handleCancelar = () => setConfirmacion(null);

  return (
    <div className="admin-estado-wrapper">
      <h2 className="admin-estado-title">Control de Estado de Clientes</h2>

      {mensaje && <p className="mensaje-estado">{mensaje}</p>}

      {confirmacion && (
        <div className="modal-confirmacion">
          <p>{confirmacion.texto}</p>
          <button onClick={handleConfirmar} className="btn-confirmar">Confirmar</button>
          <button onClick={handleCancelar} className="btn-cancelar">Cancelar</button>
        </div>
      )}

      <button className="btn-reiniciar" onClick={handleReiniciar}>
        Reiniciar ejercicios
      </button>

      <div className="tabla-estado">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c._id}>
                <td>{c.nombre}</td>
                <td>
                  <input
                    type="date"
                    value={c.fechaInicio?.slice(0, 10) || ''}
                    onChange={(e) => handleChange(c._id, 'fechaInicio', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={c.fechaVencimiento?.slice(0, 10) || ''}
                    onChange={(e) => handleChange(c._id, 'fechaVencimiento', e.target.value)}
                  />
                </td>
                <td>
                  <button className="btn-guardar-estado" onClick={() => guardarCambios(c._id)}>
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEstadoPage;
