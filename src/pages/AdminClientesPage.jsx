import { useEffect, useState } from 'react'
import './AdminClientesPage.css'

function AdminClientesPage() {
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [mostrarSeccion, setMostrarSeccion] = useState('tabla')
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    correo: '',
    password: '',
    estado: true,
    rol: 'cliente'
  })

  const token = localStorage.getItem('token')

  const fetchClientes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.msg || 'Error al cargar clientes')
      }

      const data = await res.json()
      setClientes(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (token) {
      fetchClientes()
    } else {
      setError('No autorizado')
    }
  }, [token])

  const toggleEstado = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${id}/estado`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.msg)
      }

      const data = await res.json()
      alert(data.msg)

      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente._id === id ? { ...cliente, estado: !cliente.estado } : cliente
        )
      )
    } catch (err) {
      alert(err.message || 'Error al actualizar estado')
    }
  }

  const handleEditar = (id) => {
    const cliente = clientes.find((c) => c._id === id)
    setClienteSeleccionado(cliente)
    setMostrarSeccion('editar')
  }

  const handleActualizarCliente = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${clienteSeleccionado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clienteSeleccionado)
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.msg)
        setClientes(clientes.map((c) => (c._id === clienteSeleccionado._id ? clienteSeleccionado : c)))
        setClienteSeleccionado(null)
        setMostrarSeccion('tabla')
      } else {
        alert(data.msg)
      }
    } catch {
      alert('Error al actualizar el cliente')
    }
  }

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este cliente?')
   
    if (!confirmacion) return

    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.msg)
      }

      const data = await res.json()
      alert(data.msg)
      setClientes(clientes.filter((c) => c._id !== id))
    } catch (err) {
      alert(err.message || 'Error al eliminar cliente')
    }
  }

  const handleCrearCliente = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevoCliente.nombre,
          correo: nuevoCliente.correo,
          password: nuevoCliente.password,
          rol: nuevoCliente.rol
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert(data.msg || 'Cliente creado correctamente')
      
        setClientes([...clientes, { ...nuevoCliente, _id: data.cliente._id }])
        setNuevoCliente({ nombre: '', correo: '', password: '', estado: true, rol: 'cliente' })
        setMostrarSeccion('tabla')
      } else {
        alert(data.msg || 'Error al crear el cliente')
      }
    } catch (err) {
      
    }
  }

  return (
    <div className="admin-clientes-page">
      <h2>Gestión de Clientes</h2>

      <div className="toggle-buttons">
        <button
          className={mostrarSeccion === 'tabla' ? 'active' : ''}
          onClick={() => {
            setMostrarSeccion('tabla')
            setClienteSeleccionado(null)
          }}
        >
          Ver Tabla de Clientes
        </button>
        <button
          className={mostrarSeccion === 'formulario' ? 'active' : ''}
          onClick={() => {
            setMostrarSeccion('formulario')
            setClienteSeleccionado(null)
          }}
        >
          Agregar Nuevo Cliente
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {mostrarSeccion === 'formulario' && (
        <div className="cliente-form">
          <h3>Crear Nuevo Cliente</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCrearCliente()
            }}
          >
            <label>Nombre</label>
            <input
              type="text"
              value={nuevoCliente.nombre}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
            />
            <label>Correo</label>
            <input
              type="email"
              value={nuevoCliente.correo}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
            />
            <label>Contraseña</label>
            <input
              type="password"
              value={nuevoCliente.password}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, password: e.target.value })}
            />
            <label>Rol</label>
            <select
              value={nuevoCliente.rol}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, rol: e.target.value })}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="submit">Crear</button>
          </form>
        </div>
      )}

      {mostrarSeccion === 'tabla' && (
        <div className="clientes-table">
          <h3>Lista de Clientes</h3>
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
              {clientes.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.correo}</td>
                  <td>
                    <span className={`estado ${cliente.estado ? 'activo' : 'inactivo'}`}>
                      {cliente.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="edit" onClick={() => handleEditar(cliente._id)}>Editar</button>
                    <button className="delete" onClick={() => handleEliminar(cliente._id)}>Eliminar</button>
                    <button onClick={() => toggleEstado(cliente._id)}>
                      {cliente.estado ? 'Inactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarSeccion === 'editar' && clienteSeleccionado && (
        <div className="cliente-form">
          <h3>Editar Cliente</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleActualizarCliente()
            }}
          >
            <label>Nombre</label>
            <input
              type="text"
              value={clienteSeleccionado.nombre}
              onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, nombre: e.target.value })}
            />
            <label>Correo</label>
            <input
              type="email"
              value={clienteSeleccionado.correo}
              onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, correo: e.target.value })}
            />
            <label>Estado</label>
            <select
              value={clienteSeleccionado.estado ? 'activo' : 'inactivo'}
              onChange={(e) => setClienteSeleccionado({ ...clienteSeleccionado, estado: e.target.value === 'activo' })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <button type="submit" className="submit">Guardar</button>
            <button
        onClick={() => {
          setClienteSeleccionado(null);
          setMostrarSeccion('tabla'); // Cambia la sección activa a la tabla
        }}
        className="delete"
        style={{ marginTop: '1rem' }}
      >
        Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminClientesPage
