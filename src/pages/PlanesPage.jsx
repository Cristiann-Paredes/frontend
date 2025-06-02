import React, { useEffect, useState } from "react";
import axios from "axios";
import './PlanesPage.css';

const API_MIS_PLANES = "http://localhost:3000/api/mis-planes";

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
      planSeleccionado.plan.ejercicios?.forEach((_, idx) => {
        estadoInicial[idx] = { realizado: false, motivo: "" };
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
    } catch (err) {
      setAsignaciones([]);
    }
    setLoading(false);
  };

  const handleRealizadoChange = (idx, checked) => {
    setEjerciciosEstado(prev => ({
      ...prev,
      [idx]: { ...prev[idx], realizado: checked, motivo: checked ? "" : prev[idx].motivo }
    }));
  };

  const handleMotivoChange = (idx, value) => {
    setEjerciciosEstado(prev => ({
      ...prev,
      [idx]: { ...prev[idx], motivo: value }
    }));
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
            {asignaciones.map(asig => (
              <button key={asig._id} className="plan-btn" onClick={() => setPlanSeleccionado(asig)}>
                <span className="plan-nombre">{asig.plan?.nombre}</span>
                <span className="plan-desc">{asig.plan?.descripcion}</span>
                <span className="plan-nivel">Nivel: {asig.plan?.nivel}</span>
                <span className="plan-dia">Día: {asig.plan?.dia}</span>
                <span className="plan-fecha">{asig.fechaFin ? `Hasta: ${asig.fechaFin.slice(0, 10)}` : ""}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const { plan, observaciones, fechaFin } = planSeleccionado;

  return (
    <div className="planes-page">
      <button className="volver-btn" onClick={() => setPlanSeleccionado(null)}>Volver</button>
      <h2>{plan?.nombre}</h2>
      <p><b>Descripción:</b> {plan?.descripcion}</p>
      <p><b>Nivel:</b> {plan?.nivel}</p>
      <p><b>Observaciones:</b> {observaciones}</p>
      <p><b>Día:</b> {plan?.dia}</p>
      <p><b>Fecha fin:</b> {fechaFin ? fechaFin.slice(0, 10) : "Sin definir"}</p>
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
                  onChange={e => handleRealizadoChange(idx, e.target.checked)}
                /> Realizado ✅
              </label>
              {!ejerciciosEstado[idx]?.realizado && (
                <input
                  type="text"
                  placeholder="Motivo si no se realizó"
                  value={ejerciciosEstado[idx]?.motivo || ""}
                  onChange={e => handleMotivoChange(idx, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanesPage;
