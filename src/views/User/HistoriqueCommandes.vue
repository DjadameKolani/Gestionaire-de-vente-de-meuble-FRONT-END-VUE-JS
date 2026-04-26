<script setup>
import UtilisateurTopbar from '@/components/Utilisateur/UtilisateurTopbar.vue'
import { ref, onMounted } from 'vue'
import { commandeService } from '../../services/commandeService.js'
import { formatPrix } from '../../utils/formatPrix.js' // ✅ FCFA

const commandes = ref([])
const loading = ref(false)
const erreur = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const username = localStorage.getItem('username')
    commandes.value = await commandeService.mesCommandes(username)
  } catch (err) {
    erreur.value = 'Impossible de charger vos commandes.'
    console.error(err)
  } finally {
    loading.value = false
  }
})

function statutClass(statut) {
  const map = {
    ACCEPTÉE: 'statut-badge acceptee',
    REFUSÉE: 'statut-badge refusee',
    EN_LIVRAISON: 'statut-badge livraison',
    EN_ATTENTE: 'statut-badge attente',
  }
  return map[statut] ?? 'statut-badge attente'
}

function statutLabel(statut) {
  const labels = {
    ACCEPTÉE: '✅ Acceptée',
    REFUSÉE: '❌ Refusée',
    EN_LIVRAISON: '🚚 En livraison',
    EN_ATTENTE: '⏳ En attente',
  }
  return labels[statut] ?? statut
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getImageUrl(produit) {
  if (produit.imageUrl) return `http://localhost:8080${produit.imageUrl}`
  return '/assets/images/product-1.png'
}
</script>

<template>
  <UtilisateurTopbar />

  <section class="commandes-section">
    <div class="container">
      <!-- En-tête -->
      <div class="page-header">
        <h1>Mes commandes</h1>
        <p>Retrouvez ici l'historique de toutes vos commandes</p>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="etat-vide">
        <div class="spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="erreur" class="alerte-erreur">
        {{ erreur }}
      </div>

      <!-- Aucune commande -->
      <div v-else-if="commandes.length === 0" class="etat-vide">
        <div class="etat-icone">🛍️</div>
        <h3>Aucune commande pour le moment</h3>
        <p>Vous n'avez pas encore passé de commande.</p>
        <router-link :to="{ name: 'Shop' }" class="btn-shop"> Découvrir nos produits </router-link>
      </div>

      <!-- Liste des commandes -->
      <div v-else class="commandes-liste">
        <div v-for="commande in commandes" :key="commande.id" class="commande-card">
          <!-- Header commande -->
          <div class="commande-header">
            <div class="commande-info">
              <span class="commande-id">Commande #{{ commande.id }}</span>
              <span class="commande-date">{{ formatDate(commande.dateCommande) }}</span>
            </div>
            <span :class="statutClass(commande.statut)">
              {{ statutLabel(commande.statut) }}
            </span>
          </div>

          <!-- Produits -->
          <div class="commande-body">
            <table class="produits-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix unitaire</th>
                  <th>Quantité</th>
                  <th>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in commande.produits" :key="p.id">
                  <td class="produit-cell">
                    <img :src="getImageUrl(p)" :alt="p.nom" class="produit-img" />
                    <span>{{ p.nom }}</span>
                  </td>
                  <!-- ✅ Prix en FCFA -->
                  <td>{{ formatPrix(p.prix) }}</td>
                  <td>
                    <span class="quantite-badge">{{ p.quantite }}</span>
                  </td>
                  <td class="sous-total">{{ formatPrix(p.prix * p.quantite) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer total -->
          <div class="commande-footer">
            <span>Total de la commande</span>
            <!-- ✅ Total en FCFA -->
            <strong class="total-prix">{{ formatPrix(commande.total) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Section principale ── */
.commandes-section {
  background: #f4f6f9;
  min-height: 100vh;
  padding: 48px 0 80px;
}

/* ── En-tête page ── */
.page-header {
  margin-bottom: 36px;
}
.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
}
.page-header p {
  color: #6b7280;
  font-size: 15px;
}

/* ── État vide / chargement ── */
.etat-vide {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}
.etat-icone {
  font-size: 56px;
  margin-bottom: 16px;
}
.etat-vide h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

/* ── Spinner ── */
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

/* ── Bouton shop ── */
.btn-shop {
  display: inline-block;
  margin-top: 20px;
  background: #42b983;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-shop:hover {
  background: #369f6e;
}

/* ── Alerte erreur ── */
.alerte-erreur {
  background: #fee2e2;
  color: #b91c1c;
  border-left: 4px solid #ef4444;
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 24px;
}

/* ── Carte commande ── */
.commandes-liste {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.commande-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.commande-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* ── Header carte ── */
.commande-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}
.commande-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.commande-id {
  font-weight: 700;
  color: #1a1a2e;
  font-size: 15px;
}
.commande-date {
  font-size: 13px;
  color: #6b7280;
}

/* ── Badges statut ── */
.statut-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}
.acceptee {
  background: #d1fae5;
  color: #065f46;
}
.refusee {
  background: #fee2e2;
  color: #991b1b;
}
.livraison {
  background: #dbeafe;
  color: #1e40af;
}
.attente {
  background: #fef3c7;
  color: #92400e;
}

/* ── Tableau produits ── */
.commande-body {
  padding: 0 24px;
  overflow-x: auto;
}

.produits-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.produits-table thead tr {
  border-bottom: 2px solid #e5e7eb;
}
.produits-table th {
  padding: 14px 12px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  font-weight: 600;
}
.produits-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: middle;
}
.produits-table tbody tr:last-child td {
  border-bottom: none;
}

/* ── Cellule produit ── */
.produit-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.produit-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* ── Quantité ── */
.quantite-badge {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  border-radius: 6px;
  padding: 2px 10px;
  font-weight: 600;
  font-size: 13px;
}

.sous-total {
  font-weight: 600;
  color: #1a1a2e;
}

/* ── Footer total ── */
.commande-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}
.commande-footer span {
  color: #6b7280;
  font-size: 14px;
}
.total-prix {
  font-size: 18px;
  font-weight: 700;
  color: #42b983;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .commande-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .produits-table th:nth-child(2),
  .produits-table td:nth-child(2) {
    display: none;
  }
}
</style>
