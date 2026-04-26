<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref<any[]>([])
const loading = ref(true)

const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter((u) => u.role === 'ROLE_ADMIN').length,
  usersCount: users.value.filter((u) => u.role === 'ROLE_USER').length,
  experts: users.value.filter((u) => u.role === 'ROLE_EXPERT').length,
}))

const recentUsers = computed(() => [...users.value].slice(-5).reverse())

const fetchUsers = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      users.value = await res.json()
    }
  } catch {
    console.error('Erreur chargement utilisateurs')
  } finally {
    loading.value = false
    setTimeout(drawCharts, 100)
  }
}

function roleLabel(role: string) {
  const map: Record<string, string> = {
    ROLE_ADMIN: 'Admin',
    ROLE_USER: 'User',
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

function avatarClass(role: string) {
  const map: Record<string, string> = {
    ROLE_ADMIN: 'av-admin',
    ROLE_EXPERT: 'av-expert',
  }
  return map[role] ?? 'av-user'
}

function initiales(u: any) {
  return ((u.prenom || u.username || '?')[0] + (u.nom || u.username || '')[0] || '').toUpperCase()
}

function nomComplet(u: any) {
  return [u.prenom, u.nom || u.username].filter(Boolean).join(' ') || u.email || '—'
}

const ventesData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  current: [520, 480, 610, 590, 720, 680, 750, 690, 810, 760, 840, 0],
  previous: [420, 390, 510, 470, 600, 550, 630, 580, 700, 650, 710, 740],
}

const activity = [
  { color: '#3B6D11', text: 'Nouvel utilisateur enregistré — Marie Dupont', time: 'il y a 5 min' },
  { color: '#185FA5', text: 'Commande #2048 confirmée — 450 000 FCFA', time: 'il y a 22 min' },
  { color: '#BA7517', text: 'Rôle modifié — Kofi Mensah → Expert', time: 'il y a 1h' },
  { color: '#A32D2D', text: 'Commande #2041 annulée — client introuvable', time: 'il y a 2h' },
  { color: '#3B6D11', text: 'Paiement reçu — Facture #F-0189', time: 'il y a 3h' },
]

let chartVentesInstance: any = null
let chartRolesInstance: any = null

function drawCharts() {
  if (!(window as any).Chart) return
  const Chart = (window as any).Chart

  if (chartVentesInstance) chartVentesInstance.destroy()
  if (chartRolesInstance) chartRolesInstance.destroy()

  const cvVentes = document.getElementById('chartVentes') as HTMLCanvasElement
  if (cvVentes) {
    chartVentesInstance = new Chart(cvVentes, {
      type: 'bar',
      data: {
        labels: ventesData.labels,
        datasets: [
          {
            label: '2025',
            data: ventesData.current,
            backgroundColor: '#185FA5',
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: '2024',
            data: ventesData.previous,
            backgroundColor: '#B5D4F4',
            borderRadius: 5,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 }, callback: (v: number) => v + 'k' },
          },
        },
      },
    })
  }

  const total = stats.value.total || 13
  const admins = stats.value.admins || 2
  const usersC = stats.value.usersCount || 8
  const experts = stats.value.experts || 3

  const cvRoles = document.getElementById('chartRoles') as HTMLCanvasElement
  if (cvRoles) {
    chartRolesInstance = new Chart(cvRoles, {
      type: 'doughnut',
      data: {
        labels: ['Admin', 'Utilisateur', 'Expert'],
        datasets: [
          {
            data: [admins, usersC, experts],
            backgroundColor: ['#185FA5', '#3B6D11', '#BA7517'],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) =>
                ` ${ctx.label}: ${ctx.raw} (${Math.round((ctx.raw / total) * 100)}%)`,
            },
          },
        },
      },
    })
  }
}

function loadChartJs() {
  if ((window as any).Chart) {
    drawCharts()
    return
  }
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
  script.onload = () => drawCharts()
  document.head.appendChild(script)
}

onMounted(async () => {
  await fetchUsers()
  loadChartJs()
})
</script>

