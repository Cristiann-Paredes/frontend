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

    const body = JSON.stringify({
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      nivel: formulario.nivel,
      dia: formulario.dia,
      ejercicios: formulario.ejercicios,
    });

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body,
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje(editando ? '✅ Plan actualizado' : '✅ Plan creado');
        setFormulario({ nombre: '', descripcion: '', nivel: 'básico', dia: 'Lunes', ejercicios: [{ nombre: '', repeticiones: '', videoURL: '', imagenURL: '' }] });
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
    <div className="max-w-4xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Planes</h2>
      {mensaje && <div className="p-2 mb-4 bg-gray-100 rounded">{mensaje}</div>}

      {vista === 'listar' && (
        <div>
          <button onClick={() => setVista('crear')} className="px-4 py-2 bg-blue-600 text-white rounded mb-4">Crear nuevo plan</button>
          <table className="w-full border mb-4">
            <thead><tr className="bg-gray-100"><th>Nombre</th><th>Nivel</th><th>Día</th><th>Acciones</th></tr></thead>
            <tbody>
              {planes.length === 0 && <tr><td colSpan={4} className="text-center p-2">No hay planes registrados.</td></tr>}
              {planes.map((plan) => (
                <tr key={plan._id}>
                  <td>{plan.nombre}</td>
                  <td>{plan.nivel}</td>
                  <td>{plan.dia}</td>
                  <td>
                    <button onClick={() => handleEditar(plan)} className="text-blue-600 mr-2">Editar</button>
                    <button onClick={() => handleVerDetalle(plan)} className="text-green-600 mr-2">Ver</button>
                    <button onClick={() => handleEliminar(plan._id)} className="text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vista === 'detalle' && planDetalle && (
        <div>
          <h2 className="text-xl font-bold mb-2">{planDetalle.nombre}</h2>
          <p>{planDetalle.descripcion}</p>
          <p><b>Nivel:</b> {planDetalle.nivel}</p>
          <p><b>Día:</b> {planDetalle.dia}</p>
          <h4 className="font-semibold mt-2">Ejercicios:</h4>
          <ul className="list-disc ml-6">
            {planDetalle.ejercicios.map((ej, idx) => (
              <li key={idx} className="mb-2">
                <b>{ej.nombre}</b> - {ej.repeticiones}
                {ej.imagenURL && <div><img src={ej.imagenURL} alt={ej.nombre} style={{ width: 100, marginTop: 4 }} /></div>}
                {ej.videoURL && <div><a href={ej.videoURL} target="_blank" rel="noopener noreferrer">Ver video</a></div>}
              </li>
            ))}
          </ul>
          <button onClick={() => setVista('listar')} className="mt-4 px-4 py-2 bg-gray-300 rounded">Volver</button>
        </div>
      )}

      {vista === 'crear' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} className="border p-2 rounded w-full" required />
          <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleChange} className="border p-2 rounded w-full" required />
          <select name="nivel" value={formulario.nivel} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="básico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <select name="dia" value={formulario.dia} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
            <option value=" "> </option>

          </select>

          {formulario.ejercicios.map((ej, idx) => (
            <div key={idx} className="border p-2 rounded">
              <input type="text" name="nombre" placeholder="Nombre del ejercicio" value={ej.nombre} onChange={(e) => handleEjercicioChange(idx, e)} required />
              <input type="text" name="repeticiones" placeholder="Repeticiones" value={ej.repeticiones} onChange={(e) => handleEjercicioChange(idx, e)} required />
              <input type="text" name="videoURL" placeholder="URL de video (opcional)" value={ej.videoURL} onChange={(e) => handleEjercicioChange(idx, e)} />
              <Widget
                publicKey="643ce81cabfea0aa8567"
                onChange={(file) => handleImagenUpload(idx, file.cdnUrl)}
              />
              <button type="button" onClick={() => quitarEjercicio(idx)} className="mt-1 text-red-600">Quitar</button>
            </div>
          ))}

          <button type="button" onClick={agregarEjercicio} className="px-3 py-1 bg-green-600 text-white rounded">Agregar ejercicio</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editando ? 'Actualizar' : 'Crear'} plan</button>
        </form>
      )}
    </div>
  );
}

export default AdminPlanesPage;
