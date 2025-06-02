// ConfirmarCuentaPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ConfirmarCuentaPage() {
  const { token } = useParams();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmar = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/auth/confirmar/${token}`);
        setMensaje(res.data.msg);
      } catch (err) {
        setError(err.response?.data?.msg || "Error al confirmar la cuenta");
      }
    };
    confirmar();
  }, [token]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Confirmación de cuenta</h2>
        {mensaje && <p className="login-exito">{mensaje}</p>}
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default ConfirmarCuentaPage;
