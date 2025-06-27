
# Frontend - OxGym (Sistema Web de Gestión de Planes de Entrenamiento)

Este repositorio contiene el código fuente del **frontend** del sistema web **OxGym**, una plataforma de gestión de planes de entrenamiento personalizada para clientes y administradores de un gimnasio.

Repositorio Frontend:  
📧 **https://github.com/Cristiann-Paredes/back.git**

## 📦 Tecnologías Utilizadas

- **React.js** (con Vite): Framework principal para la construcción de la interfaz de usuario.
- **CSS personalizado**: Estilo modular con enfoque en diseño oscuro y responsivo.
- **Uploadcare**: Carga y visualización de imágenes en los ejercicios.
- **Netlify**: Plataforma de despliegue utilizada para producción.

## 🚀 Funcionalidades Principales

### Rol Cliente
- Registro y confirmación por correo electrónico.
- Login y recuperación de contraseña.
- Visualización de planes asignados.
- Marcar ejercicios como realizados o no realizados.
- Ver estado de membresía y progreso semanal.
- Editar perfil y foto de perfil.

### Rol Administrador
- Login protegido.
- Gestión de clientes (CRUD completo con activación/inactivación).
- Gestión de planes personalizados (nombre, nivel, descripción, ejercicios con imagen/video).
- Asignación de planes a clientes.
- Visualización de progreso por cliente.
- Reinicio semanal de rutinas.
- Control de estado de membresía (vigencia por fecha).

## 🌍 Despliegue en Producción

Este frontend está desplegado en **Netlify** y disponible públicamente en la siguiente URL:

🔗 [https://oxgym-frontend.netlify.app](https://oxgym-frontend.netlify.app)  
_(reemplazar con tu URL real si cambia)_

## 📁 Estructura del Proyecto

```
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── index.html
├── vite.config.js
└── package.json
```

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=https://oxgym-backend.onrender.com/api
VITE_UPLOADCARE_PUBLIC_KEY=tu_clave_publica_uploadcare
```

## ▶️ Scripts

- `npm install`: Instala todas las dependencias.
- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Construye el proyecto para producción.

## ✅ Requisitos Previos

- Node.js (versión 16 o superior recomendada)
- Cuenta en Uploadcare (para carga de imágenes)
- Acceso al backend desplegado (ver repositorio correspondiente)

## 📩 Contacto

Para más información o soporte, puedes contactar al desarrollador del proyecto o consultar la documentación del backend.

---

© 2025 OxGym - Sistema Web de Gestión de Entrenamiento

