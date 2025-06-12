// src/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async ({ correo, password }) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    correo,
    password,
  }, {
    withCredentials: true,
  });
  return response.data;
};
