import { useState, useEffect, useRef } from 'react';
import './EditarPerfilPage.css';
import { Widget } from '@uploadcare/react-widget';

function EditarPerfilPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState('');
  const [mensaje, setMensaje] = useState('');

  const widgetRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/perfil', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNombre(data.nombre);
        setCorreo(data.correo);
        setImagenPerfil(data.imagenPerfil || '');
      });
  }, []);

  const abrirUploadcare = () => {
    if (widgetRef.current) {
      widgetRef.current.openDialog();
    }
  };

 const actualizarPerfil = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:3000/api/perfil', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nombre, correo, imagenPerfil }),
  });

  const data = await res.json();
  setMensaje(data.msg || 'Perfil actualizado');

  if (res.ok) {
   
  }
};


  const cambiarPassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/perfil/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ passwordActual, passwordNuevo }),
    });
    const data = await res.json();
    setMensaje(data.msg || 'Contraseña actualizada');
  };

  return (
    <div className="editar-perfil-page">
      <div className="editar-perfil-container">
        <h2>Editar Perfil</h2>
        {mensaje && <p className="mensaje">{mensaje}</p>}

        {imagenPerfil && <img src={imagenPerfil} alt="Avatar" className="avatar-preview" />}

        <form onSubmit={actualizarPerfil}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />

          {/* Botón personalizado */}
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

          <button type="submit">Actualizar Perfil</button>
          
        </form>

        <form onSubmit={cambiarPassword} style={{ marginTop: '20px' }}>
          <input type="password" placeholder="Contraseña actual" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} />
          <input type="password" placeholder="Nueva contraseña" value={passwordNuevo} onChange={(e) => setPasswordNuevo(e.target.value)} />
          <button type="submit">Cambiar Contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfilPage;
