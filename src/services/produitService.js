import axios from 'axios'

const API_URL = 'http://localhost:8080/api/produits'

function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

export const produitService = {
  // ← Sans token — accessible à tous
  async getTousProduits() {
    const response = await axios.get(API_URL)
    return response.data
  },

  // ← Avec token — admin uniquement
  async ajouterProduit(produit) {
    const response = await axios.post(API_URL, produit, {
      headers: getHeaders(),
    })
    return response.data
  },

  async modifierProduit(id, produit) {
    const response = await axios.put(`${API_URL}/${id}`, produit, {
      headers: getHeaders(),
    })
    return response.data
  },

  async supprimerProduit(id) {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    })
    return response.data
  },
}
