import { useEffect, useState } from 'react';
import './AdminAsignacionesPage.css';
import axios from 'axios';

function AdminAsignacionesPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [form, setForm] = useState({ usuario: "", plan: "", observaciones: "" });
  const [mensaje, setMensaje] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);
  const [clienteActivo, setClienteActivo] = useState(null);

const API_URL = import.meta.env.VITE_URL_BACKEND;

  const mostrarMensaje = (texto, tiempo = 3000) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), tiempo);
  };

  const pedirConfirmacion = (texto, onConfirm) => {
    setConfirmacion({ texto, onConfirm });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_URL}/clientes`, { headers }).then(res => setUsuarios(res.data)).catch(() => setUsuarios([]));
    axios.get(`${API_URL}/planes`, { headers }).then(res => setPlanes(res.data)).catch(() => setPlanes([]));
    axios.get(`${API_URL}/asignaciones`, { headers }).then(res => setAsignaciones(res.data)).catch(() => setAsignaciones([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!form.usuario || !form.plan) return mostrarMensaje("❌ Por favor completa todos los campos.");

    try {
      await axios.post(`${API_URL}/asignaciones`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      mostrarMensaje("✅ Plan asignado correctamente");
      setForm({ usuario: "", plan: "", observaciones: "" });

      const res = await axios.get(`${API_URL}/asignaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAsignaciones(res.data);
    } catch {
      mostrarMensaje("❌ Plan ya asignado o error al asignar");
    }
  };

  const handleEliminar = async (id) => {
    pedirConfirmacion("¿Eliminar esta asignación?", async () => {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${API_URL}/asignaciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAsignaciones(asignaciones.filter(a => a._id !== id));
        mostrarMensaje("✅ Asignación eliminada");
      } catch {
        mostrarMensaje("❌ Error al eliminar asignación");
      }
    });
  };

  const asignacionesPorUsuario = usuarios.map(u => ({
    usuario: u,
    asignaciones: asignaciones.filter(a => a.usuario?._id === u._id)
  }));

  return (
    <div className="admin-asignaciones-page">
      <div className="asignaciones-form">
        <h2>Gestión de Asignaciones</h2>
        {mensaje && <div className="mensaje-asignaciones">{mensaje}</div>}
        <form onSubmit={handleSubmit} className="form-asignacion">
          <label>Cliente</label>
          <select name="usuario" value={form.usuario} onChange={handleChange}>
            <option value="">Selecciona un cliente</option>
            {usuarios.map(u => (
              <option key={u._id} value={u._id}>{u.nombre} ({u.correo})</option>
            ))}
          </select>

          <label>Plan</label>
          <select name="plan" value={form.plan} onChange={handleChange}>
            <option value="">Selecciona un plan</option>
            {planes.map(p => (
              <option key={p._id} value={p._id}>
                {p.nombre} - {p.descripcion} ({p.nivel})
              </option>
            ))}
          </select>

          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Observaciones opcionales"
          />

          <button type="submit" className="btn-primario">Asignar plan</button>
        </form>
      </div>

      <div className="asignaciones-lista">
        <h3>Asignaciones por cliente</h3>
        <div className="clientes-botones">
          {usuarios.map(u => (
            <button key={u._id} onClick={() => setClienteActivo(u._id)} className={clienteActivo === u._id ? "activo" : ""}>
              {u.nombre}
            </button>
          ))}
        </div>

        <div className="asignaciones-cards">
          {clienteActivo ? (
            asignacionesPorUsuario.find(u => u.usuario._id === clienteActivo)?.asignaciones.length === 0 ? (
              <p>No hay asignaciones para este cliente.</p>
            ) : (
              asignacionesPorUsuario.find(u => u.usuario._id === clienteActivo)?.asignaciones.map(a => (
                <div key={a._id} className="asignacion-card">
                  <div className="asignacion-header">
                    <span><b>Plan:</b> {a.plan?.nombre} <span style={{ fontWeight: 'normal', fontSize: '0.85rem' }}>({a.plan?.nivel})</span></span>
                    <button onClick={() => handleEliminar(a._id)} title="Eliminar">🗑️</button>
                  </div>
                  <p><b>Asignado:</b> {new Date(a.fechaAsignacion).toLocaleDateString()}</p>
                  <p><b>Observaciones:</b> {a.observaciones?.trim() || <span style={{ color: "#aaa" }}>Sin observaciones</span>}</p>
                </div>
              ))
            )
          ) : (
            <p>Selecciona un cliente para ver sus asignaciones.</p>
          )}
        </div>
      </div>

      {confirmacion && (
        <div className="modal-confirmacion">
          <p>{confirmacion.texto}</p>
          <div className="modal-confirmacion-buttons">
            <button className="btn-confirmar" onClick={() => {
              confirmacion.onConfirm();
              setConfirmacion(null);
            }}>Confirmar</button>
            <button className="btn-cancelar" onClick={() => setConfirmacion(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAsignacionesPage;
