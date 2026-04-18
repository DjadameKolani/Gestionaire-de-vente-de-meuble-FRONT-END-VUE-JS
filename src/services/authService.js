import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

export const authService = {
  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data
  },

  async login(credentials) {
    const response = await axios.post(`${API_URL}/login`, credentials)
    // Sauvegarder le token dans localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('username', credentials.username)
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}
