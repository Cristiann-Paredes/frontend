import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const API_RECUPERAR = "http://localhost:3000/api/auth/recuperar-password";

function RecuperarPage() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await axios.post(API_RECUPERAR, { correo });
      setMensaje('Si el correo existe, recibirás instrucciones para recuperar tu contraseña.');
      setTimeout(() => navigate('/login'), 4000); // espera s
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al solicitar recuperación');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/fotologo.png" alt="Logo" className="login-logo" />
          <h2>Recuperar contraseña</h2>
        </div>
        {mensaje && <p className="login-exito">{mensaje}</p>}
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">ENVIAR</button>
        </form>
        <p className="login-footer">
          <a href="/login " className="login-link">Volver</a>
        </p>
      </div>
    </div>
  );
}

export default RecuperarPage;