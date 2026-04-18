import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [
      {
        id: 1,
        nom: 'Alice Martin',
        email: 'alice@exemple.com',
        role: 'Administrateur',
        statut: 'Actif',
      },
      { id: 2, nom: 'Bob Koffi', email: 'bob@exemple.com', role: 'Éditeur', statut: 'Actif' },
      {
        id: 3,
        nom: 'Claire Dupont',
        email: 'claire@exemple.com',
        role: 'Lecteur',
        statut: 'Inactif',
      },
      {
        id: 4,
        nom: 'David Mensah',
        email: 'david@exemple.com',
        role: 'Éditeur',
        statut: 'En attente',
      },
    ],
    nextId: 5,
  }),
  getters: {
    total: (s) => s.users.length,
    totalActifs: (s) => s.users.filter((u) => u.statut === 'Actif').length,
    totalInactifs: (s) => s.users.filter((u) => u.statut === 'Inactif').length,
    getUserById: (s) => (id) => s.users.find((u) => u.id === Number(id)),
  },
  actions: {
    addUser(user) {
      this.users.push({ ...user, id: this.nextId++ })
    },
    updateUser(id, data) {
      const i = this.users.findIndex((u) => u.id === Number(id))
      if (i !== -1) this.users[i] = { ...this.users[i], ...data }
    },
    deleteUser(id) {
      this.users = this.users.filter((u) => u.id !== Number(id))
    },
  },
})
