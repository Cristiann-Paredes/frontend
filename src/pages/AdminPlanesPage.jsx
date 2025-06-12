import React, { useState, useEffect } from 'react';
import { Widget } from '@uploadcare/react-widget';
import './AdminPlanesPage.css';
const API_URL = import.meta.env.VITE_API_URL;


function AdminPlanesPage() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    nivel: 'básico',
    ejercicios: [{ nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }],
  });

  const [mensaje, setMensaje] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [vista, setVista] = useState('listar');
  const [planDetalle, setPlanDetalle] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    if (vista === 'listar') obtenerPlanes();
  }, [vista]);

  const mostrarMensaje = (texto, tiempo = 3500) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), tiempo);
  };

  const pedirConfirmacion = (texto, onConfirm) => {
    setConfirmacion({ texto, onConfirm });
  };

  const obtenerPlanes = async () => {
    try {
      const res = await fetch(`${API_URL}/planes`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) setPlanes(data.planes || data);
    } catch {
      mostrarMensaje('❌ Error al obtener los planes');
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleEjercicioChange = (idx, e) => {
    const nuevos = [...formulario.ejercicios];
    nuevos[idx][e.target.name] = e.target.value;
    setFormulario({ ...formulario, ejercicios: nuevos });
  };

  const handleImagenUpload = (idx, url) => {
    const nuevos = [...formulario.ejercicios];
    nuevos[idx].imagenURL = url;
    setFormulario({ ...formulario, ejercicios: nuevos });
  };

  const agregarEjercicio = () => {
    setFormulario({
      ...formulario,
      ejercicios: [...formulario.ejercicios, { nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }],
    });
  };

  const quitarEjercicio = (idx) => {
    const nuevos = formulario.ejercicios.filter((_, i) => i !== idx);
    setFormulario({ ...formulario, ejercicios: nuevos });
  };

  const confirmarAccion = (texto, onConfirm) => {
    setConfirmacion({ texto, onConfirm });
  };

  const handleConfirmar = () => {
    if (confirmacion && confirmacion.onConfirm) confirmacion.onConfirm();
    setConfirmacion(null);
  };

  const handleCancelar = () => {
    setConfirmacion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editando && idEditando
      ? `${API_URL}/planes/${idEditando}`
      : `${API_URL}/planes`;
    const method = editando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formulario),
      });
      const data = await res.json();
      if (res.ok) {
        mostrarMensaje(editando ? '✅ Plan actualizado' : '✅ Plan creado');
        setFormulario({
          nombre: '',
          descripcion: '',
          nivel: 'básico',
          ejercicios: [{ nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }],
        });
        setEditando(false);
        setIdEditando(null);
        setVista('listar');
      } else {
        mostrarMensaje(`❌ Plan existente : ${data.msg || data.message}`);
      }
    } catch {
      mostrarMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleEditar = (plan) => {
    setFormulario({
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      nivel: plan.nivel,
      ejercicios: (plan.ejercicios || []).map((ej) => ({
        nombre: ej.nombre,
        repeticiones: ej.repeticiones,
        videoURL: ej.videoURL || '',
        imagenURL: ej.imagenURL || '',
      })),
    });
    setEditando(true);
    setIdEditando(plan._id);
    setMensaje('');
    setVista('crear');
  };

  const handleEliminar = (id) => {
    confirmarAccion('¿Eliminar este plan?', async () => {
      try {
        const res = await fetch(`${API_URL}/planes/${id}`,{
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (res.ok) {
          mostrarMensaje('✅ Plan eliminado');
          obtenerPlanes();
        } else {
          mostrarMensaje(`❌ Error: ${data.msg || data.message}`);
        }
      } catch {
        mostrarMensaje('❌ Error al conectar con el servidor');
      }
    });
  };

  const handleVerDetalle = (plan) => {
    setPlanDetalle(plan);
    setVista('detalle');
  };

  return (
    <div className="admin-planes-page">
      <h2 className="admin-planes-title">Gestión de Planes</h2>
      {mensaje && <div className="admin-planes-mensaje">{mensaje}</div>}
      {confirmacion && (
        <div className="modal-confirmacion">
          <p>{confirmacion.texto}</p>
          <button onClick={handleConfirmar}>Confirmar</button>
          <button onClick={handleCancelar}>Cancelar</button>
        </div>
      )}

      {vista === 'listar' && (
        <div className="admin-planes-listar">
          <button
            onClick={() => {
              setFormulario({
                nombre: '',
                descripcion: '',
                nivel: 'básico',
                ejercicios: [{ nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }],
              });
              setEditando(false);
              setIdEditando(null);
              setVista('crear');
            }}
            className="admin-planes-btn crear"
          >
            Crear nuevo plan
          </button>
          <table className="admin-planes-tabla">
            <thead>
  <tr>
    <th>Nombre</th>
    <th>Descripción</th>
    <th>Nivel</th>
    <th>Acciones</th>
  </tr>
</thead>

            <tbody>
  {planes.length === 0 ? (
    <tr><td colSpan={4}>No hay planes registrados.</td></tr>
  ) : (
    planes.map((plan) => (
      <tr key={plan._id}>
        <td>{plan.nombre}</td>
        <td>{plan.descripcion}</td>
        <td>{plan.nivel}</td>
        <td className="acciones">
          <button onClick={() => handleEditar(plan)} className="edit">Editar</button>
          <button onClick={() => handleVerDetalle(plan)} className="view">Ver</button>
          <button onClick={() => handleEliminar(plan._id)} className="delete">Eliminar</button>
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      )}

      {vista === 'detalle' && planDetalle && (
  <div className="admin-planes-detalle">
    <h3>{planDetalle.nombre}</h3>
    <p>{planDetalle.descripcion}</p>
    <p><b>Nivel:</b> {planDetalle.nivel}</p>
    <h4>Ejercicios</h4>
    <div className="admin-planes-detalle-ejercicios">
      {planDetalle.ejercicios.map((ej, idx) => (
        <div key={idx} className="admin-planes-ejercicio">
          {ej.imagenURL ? (
            <img src={ej.imagenURL} alt={`Ejercicio ${idx}`} className="admin-planes-preview" />
          ) : (
            <div className="admin-planes-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              Sin imagen
            </div>
          )}
          <div className="admin-planes-ejercicio-content">
            <p><b>{ej.nombre}</b></p>
            <p>{ej.repeticiones}</p>
            {ej.videoURL && (
              <a href={ej.videoURL} target="_blank" rel="noreferrer" style={{ color: '#64b5f6' }}>
                Ver video
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
    <button onClick={() => setVista('listar')} className="admin-planes-btn volver">Volver</button>
  </div>
)}


      {vista === 'crear' && (
        <form onSubmit={handleSubmit} className="admin-planes-form">
          <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} required />
          <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleChange} required />
          <select name="nivel" value={formulario.nivel} onChange={handleChange}>
            <option value="básico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>

          {formulario.ejercicios.map((ej, idx) => (
            <div key={idx} className="admin-planes-ejercicio">
              {ej.imagenURL ? (
                <img src={ej.imagenURL} alt={`Ejercicio ${idx}`} className="admin-planes-preview" />
              ) : (
                <div className="admin-planes-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                  Sin imagen
                </div>
              )}
              <div className="admin-planes-ejercicio-content">
                <input type="text" name="nombre" placeholder="Nombre del ejercicio" value={ej.nombre} onChange={(e) => handleEjercicioChange(idx, e)} required />
                <input type="text" name="repeticiones" placeholder="Repeticiones" value={ej.repeticiones} onChange={(e) => handleEjercicioChange(idx, e)} required />
                <Widget publicKey="643ce81cabfea0aa8567" onChange={(file) => handleImagenUpload(idx, file.cdnUrl)} />
                <button type="button" className="admin-planes-btn eliminar" onClick={() => quitarEjercicio(idx)}>Quitar</button>
              </div>
            </div>
          ))}

          <div className="admin-planes-form-buttons">
            <button type="button" onClick={agregarEjercicio} className="admin-planes-btn agregar">Agregar ejercicio</button>
            <button type="submit" className="admin-planes-btn crear">{editando ? 'Actualizar' : 'Crear'} plan</button>
            <button type="button" className="admin-planes-btn volver" onClick={() => setVista('listar')}>Volver a gestión</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminPlanesPage;
