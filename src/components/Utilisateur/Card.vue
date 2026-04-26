<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UtilisateurTopbar from '@/components/Utilisateur/UtilisateurTopbar.vue' // ✅ import manquant
import { commandeService } from '../../services/commandeService.js'
import { formatPrix } from '../../utils/formatPrix.js'

const router = useRouter()
const panier = ref([])
const loading = ref(false)
const message = ref('')
const erreur = ref('')

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/connection')
    return
  }
  panier.value = JSON.parse(localStorage.getItem('panier') || '[]')
})

const totalPanier = computed(() => {
  return panier.value.reduce((total, item) => total + item.prix * item.quantite, 0)
})

async function commander() {
  loading.value = true
  message.value = ''
  erreur.value = ''
  try {
    const commande = {
      username: localStorage.getItem('username'),
      produits: panier.value,
      total: totalPanier.value,
    }
    await commandeService.creerCommande(commande)
    localStorage.removeItem('panier')
    panier.value = []
    message.value = 'Commande passée avec succès !'
    setTimeout(() => router.push({ name: 'Shop' }), 2000)
  } catch (err) {
    erreur.value = 'Erreur lors de la commande. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

function augmenter(item) {
  if (item.quantite >= item.quantiteDisponible) {
    erreur.value = `Stock maximum atteint pour "${item.nom}" (${item.quantiteDisponible} disponible)`
    return
  }
  erreur.value = ''
  item.quantite += 1
  sauvegarder()
}

function diminuer(item) {
  erreur.value = ''
  if (item.quantite > 1) {
    item.quantite -= 1
    sauvegarder()
  } else {
    supprimer(item.id)
  }
}

function supprimer(id) {
  panier.value = panier.value.filter((p) => p.id !== id)
  sauvegarder()
}

function sauvegarder() {
  localStorage.setItem('panier', JSON.stringify(panier.value))
}
</script>

<template>
  <!-- ✅ Topbar ajouté -->
  <UtilisateurTopbar />

  <section class="panier-section">
    <div class="container">
      <!-- En-tête page -->
      <div class="panier-header">
        <h1>🛒 Mon Panier</h1>
        <p>Vérifiez vos articles avant de commander</p>
      </div>

      <!-- Alertes -->
      <div v-if="message" class="alerte-succes">✅ {{ message }}</div>
      <div v-if="erreur" class="alerte-erreur">⚠️ {{ erreur }}</div>

      <!-- Panier vide -->
      <div v-if="panier.length === 0" class="panier-vide">
        <div class="panier-vide-icone">🛍️</div>
        <h3>Votre panier est vide</h3>
        <p>Ajoutez des produits pour commencer vos achats</p>
        <router-link :to="{ name: 'Shop' }" class="btn-continuer">
          Continuer mes achats
        </router-link>
      </div>

      <!-- Tableau panier -->
      <div v-else class="panier-contenu">
        <div class="table-wrap">
          <table class="panier-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Sous-total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in panier" :key="item.id">
                <!-- Produit -->
                <td>
                  <div class="produit-cell">
                    <img
                      :src="
                        item.imageUrl
                          ? `http://localhost:8080${item.imageUrl}`
                          : '/assets/images/product-1.png'
                      "
                      :alt="item.nom"
                      class="produit-img"
                    />
                    <div>
                      <span class="produit-nom">{{ item.nom }}</span>
                      <small class="stock-info">
                        Stock disponible : {{ item.quantiteDisponible }}
                      </small>
                    </div>
                  </div>
                </td>

                <!-- Prix unitaire -->
                <td class="prix-cell">{{ formatPrix(item.prix) }}</td>

                <!-- Quantité -->
                <td>
                  <div class="quantite-control">
                    <button class="qty-btn" @click="diminuer(item)">−</button>
                    <span class="qty-valeur">{{ item.quantite }}</span>
                    <button
                      class="qty-btn"
                      @click="augmenter(item)"
                      :disabled="item.quantite >= item.quantiteDisponible"
                    >
                      +
                    </button>
                  </div>
                </td>

                <!-- Sous-total -->
                <td class="sous-total-cell">
                  {{ formatPrix(item.prix * item.quantite) }}
                </td>

                <!-- ✅ Bouton supprimer rouge lisible -->
                <td>
                  <button class="btn-supprimer" @click="supprimer(item.id)">🗑️ Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Récapitulatif -->
        <div class="panier-recap">
          <router-link :to="{ name: 'Shop' }" class="btn-retour">
            ← Continuer mes achats
          </router-link>

          <div class="recap-total">
            <div class="total-ligne">
              <span>Sous-total</span>
              <span>{{ formatPrix(totalPanier) }}</span>
            </div>
            <div class="total-ligne">
              <span>Livraison</span>
              <span class="gratuit">Gratuite</span>
            </div>
            <div class="total-ligne total-final">
              <span>Total</span>
              <strong>{{ formatPrix(totalPanier) }}</strong>
            </div>
            <button class="btn-commander" @click="commander" :disabled="loading">
              {{ loading ? '⏳ Commande en cours...' : '✅ Passer la commande' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Section ── */
.panier-section {
  background: #f4f6f9;
  min-height: 100vh;
  padding: 48px 0 80px;
}

/* ── En-tête ── */
.panier-header {
  margin-bottom: 32px;
}
.panier-header h1 {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 4px;
}
.panier-header p {
  color: #6b7280;
  font-size: 15px;
}

/* ── Alertes ── */
.alerte-succes {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #42b983;
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
}
.alerte-erreur {
  background: #fee2e2;
  color: #b91c1c;
  border-left: 4px solid #ef4444;
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
}

/* ── Panier vide ── */
.panier-vide {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
}
.panier-vide-icone {
  font-size: 56px;
  margin-bottom: 16px;
}
.panier-vide h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}
.panier-vide p {
  color: #6b7280;
  margin-bottom: 24px;
}
.btn-continuer {
  display: inline-block;
  background: #42b983;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  transition: background 0.2s;
}
.btn-continuer:hover {
  background: #369f6e;
}

/* ── Table ── */
.table-wrap {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  overflow-x: auto;
  margin-bottom: 24px;
}
.panier-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.panier-table thead tr {
  border-bottom: 2px solid #e5e7eb;
}
.panier-table th {
  padding: 16px 20px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  font-weight: 700;
}
.panier-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  color: #374151;
}
.panier-table tbody tr:last-child td {
  border-bottom: none;
}
.panier-table tbody tr:hover {
  background: #fafafa;
}

/* ── Cellule produit ── */
.produit-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}
.produit-img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}
.produit-nom {
  font-weight: 700;
  color: #1a1a2e;
  display: block;
  margin-bottom: 4px;
}
.stock-info {
  color: #6b7280;
  font-size: 12px;
}

