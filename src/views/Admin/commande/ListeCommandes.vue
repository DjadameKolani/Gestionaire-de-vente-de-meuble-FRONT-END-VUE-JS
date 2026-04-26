<script setup>
import { ref, onMounted } from 'vue'
import { commandeService } from '../../../services/commandeService.js'

const commandes = ref([])
const loading = ref(false)
const message = ref('')

onMounted(async () => {
  await chargerCommandes()
})

async function chargerCommandes() {
  loading.value = true
  try {
    commandes.value = await commandeService.toutesLesCommandes()
  } catch (err) {
    message.value = 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

async function changerStatut(id, statut) {
  try {
    await commandeService.modifierStatut(id, statut)
    await chargerCommandes() // ← recharger après modification
    message.value = `Commande mise à jour : ${statut}`
  } catch (err) {
    message.value = 'Erreur lors de la mise à jour'
  }
}

async function supprimer(id) {
  if (confirm('Supprimer cette commande ?')) {
    await commandeService.supprimerCommande(id)
    await chargerCommandes()
  }
}

function statutClass(statut) {
  if (statut === 'ACCEPTÉE') return 'badge bg-success'
  if (statut === 'REFUSÉE') return 'badge bg-danger'
  return 'badge bg-warning text-dark'
}
</script>

<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4">Gestion des commandes</h2>

    <div v-if="message" class="alert alert-info">{{ message }}</div>
    <div v-if="loading" class="text-center">Chargement...</div>

    <div v-else>
      <div v-if="commandes.length === 0" class="alert alert-warning">
        Aucune commande pour le moment.
      </div>

      <table v-else class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Produits</th>
            <th>Total</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commande in commandes" :key="commande.id">
            <td>
              <small>{{ commande.id }}</small>
            </td>
            <td>{{ commande.username }}</td>
            <td>
              <ul class="list-unstyled mb-0">
                <li v-for="p in commande.produits" :key="p.id">
                  {{ p.nom }} x{{ p.quantite }} — ${{ p.prix }}
                </li>
              </ul>
            </td>
            <td>
              <strong>${{ commande.total }}</strong>
            </td>
            <td>{{ new Date(commande.dateCommande).toLocaleDateString() }}</td>
            <td>
              <span :class="statutClass(commande.statut)">
                {{ commande.statut }}
              </span>
            </td>
            <td>
              <div class="d-flex gap-2 flex-wrap">
                <button
                  class="btn btn-sm btn-success"
                  @click="changerStatut(commande.id, 'ACCEPTÉE')"
                  :disabled="commande.statut === 'ACCEPTÉE'"
                >
                  ✓ Accepter
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="changerStatut(commande.id, 'REFUSÉE')"
                  :disabled="commande.statut === 'REFUSÉE'"
                >
                  ✗ Refuser
                </button>
                <button
                  class="btn btn-sm btn-warning"
                  @click="changerStatut(commande.id, 'EN_LIVRAISON')"
                >
                  🚚 Livraison
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="supprimer(commande.id)">
                  🗑 Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
