import { Link } from 'react-router-dom';
import './Confirmacion.css'; // puedes reutilizar el mismo estilo

function PasswordActualizada() {
  return (
    <div className="confirmacion-container">
      <h1>🔒 Contraseña actualizada</h1>
      <p>Tu contraseña ha sido cambiada exitosamente.</p>
      <Link to="/login " className="confirmacion-btn">Iniciar sesión</Link>
    </div>
  );
}

export default PasswordActualizada;
