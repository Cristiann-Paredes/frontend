import { useEffect, useState } from 'react';
import './AdminAsignacionesPage.css';
import axios from 'axios';

function AdminAsignacionesPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [form, setForm] = useState({
    usuario: "",
    plan: "",
    fechaFin: "",
    observaciones: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [clienteActivo, setClienteActivo] = useState(null);

  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_URL}/clientes`, { headers })
      .then(res => setUsuarios(res.data))
      .catch(() => setUsuarios([]));

    axios.get(`${API_URL}/planes`, { headers })
      .then(res => setPlanes(res.data))
      .catch(() => setPlanes([]));

    axios.get(`${API_URL}/asignaciones`, { headers })
      .then(res => setAsignaciones(res.data))
      .catch(() => setAsignaciones([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!form.usuario || !form.plan || !form.fechaFin) {
      return setMensaje("❌ Por favor completa todos los campos.");
    }

    try {
      await axios.post(`${API_URL}/asignaciones`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje("✅ Plan asignado correctamente");
      setForm({ usuario: "", plan: "", fechaFin: "", observaciones: "" });

      const res = await axios.get(`${API_URL}/asignaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAsignaciones(res.data);
    } catch {
      setMensaje("❌ Error al asignar plan");
    }
  };

  const handleEliminar = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que deseas eliminar esta asignación?")) return;
    try {
      await axios.delete(`${API_URL}/asignaciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAsignaciones(asignaciones.filter(a => a._id !== id));
      setMensaje("✅ Asignación eliminada");
    } catch {
      setMensaje("❌ Error al eliminar asignación");
    }
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
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.nombre} ({u.correo})
              </option>
            ))}
          </select>

          <label>Plan</label>
          <select name="plan" value={form.plan} onChange={handleChange}>
            <option value="">Selecciona un plan</option>
            {planes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre} ({p.nivel})
              </option>
            ))}
          </select>

          <label>Fecha de finalización</label>
          <input type="date" name="fechaFin" value={form.fechaFin} onChange={handleChange} />

          <label>Observaciones</label>
          <textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones opcionales" />

          <button type="submit" className="btn-primario">
            Asignar plan
          </button>
        </form>
      </div>

      <div className="asignaciones-lista">
        <h3>Asignaciones por cliente</h3>
        <div className="clientes-botones">
          {usuarios.map((u) => (
            <button key={u._id} onClick={() => setClienteActivo(u._id)} className={clienteActivo === u._id ? 'activo' : ''}>
              {u.nombre}
            </button>
          ))}
        </div>

        <div className="asignaciones-cards">
          {clienteActivo ? (
            <>
              {asignacionesPorUsuario.find(u => u.usuario._id === clienteActivo)?.asignaciones.length === 0 ? (
                <p>No hay asignaciones para este cliente.</p>
              ) : (
                asignacionesPorUsuario.find(u => u.usuario._id === clienteActivo)?.asignaciones.map((a) => (
                  <div key={a._id} className="asignacion-card">
                    <div className="asignacion-header">
                      <span>
                        <b>Plan:</b> {a.plan?.nombre} ({a.plan?.nivel})
                      </span>
                      <button onClick={() => handleEliminar(a._id)} title="Eliminar asignación">
                        🗑️
                      </button>
                    </div>
                    <div>
                      <b>Asignado:</b> {new Date(a.fechaAsignacion).toLocaleDateString()}
                      <br />
                      <b>Fin:</b> {a.fechaFin ? new Date(a.fechaFin).toLocaleDateString() : "Sin definir"}
                      {a.observaciones && (
                        <>
                          <br />
                          <b>Obs.:</b> {a.observaciones}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <p>Selecciona un cliente para ver sus asignaciones.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAsignacionesPage;