<template>
  <div class="dash">
    <!-- Header -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Tableau de bord</h1>
        <p class="dash-sub">Gestion commerciale — vue d'ensemble</p>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="fetchUsers">↺ Actualiser</button>
        <button class="btn-primary" @click="router.push({ name: 'ajouterUtilisateur' })">
          ➕ Nouvel utilisateur
        </button>
      </div>
    </div>

    <!-- Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon icon-blue">👤</div>
        <div>
          <div class="metric-val">{{ loading ? '…' : stats.total }}</div>
          <div class="metric-lbl">Utilisateurs total</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-purple">🛡️</div>
        <div>
          <div class="metric-val" style="color: #185fa5">{{ loading ? '…' : stats.admins }}</div>
          <div class="metric-lbl">Admins</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-green">🙋</div>
        <div>
          <div class="metric-val" style="color: #3b6d11">
            {{ loading ? '…' : stats.usersCount }}
          </div>
          <div class="metric-lbl">Utilisateurs</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-amber">⭐</div>
        <div>
          <div class="metric-val" style="color: #ba7517">{{ loading ? '…' : stats.experts }}</div>
          <div class="metric-lbl">Experts</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-teal">📦</div>
        <div>
          <div class="metric-val">124</div>
          <div class="metric-lbl">Ventes ce mois</div>
          <div class="metric-trend up">↑ +12%</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-blue">💰</div>
        <div>
          <div class="metric-val">8.4M</div>
          <div class="metric-lbl">Chiffre d'affaires</div>
          <div class="metric-trend up">↑ +7%</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-red">⏳</div>
        <div>
          <div class="metric-val">18</div>
          <div class="metric-lbl">Commandes en attente</div>
          <div class="metric-trend down">↓ 3 urgentes</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon icon-green">📈</div>
        <div>
          <div class="metric-val">34%</div>
          <div class="metric-lbl">Taux de conversion</div>
          <div class="metric-trend up">↑ +2pts</div>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row">
      <!-- Ventes -->
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">Ventes mensuelles (en milliers FCFA)</span>
          <div class="legend">
            <span class="legend-item"
              ><span class="legend-dot" style="background: #185fa5"></span>2025</span
            >
            <span class="legend-item"
              ><span class="legend-dot" style="background: #b5d4f4"></span>2024</span
            >
          </div>
        </div>
        <div class="canvas-wrap" style="height: 230px">
          <canvas id="chartVentes"></canvas>
        </div>
      </div>

      <!-- Roles -->
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-title">Répartition par rôle</span>
          <div class="legend">
            <span class="legend-item"
              ><span class="legend-dot" style="background: #185fa5"></span>Admin</span
            >
            <span class="legend-item"
              ><span class="legend-dot" style="background: #3b6d11"></span>User</span
            >
            <span class="legend-item"
              ><span class="legend-dot" style="background: #ba7517"></span>Expert</span
            >
          </div>
        </div>
        <div class="canvas-wrap" style="height: 230px">
          <canvas id="chartRoles"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="bottom-row">
      <!-- Utilisateurs récents -->
      <div class="table-card">
        <div class="chart-header">
          <span class="chart-title">Utilisateurs récents</span>
          <button class="btn-link" @click="router.push({ name: 'ListeUtilisateur' })">
            Voir tous →
          </button>
        </div>

        <div v-if="loading" class="etat-centre">
          <div class="spinner"></div>
        </div>

        <div v-else-if="recentUsers.length === 0" class="etat-centre">
          <p style="color: #6b7280; font-size: 13px">Aucun utilisateur trouvé</p>
        </div>

        <div v-else class="user-list">
          <div v-for="u in recentUsers" :key="u.id" class="user-item">
            <div class="avatar" :class="avatarClass(u.role)">{{ initiales(u) }}</div>
            <div class="user-info">
              <div class="user-name">{{ nomComplet(u) }}</div>
              <div class="user-email">{{ u.email }}</div>
            </div>
            <span class="role-badge" :class="roleClass(u.role)">{{ roleLabel(u.role) }}</span>
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div class="table-card">
        <div class="chart-header">
          <span class="chart-title">Activité récente</span>
        </div>
        <div class="activity-list">
          <div v-for="(a, i) in activity" :key="i" class="activity-item">
            <div class="activity-dot" :style="{ background: a.color }"></div>
            <div>
              <div class="activity-text">{{ a.text }}</div>
              <div class="activity-time">{{ a.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash {
  background: #f4f6f9;
  min-height: 100vh;
  padding: 32px;
  font-family: 'Segoe UI', sans-serif;
}

/* Header */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
.dash-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}
.dash-sub {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.btn-refresh {
  padding: 9px 18px;
  background: white;
  border: 1.5px solid #dde3ef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.2s;
}
.btn-refresh:hover {
  border-color: #185fa5;
  color: #185fa5;
}
.btn-primary {
  padding: 10px 20px;
  background: #185fa5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #0c447c;
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.icon-blue {
  background: #e6f1fb;
}
.icon-purple {
  background: #eeedfe;
}
.icon-green {
  background: #eaf3de;
}
.icon-amber {
  background: #faeeda;
}
.icon-teal {
  background: #e1f5ee;
}
.icon-red {
  background: #fcebeb;
}
.metric-val {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1;
}
.metric-lbl {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}
.metric-trend {
  font-size: 11px;
  font-weight: 700;
  margin-top: 3px;
}
.up {
  color: #3b6d11;
}
.down {
  color: #a32d2d;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.chart-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 8px;
}
.chart-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}
.legend {
  display: flex;
  gap: 12px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6b7280;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.canvas-wrap {
  position: relative;
  width: 100%;
}
.canvas-wrap canvas {
  width: 100% !important;
}

/* Bottom row */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.table-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.btn-link {
  background: none;
  border: none;
  color: #185fa5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.btn-link:hover {
  text-decoration: underline;
}

/* Users list */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}
.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
}
.av-user {
  background: #e6f1fb;
  color: #0c447c;
}
.av-admin {
  background: #eeedfe;
  color: #3c3489;
}
.av-expert {
  background: #faeeda;
  color: #633806;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-email {
  font-size: 11px;
  color: #6b7280;
}
.role-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
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

/* Activity */
.activity-list {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}
.activity-text {
  font-size: 13px;
  color: #1a1a2e;
  line-height: 1.5;
}
.activity-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

/* States */
.etat-centre {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #185fa5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .dash {
    padding: 16px;
  }
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
  .charts-row,
  .bottom-row {
    grid-template-columns: 1fr;
  }
}
</style>
