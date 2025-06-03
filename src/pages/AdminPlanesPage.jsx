import React, { useState, useEffect } from 'react';
import { Widget } from '@uploadcare/react-widget';
import './AdminPlanesPage.css';

function AdminPlanesPage() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    nivel: 'básico',
    dia: 'Lunes',
    ejercicios: [{ nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }],
  });

  const [mensaje, setMensaje] = useState('');
  const [planes, setPlanes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [vista, setVista] = useState('listar');
  const [planDetalle, setPlanDetalle] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    if (vista === 'listar') obtenerPlanes();
  }, [vista]);

  const obtenerPlanes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/planes', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) setPlanes(data.planes || data);
    } catch {
      setMensaje('❌ Error al obtener los planes');
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

  const handleVerDetalle = (plan) => {
    setPlanDetalle(plan);
    setVista('detalle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editando && idEditando
      ? `http://localhost:3000/api/planes/${idEditando}`
      : 'http://localhost:3000/api/planes';
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
        setMensaje(editando ? '✅ Plan actualizado' : '✅ Plan creado');
        setFormulario({
          nombre: '',
          descripcion: '',
          nivel: 'básico',
          dia: 'Lunes',
          ejercicios: [{ nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }],
        });
        setEditando(false);
        setIdEditando(null);
        setVista('listar');
      } else {
        setMensaje(`❌ Error: ${data.msg || data.message}`);
      }
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleEditar = (plan) => {
    setFormulario({
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      nivel: plan.nivel,
      dia: plan.dia || 'Lunes',
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

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este plan?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/planes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ Plan eliminado');
        obtenerPlanes();
      } else {
        setMensaje(`❌ Error: ${data.msg || data.message}`);
      }
    } catch {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  return (
    <div className="admin-planes-page">
      <h2 className="admin-planes-title">Gestión de Planes</h2>
      {mensaje && <div className="admin-planes-mensaje">{mensaje}</div>}

      {vista === 'listar' && (
        <div className="admin-planes-listar">
          <button onClick={() => setVista('crear')} className="admin-planes-btn crear">Crear nuevo plan</button>
          <table className="admin-planes-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nivel</th>
                <th>Día</th>
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
                    <td>{plan.nivel}</td>
                    <td>{plan.dia}</td>
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
          <p><b>Día:</b> {planDetalle.dia}</p>
          <h4>Ejercicios</h4>
          <ul>
            {planDetalle.ejercicios.map((ej, idx) => (
              <li key={idx}>
                <b>{ej.nombre}</b> - {ej.repeticiones}
                {ej.imagenURL && <img src={ej.imagenURL} alt={ej.nombre} className="admin-planes-img" />}
                {ej.videoURL && <div><a href={ej.videoURL} target="_blank" rel="noreferrer">Ver video</a></div>}
              </li>
            ))}
          </ul>
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
          <select name="dia" value={formulario.dia} onChange={handleChange}>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>

          {formulario.ejercicios.map((ej, idx) => (
            <div key={idx} className="admin-planes-ejercicio">
              <input type="text" name="nombre" placeholder="Nombre del ejercicio" value={ej.nombre} onChange={(e) => handleEjercicioChange(idx, e)} required />
              <input type="text" name="repeticiones" placeholder="Repeticiones" value={ej.repeticiones} onChange={(e) => handleEjercicioChange(idx, e)} required />
              <input type="text" name="videoURL" placeholder="URL de video (opcional)" value={ej.videoURL} onChange={(e) => handleEjercicioChange(idx, e)} />
              <Widget publicKey="643ce81cabfea0aa8567" onChange={(file) => handleImagenUpload(idx, file.cdnUrl)} />
              <button type="button" className="admin-planes-btn eliminar" onClick={() => quitarEjercicio(idx)}>Quitar</button>
            </div>
          ))}

          <button type="button" onClick={agregarEjercicio} className="admin-planes-btn agregar">Agregar ejercicio</button>
          <button type="submit" className="admin-planes-btn crear">{editando ? 'Actualizar' : 'Crear'} plan</button>
          <button type="button" className="admin-planes-btn volver" onClick={() => setVista('listar')}>Volver a gestión</button>
        </form>
      )}
    </div>
  );
}

export default AdminPlanesPage;