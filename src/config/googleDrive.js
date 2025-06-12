import { google } from 'googleapis';
import fs from 'fs';

// Cargar credenciales
const auth = new google.auth.GoogleAuth({
  keyFile: 'src/config/oxgym.json', // Ruta a tu JSON de clave
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

// Función para listar archivos de la carpeta
export const listarArchivosDrive = async (folderId) => {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
  });

  return res.data.files.map(file => ({
    nombre: file.name,
    url: `https://drive.google.com/uc?export=view&id=${file.id}`
  }));
};
