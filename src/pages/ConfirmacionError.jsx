import { Link } from 'react-router-dom';
import './Confirmacion.css';

function ConfirmacionError() {
  return (
    <div className="confirmacion-container">
      <h1>❌ Error al confirmar cuenta</h1>
      <p>El enlace es inválido o la cuenta ya fue confirmada previamente.</p>
      <Link to="/registro" className="confirmacion-btn">Volver a registrarse</Link>
    </div>
  );
}

export default ConfirmacionError;