/* ── Prix ── */
.prix-cell {
  font-weight: 600;
  color: #374151;
}
.sous-total-cell {
  font-weight: 800;
  color: #42b983;
  font-size: 15px;
}

/* ── Contrôle quantité ── */
.quantite-control {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.qty-btn {
  background: #f9fafb;
  border: none;
  padding: 6px 14px;
  font-size: 18px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}
.qty-btn:hover:not(:disabled) {
  background: #e5e7eb;
}
.qty-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.qty-valeur {
  padding: 6px 14px;
  font-weight: 700;
  font-size: 15px;
  color: #1a1a2e;
  min-width: 36px;
  text-align: center;
  border-left: 1.5px solid #e5e7eb;
  border-right: 1.5px solid #e5e7eb;
}

/* ✅ Bouton supprimer — rouge lisible */
.btn-supprimer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
  white-space: nowrap;
}
.btn-supprimer:hover {
  background: #dc2626;
  transform: scale(1.04);
}

/* ── Récapitulatif ── */
.panier-recap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}
.btn-retour {
  color: #42b983;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  padding-top: 8px;
}
.btn-retour:hover {
  text-decoration: underline;
}

.recap-total {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  padding: 24px 28px;
  min-width: 300px;
}
.total-ligne {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 15px;
  color: #374151;
}
.total-ligne:last-of-type {
  border-bottom: none;
}
.gratuit {
  color: #42b983;
  font-weight: 600;
}
.total-final {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  padding-top: 14px;
  margin-top: 4px;
  border-top: 2px solid #e5e7eb !important;
}
.total-final strong {
  color: #42b983;
  font-size: 20px;
}

.btn-commander {
  width: 100%;
  margin-top: 20px;
  background: #42b983;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-commander:hover:not(:disabled) {
  background: #369f6e;
  transform: scale(1.02);
}
.btn-commander:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .panier-recap {
    flex-direction: column;
  }
  .recap-total {
    width: 100%;
  }
  .panier-table th:nth-child(2),
  .panier-table td:nth-child(2) {
    display: none;
  }
}
</style>
