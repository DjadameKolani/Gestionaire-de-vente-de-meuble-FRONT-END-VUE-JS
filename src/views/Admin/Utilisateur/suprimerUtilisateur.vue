<template>
  <div class="page">
    <router-link to="/" class="back">← Retour</router-link>
    <h1>Supprimer l'utilisateur</h1>

    <div v-if="!user" class="nf">
      Utilisateur introuvable. <router-link to="/">Retour</router-link>
    </div>

    <div v-else class="card">
      <div class="icon-wrap">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a32d2d"
          stroke-width="2"
          width="26"
          height="26"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </div>
      <h2>Confirmer la suppression</h2>
      <p>
        Vous êtes sur le point de supprimer <strong>{{ user.nom }}</strong
        >. Cette action est <strong>irréversible</strong>.
      </p>

      <div class="info-box">
        <div class="row">
          <span>Email</span><span>{{ user.email }}</span>
        </div>
        <div class="row">
          <span>Rôle</span><span>{{ user.role }}</span>
        </div>
        <div class="row"><span>Statut</span><StatusBadge :statut="user.statut" /></div>
      </div>

      <div class="actions">
        <button class="btn btn-danger" @click="confirm">Oui, supprimer</button>
        <router-link to="/" class="btn">Annuler</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'
import StatusBadge from '../components/StatusBadge.vue'

export default {
  components: { StatusBadge },
  setup() {
    return { store: useUserStore() }
  },
  computed: {
    user() {
      return this.store.getUserById(this.$route.params.id)
    },
  },
  methods: {
    confirm() {
      this.store.deleteUser(this.$route.params.id)
      this.$emit('notify', 'Utilisateur supprimé avec succès.')
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.page {
  padding: 2rem;
  max-width: 480px;
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
  padding: 2rem;
}
.icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fcebeb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
p {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}
.info-box {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 1.5rem;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
}
.row:last-child {
  border-bottom: none;
}
.row span:first-child {
  color: #64748b;
}
.row span:last-child {
  font-weight: 500;
}
.actions {
  display: flex;
  gap: 10px;
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
.btn-danger {
  background: #a32d2d;
  color: #fff;
  border-color: #a32d2d;
}
.btn-danger:hover {
  background: #791f1f;
}
</style>
