<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const utilisateurs = ref([])
const loading = ref(false)
const recherche = ref('')
const deleteConfirm = ref<string | null>(null)
const message = ref('')

const fetchUtilisateurs = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('${import.meta.env.VITE_API_URL}/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    utilisateurs.value = await res.json()
  } catch (e) {
    console.error('Erreur chargement utilisateurs', e)
  } finally {
    loading.value = false
  }
}

const filtres = computed(() => {
  const q = recherche.value.toLowerCase()
  if (!q) return utilisateurs.value
  return utilisateurs.value.filter(
    (u: any) =>
      u.username?.toLowerCase().includes(q) ||
      u.prenom?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q),
  )
})

const stats = computed(() => ({
  total: utilisateurs.value.length,
  admins: utilisateurs.value.filter((u: any) => u.role === 'ROLE_ADMIN').length,
  users: utilisateurs.value.filter((u: any) => u.role === 'ROLE_USER').length,
  experts: utilisateurs.value.filter((u: any) => u.role === 'ROLE_EXPERT').length,
}))

const deleteUser = async (id: string) => {
  try {
    const token = localStorage.getItem('token')
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    deleteConfirm.value = null
    message.value = 'Utilisateur supprimé avec succès'
    setTimeout(() => (message.value = ''), 3000)
    fetchUtilisateurs()
  } catch {
    console.error('Erreur suppression')
  }
}

function nomComplet(u: any) {
  return [u.prenom, u.username].filter(Boolean).join(' ') || u.email || '—'
}

function initiales(u: any) {
  const first = u.prenom?.[0] ?? u.username?.[0] ?? '?'
  const second = u.username?.[0] ?? ''
  return (first + second).toUpperCase()
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    ROLE_ADMIN: 'Admin',
    ROLE_USER: 'Utilisateur',
    ROLE_EXPERT: 'Expert',
  }
  return map[role] ?? role
}

function roleClass(role: string) {
  const map: Record<string, string> = {
    ROLE_ADMIN: 'badge-admin',
    ROLE_USER: 'badge-user',
    ROLE_EXPERT: 'badge-expert',
  }
  return map[role] ?? 'badge-user'
}

onMounted(fetchUtilisateurs)
</script>

<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">👥 Gestion des utilisateurs</h1>
        <p class="page-sub">{{ utilisateurs.length }} utilisateur(s) enregistré(s)</p>
      </div>
      <button class="btn-add" @click="router.push({ name: 'ajouterUtilisateur' })">
        ➕ Ajouter un utilisateur
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <div>
          <div class="stat-val">{{ stats.total }}</div>
          <div class="stat-lbl">Total</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🛡️</div>
        <div>
          <div class="stat-val admin-val">{{ stats.admins }}</div>
          <div class="stat-lbl">Admins</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🙋</div>
        <div>
          <div class="stat-val user-val">{{ stats.users }}</div>
          <div class="stat-lbl">Utilisateurs</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div>
          <div class="stat-val expert-val">{{ stats.experts }}</div>
          <div class="stat-lbl">Experts</div>
        </div>
      </div>
    </div>

    <!-- Message succès -->
    <div v-if="message" class="alerte-succes">✅ {{ message }}</div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-wrap">
        <span>🔍</span>
        <input
          v-model="recherche"
          type="text"
          placeholder="Rechercher par nom, email, rôle..."
          class="search-input"
        />
      </div>
      <span class="result-count">{{ filtres.length }} résultat(s)</span>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="etat-centre">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <!-- Vide -->
    <div v-else-if="filtres.length === 0" class="etat-centre">
      <div style="font-size: 48px">👻</div>
      <h3>Aucun utilisateur trouvé</h3>
      <button class="btn-add mt" @click="router.push({ name: 'ajouterUtilisateur' })">
        ➕ Ajouter un utilisateur
      </button>
    </div>

    <!-- Table -->
    <div v-else class="table-card">
      <table class="user-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Username</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filtres" :key="u.id">
            <!-- Nom -->
            <td>
              <div class="user-cell">
                <div class="avatar">
                  {{ initiales(u) }}
                </div>
                <div>
                  <span class="user-nom">{{ nomComplet(u) }}</span>
                  <span class="user-id">#{{ u.id?.slice(-6) }}</span>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="text-muted">{{ u.email ?? '—' }}</td>

            <!-- Username -->
            <td class="text-muted">{{ u.username ?? '—' }}</td>

            <!-- Rôle -->
            <td>
              <span class="role-badge" :class="roleClass(u.role)">
                {{ roleLabel(u.role) }}
              </span>
            </td>

            <!-- Actions -->
            <td>
              <div class="actions-wrap">
                <button
                  class="btn-edit"
                  @click="router.push({ name: 'editeUtilisateur', params: { id: u.id } })"
                >
                  ✏️ Modifier
                </button>

                <template v-if="deleteConfirm === u.id">
                  <span class="confirm-text">Confirmer ?</span>
                  <button class="btn-yes" @click="deleteUser(u.id)">Oui</button>
                  <button class="btn-no" @click="deleteConfirm = null">Non</button>
                </template>
                <button v-else class="btn-delete" @click="deleteConfirm = u.id">
                  🗑️ Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  background: #f4f6f9;
  min-height: 100vh;
  padding: 32px;
  font-family: 'Segoe UI', sans-serif;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}
.page-sub {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
}
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 22px;
  background: #185fa5;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-add:hover {
  background: #0c447c;
  transform: scale(1.02);
}
.btn-add.mt {
  margin-top: 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.stat-icon {
  font-size: 32px;
}
.stat-val {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
}
.stat-lbl {
  font-size: 13px;
  color: #6b7280;
}
.admin-val {
  color: #185fa5;
}
.user-val {
  color: #42b983;
}
.expert-val {
  color: #ba7517;
}

.alerte-succes {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #42b983;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 20px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1.5px solid #dde3ef;
  border-radius: 10px;
  padding: 10px 16px;
  flex: 1;
  max-width: 420px;
  transition: border-color 0.2s;
}
.search-wrap:focus-within {
  border-color: #185fa5;
}
.search-input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
}
.result-count {
  font-size: 13px;
  color: #6b7280;
}
.etat-centre {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  color: #6b7280;
}
.etat-centre h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 12px 0 6px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #185fa5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.user-table thead tr {
  border-bottom: 2px solid #f0f4f8;
}
.user-table th {
  padding: 14px 18px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  font-weight: 700;
  background: #fafbfc;
}
.user-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}
.user-table tbody tr:last-child td {
  border-bottom: none;
}
.user-table tbody tr:hover {
  background: #fafffe;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #185fa5, #42b983);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
}
.user-nom {
  font-weight: 700;
  color: #1a1a2e;
  display: block;
}
.user-id {
  font-size: 11px;
  color: #9ca3af;
}
.text-muted {
  color: #6b7280;
  font-size: 13px;
}
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.badge-admin {
  background: #dbeafe;
  color: #1e40af;
}
.badge-user {
  background: #d1fae5;
  color: #065f46;
}
.badge-expert {
  background: #fef3c7;
  color: #92400e;
}

.actions-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  background: #e6f1fb;
  color: #185fa5;
  border: 1.5px solid #b5d4f4;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-edit:hover {
  background: #b5d4f4;
}
.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  background: #fee2e2;
  color: #991b1b;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-delete:hover {
  background: #fecaca;
}
.confirm-text {
  font-size: 13px;
  font-weight: 600;
  color: #b91c1c;
}
.btn-yes {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}
.btn-no {
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}

@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .user-table th:nth-child(3),
  .user-table td:nth-child(3) {
    display: none;
  }
}
</style>
