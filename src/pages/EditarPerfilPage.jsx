import { useState, useEffect, useRef } from 'react';
import { Widget } from '@uploadcare/react-widget';
import './EditarPerfilPage.css';

const API_URL = import.meta.env.VITE_API_URL;

function EditarPerfilPage() {
  const [nombre, setNombre] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState('');
  const [mensaje, setMensaje] = useState('');
  const widgetRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNombre(data.nombre || '');
        setImagenPerfil(data.imagenPerfil || '');
      })
      .catch(() => {
        setMensaje('❌ Error al cargar perfil');
      });
  }, []);

  const abrirUploadcare = () => {
    widgetRef.current?.openDialog();
  };

  const actualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, imagenPerfil }),
      });

      const data = await res.json();
      setMensaje(data.msg || 'Perfil actualizado');

      if (res.ok) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setMensaje('❌ Error al actualizar el perfil');
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/perfil/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passwordActual, passwordNuevo }),
      });

      const data = await res.json();
      setMensaje(data.msg || 'Contraseña actualizada');
    } catch {
      setMensaje('❌ Error al actualizar contraseña');
    }
  };

  return (
    <div className="editar-perfil-page">
      <div className="editar-perfil-container">
        <h2>Editar Perfil</h2>
        {mensaje && <p className="mensaje-perfil">{mensaje}</p>}

        {imagenPerfil && (
          <img src={imagenPerfil} alt="Avatar" className="avatar-preview" />
        )}

        <form onSubmit={actualizarPerfil} className="form-perfil">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => {
              const soloLetras = e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');
              setNombre(soloLetras.toUpperCase());
            }}
            required
          />

          <button type="button" onClick={abrirUploadcare} className="btn-uploadcare">
            Subir Imagen de Perfil
          </button>

          <div className="editar-perfil-container-wiget">
            <Widget
              ref={widgetRef}
              publicKey="643ce81cabfea0aa8567"
              onChange={(fileInfo) => setImagenPerfil(fileInfo.cdnUrl)}
              tabs="file camera"
              previewStep
              crop="1:1"
              clearable
              hidden
            />
          </div>

          <button type="submit" className="btn-guardar">
            Actualizar Perfil
          </button>
        </form>

        <form onSubmit={cambiarPassword} className="form-password">
          <h3>Cambiar Contraseña</h3>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={passwordNuevo}
            onChange={(e) => setPasswordNuevo(e.target.value)}
            required
          />
          <button type="submit" className="btn-password">
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfilPage;
