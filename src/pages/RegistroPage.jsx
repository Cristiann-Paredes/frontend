import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import './LoginPage.css';

const API_URL = import.meta.env.VITE_API_URL;
const API_REGISTRO = `${API_URL}/auth/registro`;


function RegistroPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNombreChange = e => {
    const valor = e.target.value;
    const soloLetras = valor.replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]/g, '');
    const enMayusculas = soloLetras.toUpperCase();
    setForm({ ...form, nombre: enMayusculas });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setExito('');
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await axios.post(API_REGISTRO, {
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        rol: 'cliente',
      });
      setExito('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error en el registro');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/fotologo.png" alt="Logo" className="login-logo" />
          <h2>Registro</h2>
        </div>
        {error && <p className="login-error">{error}</p>}
        {exito && <p className="login-exito">{exito}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleNombreChange}
            required
            className="login-input"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="confirmar"
            placeholder="Confirmar contraseña"
            value={form.confirmar}
            onChange={handleChange}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">REGISTRARSE</button>
          <p className="login-terminos">
            Al registrarte, aceptas nuestros <div className='terminos'>Términos y condiciones, Política de privacidad.</div> 
          </p>
        </form>
        <p className="login-footer">
          ¿Ya tienes una cuenta? <Link to="/login " className="login-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegistroPage;
