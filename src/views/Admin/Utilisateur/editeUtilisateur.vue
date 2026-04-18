<template>
  <div class="page">
    <router-link to="/" class="back">← Retour</router-link>
    <h1>Modifier l'utilisateur</h1>

    <div v-if="!user" class="nf">
      Utilisateur introuvable. <router-link to="/">Retour</router-link>
    </div>

    <div v-else class="card">
      <div class="avatar-row">
        <div class="avatar">{{ initials }}</div>
        <div>
          <div class="aname">{{ user.nom }}</div>
          <div class="aid">ID #{{ user.id }}</div>
        </div>
      </div>
      <hr />
      <div class="fg">
        <label>Nom complet *</label>
        <input v-model="form.nom" type="text" :class="{ err: errors.nom }" />
        <span v-if="errors.nom" class="emsg">{{ errors.nom }}</span>
      </div>
      <div class="fg">
        <label>Email *</label>
        <input v-model="form.email" type="email" :class="{ err: errors.email }" />
        <span v-if="errors.email" class="emsg">{{ errors.email }}</span>
      </div>
      <div class="fg">
        <label>Rôle</label>
        <select v-model="form.role">
          <option>Administrateur</option>
          <option>Éditeur</option>
          <option>Lecteur</option>
        </select>
      </div>
      <div class="fg">
        <label>Statut</label>
        <select v-model="form.statut">
          <option>Actif</option>
          <option>Inactif</option>
          <option>En attente</option>
        </select>
      </div>
      <div class="actions">
        <button class="btn btn-primary" @click="submit">Enregistrer</button>
        <router-link to="/" class="btn">Annuler</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  setup() {
    return { store: useUserStore() }
  },
  data() {
    return { form: {}, errors: {} }
  },
  computed: {
    user() {
      return this.store.getUserById(this.$route.params.id)
    },
    initials() {
      return (
        this.user?.nom
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || '?'
      )
    },
  },
  mounted() {
    if (this.user) this.form = { ...this.user }
  },
  methods: {
    submit() {
      this.errors = {}
      if (!this.form.nom.trim()) this.errors.nom = 'Le nom est requis.'
      if (!this.form.email.trim()) this.errors.email = "L'email est requis."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email))
        this.errors.email = 'Email invalide.'
      if (Object.keys(this.errors).length) return
      this.store.updateUser(this.$route.params.id, { ...this.form })
      this.$emit('notify', 'Utilisateur modifié avec succès.')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.page {
  padding: 2rem;
  max-width: 560px;
  margin: 0 auto;
}
.back {
  display: inline-block;
  font-size: 13px;
  color: #378add;
  text-decoration: none;
  margin-bottom: 1rem;
  font-weight: 500;
}
.back:hover {
  text-decoration: underline;
}
h1 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.75rem;
}
.avatar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #e6f1fb;
  color: #185fa5;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.aname {
  font-weight: 600;
  font-size: 15px;
}
.aid {
  font-size: 12px;
  color: #94a3b8;
}
hr {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 1.25rem;
}
.fg {
  margin-bottom: 1.1rem;
}
label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 5px;
}
input,
select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
input:focus,
select:focus {
  border-color: #378add;
}
.err {
  border-color: #e24b4a !important;
}
.emsg {
  font-size: 12px;
  color: #a32d2d;
  margin-top: 4px;
  display: block;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 1.5rem;
}
.nf {
  font-size: 14px;
  color: #64748b;
}
.nf a {
  color: #378add;
}
.btn {
  display: inline-block;
  padding: 9px 20px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #1a1a2e;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.15s;
}
.btn:hover {
  background: #f1f5f9;
}
.btn-primary {
  background: #185fa5;
  color: #fff;
  border-color: #185fa5;
}
.btn-primary:hover {
  background: #0c447c;
}
</style>
