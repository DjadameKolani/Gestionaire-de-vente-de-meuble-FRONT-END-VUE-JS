import axios from 'axios'

const API_URL = 'http://localhost:8080/api/commandes'

function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

export const commandeService = {
  async creerCommande(commande) {
    const response = await axios.post(API_URL, commande, {
      headers: getHeaders(),
    })
    return response.data
  },

  async mesCommandes(username) {
    const response = await axios.get(`${API_URL}/mes-commandes/${username}`, {
      headers: getHeaders(),
    })
    return response.data
  },

  async toutesLesCommandes() {
    const response = await axios.get(API_URL, {
      headers: getHeaders(),
    })
    return response.data
  },

  async modifierStatut(id, statut) {
    const response = await axios.put(
      `${API_URL}/${id}/statut?statut=${statut}`,
      {},
      {
        headers: getHeaders(),
      },
    )
    return response.data
  },

  async supprimerCommande(id) {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders(),
    })
    return response.data
  },
}
