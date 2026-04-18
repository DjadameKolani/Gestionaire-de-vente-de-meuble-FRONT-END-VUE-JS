<template>
  <div class="page">
    <div class="top-bar">
      <h1>Gestion des utilisateurs</h1>
      <router-link to="/ajouter" class="btn btn-primary">+ Ajouter</router-link>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="lbl">Total</div>
        <div class="val">{{ store.total }}</div>
      </div>
      <div class="stat">
        <div class="lbl">Actifs</div>
        <div class="val green">{{ store.totalActifs }}</div>
      </div>
      <div class="stat">
        <div class="lbl">Inactifs</div>
        <div class="val red">{{ store.totalInactifs }}</div>
      </div>
    </div>

    <input v-model="search" placeholder="Rechercher..." class="search" />

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!filtered.length">
            <td colspan="6" class="empty">Aucun résultat.</td>
          </tr>
          <tr v-for="u in filtered" :key="u.id">
            <td class="muted">{{ u.id }}</td>
            <td>
              <strong>{{ u.nom }}</strong>
            </td>
            <td class="muted">{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td><StatusBadge :statut="u.statut" /></td>
            <td>
              <router-link :to="`/modifier/${u.id}`" class="btn btn-sm btn-blue"
                >Modifier</router-link
              >
              <router-link
                :to="`/supprimer/${u.id}`"
                class="btn btn-sm btn-danger"
                style="margin-left: 6px"
                >Supprimer</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../../stores/userStore'
import StatusBadge from '../../../components/StatusBadge.vue'

export default {
  components: { StatusBadge },
  setup() {
    return { store: useUserStore() }
  },
  data() {
    return { search: '' }
  },
  computed: {
    filtered() {
      const q = this.search.toLowerCase()
      return q
        ? this.store.users.filter(
            (u) =>
              u.nom.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.role.toLowerCase().includes(q),
          )
        : this.store.users
    },
  },
}
</script>

<style scoped>
.page {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
h1 {
  font-size: 22px;
  font-weight: 600;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 1.25rem;
}
.stat {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
}
.lbl {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}
.val {
  font-size: 26px;
  font-weight: 600;
}
.green {
  color: #3b6d11;
}
.red {
  color: #a32d2d;
}
.search {
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  width: 280px;
  margin-bottom: 1rem;
  outline: none;
}
.search:focus {
  border-color: #378add;
}
.table-wrap {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
thead {
  background: #f8fafc;
}
th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #64748b;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
}
td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
}
tr:last-child td {
  border-bottom: none;
}
tr:hover td {
  background: #f8fafc;
}
.muted {
  color: #94a3b8;
}
.empty {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}
.btn {
  display: inline-block;
  padding: 9px 18px;
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
.btn-sm {
  padding: 5px 12px;
  font-size: 13px;
}
.btn-blue {
  background: #e6f1fb;
  color: #185fa5;
  border-color: #b5d4f4;
}
.btn-blue:hover {
  background: #b5d4f4;
}
.btn-danger {
  background: #fcebeb;
  color: #a32d2d;
  border-color: #f7c1c1;
}
.btn-danger:hover {
  background: #f7c1c1;
}
</style>
