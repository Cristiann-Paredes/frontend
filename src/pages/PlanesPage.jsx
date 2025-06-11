import React, { useEffect, useState } from "react";
import axios from "axios";
import './PlanesPage.css';

const API_URL = import.meta.env.VITE_API_URL;
const API_MIS_PLANES = `${API_URL}/mis-planes`;
const OPCIONES_MOTIVO = ['Lesión', 'Falta de tiempo', 'No entendí el ejercicio', 'Otro'];

const PlanesPage = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [ejerciciosEstado, setEjerciciosEstado] = useState({});

  useEffect(() => {
    fetchMisPlanes();
  }, []);

  useEffect(() => {
    if (planSeleccionado) {
      const estadoInicial = {};
      const estadoArray = Array.isArray(planSeleccionado.estadoEjercicios)
        ? planSeleccionado.estadoEjercicios
        : [];

      estadoArray.forEach((estado, idx) => {
        estadoInicial[idx] = {
          realizado: estado?.realizado || false,
          motivo: estado?.motivo || ''
        };
      });

      setEjerciciosEstado(estadoInicial);
    }
  }, [planSeleccionado]);

  const fetchMisPlanes = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.get(API_MIS_PLANES, config);
      setAsignaciones(res.data);
    } catch {
      setAsignaciones([]);
    }
    setLoading(false);
  };

  if (!planSeleccionado) {
    return (
      <div className="planes-page">
        <h2>Mis Planes Asignados</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : asignaciones.length === 0 ? (
          <p>No tienes planes asignados.</p>
        ) : (
          <div className="planes-list">
            {asignaciones.map(asig => {
              const total = asig.plan?.ejercicios?.length || 0;
              const realizados = Array.isArray(asig.estadoEjercicios)
                ? asig.estadoEjercicios.filter(e => e?.realizado === true).length
                : 0;
              const completado = total && realizados / total >= 0.5;

              return (
                <button
                  key={asig._id}
                  className={`plan-btn ${completado ? 'plan-completado' : ''}`}
                  onClick={() => setPlanSeleccionado(asig)}
                >
                  <span className="plan-nombre">{asig.plan?.nombre}</span>
                  <span className="descripcion"> {asig.plan?.descripcion || 'Sin descripción'} </span><br />
                  <span className="plan-nivel">Nivel: {asig.plan?.nivel}</span> <br />
                  <span className="plan-observaciones">{asig.observaciones?.trim() || 'Sin observaciones'}</span>
                  {completado && <span className="check-icon">✔</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const { plan, observaciones } = planSeleccionado;

  return (
    <div className="planes-page">
      <div className="planes-detalle-content">
        <h2>{plan?.nombre}</h2>
        <p><b>Descripción:</b> {plan?.descripcion || 'Sin descripción'}</p>
        <p><b>Nivel:</b> {plan?.nivel}</p>
        <p><b>Observaciones:</b> {observaciones || 'Sin observaciones'}</p>
        <h3>Ejercicios</h3>

        <div className="ejercicios-grid">
          {plan.ejercicios?.map((ej, idx) => (
            <div key={idx} className="ejercicio-card">
              {ej.imagenURL && <img src={ej.imagenURL} alt={ej.nombre} className="ejercicio-img" />}
              <div className="ejercicio-info">
                <h4>{ej.nombre}</h4>
                <p>{ej.repeticiones}</p>
                <label>
                  <input
                    type="checkbox"
                    checked={ejerciciosEstado[idx]?.realizado || false}
                    onChange={async (e) => {
                      const checked = e.target.checked;
                      setEjerciciosEstado(prev => ({
                        ...prev,
                        [idx]: { ...prev[idx], realizado: checked, motivo: checked ? '' : prev[idx]?.motivo || '' }
                      }));
                      await axios.patch(`${API_URL}/asignaciones/${planSeleccionado._id}/ejercicio`, {
                        idx,
                        realizado: checked,
                        motivo: checked ? '' : ejerciciosEstado[idx]?.motivo || ''
                      }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      });
                    }}
                  /> Realizado ✅
                </label>
                {!ejerciciosEstado[idx]?.realizado && (
                  <select
                    value={ejerciciosEstado[idx]?.motivo || ''}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setEjerciciosEstado(prev => ({
                        ...prev,
                        [idx]: { ...prev[idx], motivo: value }
                      }));
                      await axios.patch(`${API_URL}/asignaciones/${planSeleccionado._id}/ejercicio`, {
                        idx,
                        realizado: false,
                        motivo: value
                      }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      });
                    }}
                  >
                    <option value="">Motivo si no se realizó</option>
                    {OPCIONES_MOTIVO.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="volver-container">
        <button
          className="volver-btn"
          onClick={async () => {
            await fetchMisPlanes();
            setPlanSeleccionado(null);
          }}
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default PlanesPage;
