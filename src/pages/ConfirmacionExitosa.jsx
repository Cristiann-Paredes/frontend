import { Link } from 'react-router-dom';
import './Confirmacion.css';

function ConfirmacionExitosa() {
  return (
    <div className="confirmacion-container">
      <h1>✅ ¡Cuenta confirmada!</h1>
      <p>Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.</p>
      <Link to="/login " className="confirmacion-btn">Ir a iniciar sesión</Link>
    </div>
  );
}

export default ConfirmacionExitosa;
