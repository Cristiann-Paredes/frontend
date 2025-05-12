// 📁 src/pages/PlanesPage.jsx
import { useEffect, useState } from 'react'

function PlanesPage() {
  const [planes, setPlanes] = useState([])
  const [error, setError] = useState('')
  const [progreso, setProgreso] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No autorizado')
      return
    }

    fetch('http://localhost:3000/api/mis-planes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlanes(data)
          const progresosIniciales = {}
          data.forEach(p => {
            progresosIniciales[p._id] = {} // cada ejercicio = false
            p.plan.ejercicios.forEach((e, i) => {
              progresosIniciales[p._id][i] = false
            })
          })
          setProgreso(progresosIniciales)
        } else {
          setError(data.msg || 'Error al cargar planes')
        }
      })
      .catch(() => setError('Error al conectarse con el servidor'))
  }, [])

  const marcarEjercicio = (planId, index, completado) => {
    setProgreso(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [index]: completado
      }
    }))
  }

  if (error) return <p className="text-red-600 p-4">{error}</p>
  if (!planes.length) return <p className="p-4">No tienes planes asignados.</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Mis Planes de Entrenamiento</h2>
      <div className="grid gap-6">
        {planes.map((asignacion) => (
          <div key={asignacion._id} className="border border-gray-300 rounded-lg shadow-lg p-5 bg-white">
            <h3 className="text-xl font-semibold text-blue-600">{asignacion.plan.nombre}</h3>
            <p className="text-gray-700 mb-1">{asignacion.plan.descripcion}</p>
            <p className="text-sm text-gray-500 mb-3"><strong>Nivel:</strong> {asignacion.plan.nivel}</p>
            <div className="space-y-3">
              {asignacion.plan.ejercicios.map((ej, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-md border">
                  <p className="font-medium flex justify-between items-center">
                    {ej.nombre} — <span className="text-gray-700">{ej.repeticiones}</span>
                    <select
                      className="ml-4 px-2 py-1 border border-gray-300 rounded"
                      value={progreso[asignacion._id]?.[i] ? 'completado' : 'pendiente'}
                      onChange={(e) => marcarEjercicio(asignacion._id, i, e.target.value === 'completado')}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="completado">Completado</option>
                    </select>
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 mt-2">
                    {ej.videoURL && (
                      <a
                        href={ej.videoURL}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        Ver video
                      </a>
                    )}
                    {ej.imagenURL && (
                      <img
                        src={ej.imagenURL}
                        alt={ej.nombre}
                        className="w-full md:w-48 rounded"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlanesPage
