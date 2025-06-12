// ...importaciones
import { useEffect, useState } from 'react'
import './AdminClientesPage.css'
const API_URL = import.meta.env.VITE_API_URL;


function AdminClientesPage() {
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [mostrarSeccion, setMostrarSeccion] = useState('tabla')
  const [mensaje, setMensaje] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    correo: '',
    password: '',
    estado: true,
    rol: 'cliente'

  })

  const token = localStorage.getItem('token')

  const mostrarMensaje = (texto, tiempo = 3000) => {
    setMensaje(texto)
    setTimeout(() => setMensaje(''), tiempo)
  }

  const pedirConfirmacion = (texto, onConfirm) => {
    setConfirmacion({ texto, onConfirm })
  }

  const handleConfirmar = () => {
    if (confirmacion && confirmacion.onConfirm) confirmacion.onConfirm()
    setConfirmacion(null)
  }
  const handleNombreChange = (e, tipo) => {
  const soloLetras = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase()

  if (tipo === 'nuevo') {
    setNuevoCliente({ ...nuevoCliente, nombre: soloLetras })
  } else if (tipo === 'editar') {
    setClienteSeleccionado({ ...clienteSeleccionado, nombre: soloLetras })
  }
}


  const handleCancelar = () => {
    setConfirmacion(null)
  }

const fetchClientes = async () => {
  try {
    const res = await fetch(`${API_URL}/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.msg || 'Error al cargar clientes')
    
    // Filtrar solo clientes confirmados
    setClientes(data.filter(cliente => cliente.confirmEmail))
  } catch (err) {
    setError(err.message)
  }
}
  useEffect(() => {
    if (token) fetchClientes()
    else setError('No autorizado')
  }, [token])

  const toggleEstado = (id) => {
    const cliente = clientes.find(c => c._id === id)
    const texto = cliente.estado ? '¿Inactivar este cliente?' : '¿Activar este cliente?'
    pedirConfirmacion(texto, async () => {
      try {
        const res = await fetch(`${API_URL}/clientes/${id}/estado`,{
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) {
          setClientes(clientes.map(c => c._id === id ? { ...c, estado: !c.estado } : c))
          mostrarMensaje(data.msg || 'Estado actualizado')
        } else {
          mostrarMensaje(data.msg || 'Error al cambiar estado')
        }
      } catch {
        mostrarMensaje('❌ Error al conectar con el servidor')
      }
    })
  }

  const handleEditar = (id) => {
    const cliente = clientes.find(c => c._id === id)
    setClienteSeleccionado(cliente)
    setMostrarSeccion('editar')
  }

  const handleActualizarCliente = async () => {
    try {
      const res = await fetch(`${API_URL}/clientes/${clienteSeleccionado._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(clienteSeleccionado)
      })
      const data = await res.json()
      if (res.ok) {
        mostrarMensaje(data.msg || 'Cliente actualizado')
        setClientes(clientes.map(c => c._id === clienteSeleccionado._id ? clienteSeleccionado : c))
        setClienteSeleccionado(null)
        setMostrarSeccion('tabla')
      } else {
        mostrarMensaje(data.msg || 'Error al actualizar cliente')
      }
    } catch {
      mostrarMensaje('❌ Error al actualizar cliente')
    }
  }

  const handleEliminar = (id) => {
    pedirConfirmacion('¿Estás seguro de que deseas eliminar este cliente?', async () => {
      try {
        const res = await fetch(`${API_URL}/clientes/${id}`, {

          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) {
          mostrarMensaje(data.msg || 'Cliente eliminado')
          setClientes(clientes.filter(c => c._id !== id))
        } else {
          mostrarMensaje(data.msg || 'Error al eliminar cliente')
        }
      } catch {
        mostrarMensaje('❌ Error al conectar con el servidor')
      }
    })
  }

  const handleCrearCliente = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(nuevoCliente)
      })
      const data = await res.json()
      if (res.ok) {
        mostrarMensaje(data.msg || '✅ Cliente creado')
        setClientes([...clientes, { ...nuevoCliente, _id: data.cliente._id }])
        setNuevoCliente({ nombre: '', correo: '', password: '', estado: true, rol: 'cliente' })
        setMostrarSeccion('tabla')
        
      } else {
        mostrarMensaje(data.msg || '❌ Error al crear cliente')
      }
    } catch {
      mostrarMensaje('❌ Error al conectar con el servidor')
    }
  }

  return (
    <div className="admin-clientes-page">
      <h2>Gestión de Clientes</h2>

      {mensaje && <div className="mensaje-accion">{mensaje}</div>}
      {confirmacion && (
        <div className="modal-confirmacion">
          <p>{confirmacion.texto}</p>
          <button onClick={handleConfirmar}>Confirmar</button>
          <button onClick={handleCancelar}>Cancelar</button>
        </div>
      )}

      <div className="toggle-buttons">
        <button className={mostrarSeccion === 'tabla' ? 'active' : ''} onClick={() => setMostrarSeccion('tabla')}>
          Ver Tabla de Clientes
        </button>
        <button className={mostrarSeccion === 'formulario' ? 'active' : ''} onClick={() => setMostrarSeccion('formulario')}>
          Agregar Nuevo Cliente
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {mostrarSeccion === 'formulario' && (
        <form className="cliente-form" onSubmit={(e) => {
          e.preventDefault()
          handleCrearCliente()
        }}>
          <label>Nombre</label>
          <input type="text" value={nuevoCliente.nombre} onChange={(e) => handleNombreChange(e, 'nuevo')} />
          <label>Correo</label>
          <input type="email" value={nuevoCliente.correo} onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })} />
          <label>Contraseña</label>
          <input type="password" value={nuevoCliente.password} onChange={(e) => setNuevoCliente({ ...nuevoCliente, password: e.target.value })} />
          <label>Rol</label>
          <select value={nuevoCliente.rol} onChange={(e) => setNuevoCliente({ ...nuevoCliente, rol: e.target.value })}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="submit">Crear</button>
          <button className="cancel" onClick={() => setMostrarSeccion('tabla')}>Cancelar</button>

        </form>
      )}

      {mostrarSeccion === 'tabla' && (
        <div className="clientes-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c._id}>
                  <td>{c.nombre}</td>
                  <td>{c.correo}</td>
                  <td><span className={`estado ${c.estado ? 'activo' : 'inactivo'}`}>{c.estado ? 'Activo' : 'Inactivo'}</span></td>
                  <td className="actions">
                    <button className="edit" onClick={() => handleEditar(c._id)}>Editar</button>
                    <button className="delete" onClick={() => handleEliminar(c._id)}>Eliminar</button>
                    <button onClick={() => toggleEstado(c._id)}>{c.estado ? 'Inactivar' : 'Activar'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarSeccion === 'editar' && clienteSeleccionado && (
        <form className="cliente-form" onSubmit={(e) => {
          e.preventDefault()
          handleActualizarCliente()
        }}>
          <label>Nombre</label>
          <input type="text" value={clienteSeleccionado.nombre} onChange={(e) => handleNombreChange(e, 'editar')} />
          <label>Correo</label>
          <input type="email" value={clienteSeleccionado.correo} onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, correo: e.target.value })} />
          <label>Estado</label>
          <select value={clienteSeleccionado.estado ? 'activo' : 'inactivo'} onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, estado: e.target.value === 'activo' })}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <button type="submit" className="submit">Guardar</button>
          <button className="delete" onClick={() => setMostrarSeccion('tabla')} style={{ marginTop: '1rem' }}>Cancelar</button>
        </form>
      )}
    </div>
  )
}

export default AdminClientesPage
