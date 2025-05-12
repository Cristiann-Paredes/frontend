import { useEffect, useState } from 'react'

function AdminPlanesPage() {
  const [planes, setPlanes] = useState([])
  const [nombre, setNombre] = useState('')
  const [nivel, setNivel] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:3000/api/planes', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPlanes(data)
        else setError(data.msg || 'Error al cargar planes')
      })
      .catch(() => setError('Error de conexión'))
  }, [])

  const crearPlan = async (e) => {
    e.preventDefault()
    if (!nombre || !nivel || !descripcion) return alert('Todos los campos son obligatorios')

    try {
      const res = await fetch('http://localhost:3000/api/planes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, nivel, descripcion }),
      })
      const data = await res.json()
      if (res.ok) {
        setPlanes([...planes, data])
        setNombre('')
        setNivel('')
        setDescripcion('')
      } else {
        alert(data.msg)
      }
    } catch {
      alert('Error al crear plan')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-500">Gestión de Planes</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={crearPlan} className="bg-zinc-900 p-4 rounded mb-8 w-full max-w-xl">
        <h3 className="text-xl font-semibold mb-4">Crear Nuevo Plan</h3>
        <input
          type="text"
          placeholder="Nombre del plan"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-gray-600"
        />
        <input
          type="text"
          placeholder="Nivel (básico/intermedio/avanzado)"
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 border border-gray-600"
        />
        <textarea
          placeholder="Descripción del plan"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-zinc-800 border border-gray-600"
        ></textarea>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
        >
          Crear Plan
        </button>
      </form>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {planes.map((plan) => (
          <div key={plan._id} className="bg-zinc-800 p-4 rounded shadow">
            <h4 className="text-lg font-bold text-red-400">{plan.nombre}</h4>
            <p className="text-sm text-gray-400 mb-1">Nivel: {plan.nivel}</p>
            <p className="text-sm text-gray-300">{plan.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPlanesPage