import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import './LoginPage.css'; // Importa el archivo CSS personalizado

function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ correo, password });
      localStorage.setItem('token', data.token);
      navigate('/perfil'); // O redirige según el rol si lo necesitas
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/fotologo.png" alt="Logo" className="login-logo" />
          <h2>Iniciar sesión</h2>
        </div>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            INICIAR SESIÓN
          </button>
        </form>
        <p className="login-footer">
          ¿No tienes una cuenta?{' '}
          <a href="/registro" className="login-link">
            Regístrate
          </a>
          <br />
          <a href="/recuperar" className="login-link">
            ¿Olvidaste tu contraseña?
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
