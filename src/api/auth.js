const API_URL = 'http://localhost:3000/api'

export const login = async ({ correo, password }) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, password })
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.msg || 'Error al iniciar sesión')

    return data
  } catch (error) {
    throw new Error(error.message)
  }
}
