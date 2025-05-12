import { useEffect, useState } from 'react'

function AdminClientesPage() {
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClientes(data)
        } else {
          setError(data.msg || 'Error al cargar clientes')
        }
      })
      .catch(() => setError('Error de conexión'))
  }, [])

  const toggleEstado = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${id}/estado`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      alert(data.msg)
      setClientes(clientes.map((c) => (c._id === id ? { ...c, estado: !c.estado } : c)))
    } catch {
      alert('Error al actualizar estado')
    }
  }

  const handleEditar = (id) => {
    // Redirigir a una página de edición o abrir un modal para editar
    alert(`Editar cliente con ID: ${id}`)
  }

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este cliente?')
    if (!confirmacion) return

    try {
      const res = await fetch(`http://localhost:3000/api/clientes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      alert(data.msg)
      setClientes(clientes.filter((c) => c._id !== id))
    } catch {
      alert('Error al eliminar cliente')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-red-500">Gestión de Clientes</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-300">Nombre</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-300">Correo</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-300">Estado</th>
              <th className="px-4 py-2 text-center font-semibold text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente._id}
                className="border-t border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-2">{cliente.nombre}</td>
                <td className="px-4 py-2">{cliente.correo}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      cliente.estado
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {cliente.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditar(cliente._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(cliente._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => toggleEstado(cliente._id)}
                    className={`px-3 py-1 rounded font-semibold text-white transition-colors ${
                      cliente.estado
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {cliente.estado ? 'Inactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminClientesPage