<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrix } from '../../../utils/formatPrix.js'

const router = useRouter()
const produits = ref([])
const loading = ref(false)
const recherche = ref('')
const deleteConfirm = ref<string | null>(null) // id du produit à confirmer

const produitsFiltres = computed(() => {
  if (!recherche.value) return produits.value
  return produits.value.filter((p: any) =>
    p.nom.toLowerCase().includes(recherche.value.toLowerCase()),
  )
})

const fetchProduits = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/produits', {
      headers: { Authorization: `Bearer ${token}` },
    })
    produits.value = await res.json()
  } catch {
    console.error('Erreur chargement produits')
  } finally {
    loading.value = false
  }
}

const deleteProduit = async (id: string) => {
  try {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:8080/api/produits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    deleteConfirm.value = null
    fetchProduits()
  } catch {
    console.error('Erreur suppression')
  }
}

function getImageUrl(produit: any) {
  if (produit.imageUrl) return `http://localhost:8080${produit.imageUrl}`
  return null
}

onMounted(fetchProduits)
</script>

<template>
  <div class="page-wrapper">
    <!-- En-tête -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📦 Gestion des produits</h1>
        <p class="page-sub">{{ produits.length }} produit(s) au total</p>
      </div>
      <button class="btn-add" @click="router.push({ name: 'addProduit' })">
        ➕ Ajouter un produit
      </button>
    </div>

    <!-- Barre de recherche -->
    <div class="toolbar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="recherche"
          type="text"
          placeholder="Rechercher un produit..."
          class="search-input"
        />
      </div>
      <span class="result-count"> {{ produitsFiltres.length }} résultat(s) </span>
    </div>

    <!-- Chargement -->
    <div v-if="loading" class="etat-centre">
      <div class="spinner"></div>
      <p>Chargement des produits...</p>
    </div>

    <!-- Aucun produit -->
    <div v-else-if="produitsFiltres.length === 0" class="etat-centre">
      <div style="font-size: 48px">📭</div>
      <h3>Aucun produit trouvé</h3>
      <p>Ajoutez votre premier produit ou modifiez la recherche</p>
      <button class="btn-add mt" @click="router.push({ name: 'addProduit' })">
        ➕ Ajouter un produit
      </button>
    </div>

    <!-- Table -->
    <div v-else class="table-card">
      <table class="prod-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produit in produitsFiltres" :key="produit.id">
            <!-- Image -->
            <td>
              <div class="img-wrap">
                <img
                  v-if="getImageUrl(produit)"
                  :src="getImageUrl(produit)"
                  :alt="produit.nom"
                  class="prod-img"
                />
                <div v-else class="no-img">🖼️</div>
              </div>
            </td>

            <!-- Nom -->
            <td>
              <span class="prod-nom">{{ produit.nom }}</span>
            </td>

            <!-- Description -->
            <td>
              <span class="prod-desc">{{ produit.description }}</span>
            </td>

            <!-- Prix -->
            <td>
              <span class="prod-prix">{{ formatPrix(produit.prix) }}</span>
            </td>

            <!-- Stock -->
            <td>
              <span class="stock-badge" :class="produit.quantite > 0 ? 'stock-ok' : 'stock-zero'">
                {{ produit.quantite > 0 ? produit.quantite + ' en stock' : 'Rupture' }}
              </span>
            </td>

            <!-- Actions -->
            <td>
              <div class="actions-wrap">
                <button
                  class="btn-edit"
                  @click="router.push({ name: 'editProduit', params: { id: produit.id } })"
                  title="Modifier"
                >
                  ✏️ Modifier
                </button>

                <!-- Bouton supprimer avec confirmation inline -->
                <template v-if="deleteConfirm === produit.id">
                  <span class="confirm-text">Confirmer ?</span>
                  <button class="btn-confirm-yes" @click="deleteProduit(produit.id)">Oui</button>
                  <button class="btn-confirm-no" @click="deleteConfirm = null">Non</button>
                </template>
                <button
                  v-else
                  class="btn-delete"
                  @click="deleteConfirm = produit.id"
                  title="Supprimer"
                >
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

/* ── Header ── */
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

/* ── Bouton ajouter ── */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 22px;
  background: #42b983;
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
  background: #369f6e;
  transform: scale(1.02);
}
.btn-add.mt {
  margin-top: 16px;
}

/* ── Toolbar ── */
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
  max-width: 400px;
  transition: border-color 0.2s;
}
.search-wrap:focus-within {
  border-color: #42b983;
}
.search-icon {
  font-size: 15px;
}
.search-input {
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  color: #1a1a2e;
}
.result-count {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

/* ── État vide / chargement ── */
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
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Table ── */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.prod-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.prod-table thead tr {
  border-bottom: 2px solid #f0f4f8;
}
.prod-table th {
  padding: 14px 18px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  font-weight: 700;
  background: #fafbfc;
}
.prod-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  color: #374151;
}
.prod-table tbody tr:last-child td {
  border-bottom: none;
}
.prod-table tbody tr:hover {
  background: #fafffe;
}

/* ── Image ── */
.img-wrap {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}
.prod-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-img {
  font-size: 22px;
  color: #d1d5db;
}

/* ── Texte ── */
.prod-nom {
  font-weight: 700;
  color: #1a1a2e;
}
.prod-desc {
  color: #6b7280;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 200px;
}
.prod-prix {
  font-weight: 700;
  color: #42b983;
  font-size: 15px;
}

/* ── Stock badge ── */
.stock-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.stock-ok {
  background: #d1fae5;
  color: #065f46;
}
.stock-zero {
  background: #fee2e2;
  color: #991b1b;
}

/* ── Actions ── */
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
  background: #fef3c7;
  color: #92400e;
  border: 1.5px solid #fcd34d;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-edit:hover {
  background: #fde68a;
  transform: scale(1.03);
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
  transform: scale(1.03);
}

/* Confirmation inline */
.confirm-text {
  font-size: 13px;
  font-weight: 600;
  color: #b91c1c;
}
.btn-confirm-yes {
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}
.btn-confirm-yes:hover {
  background: #dc2626;
}
.btn-confirm-no {
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}
.btn-confirm-no:hover {
  background: #e5e7eb;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .prod-table th:nth-child(3),
  .prod-table td:nth-child(3) {
    display: none;
  }
}
</style>
