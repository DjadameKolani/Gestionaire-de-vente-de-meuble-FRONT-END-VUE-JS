<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const produits = ref([])

const fetchProduits = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:8080/api/produits', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    produits.value = await res.json()
  } catch (error) {
    console.error('Erreur chargement produits')
  }
}

const deleteProduit = async (id: number) => {
  if (!confirm('Supprimer ce produit ?')) return
  try {
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:8080/api/produits/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    fetchProduits()
  } catch (error) {
    console.error('Erreur suppression')
  }
}

// ✅ Routes corrigées pour correspondre au router
const goToAdd = () => {
  router.push({ name: 'addProduit' })
}

const goToEdit = (id: number) => {
  router.push({ name: 'editProduit', params: { id } })
}

onMounted(fetchProduits)
</script>

<template>
  <div class="container">
    <h2>📦 Liste des Produits</h2>

    <!-- ✅ name correspond exactement à celui du router -->
    <router-link :to="{ name: 'addProduit' }" class="add-btn"> ➕ Ajouter Produit </router-link>

    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Nom</th>
          <th>Description</th>
          <th>Prix</th>
          <th>Quantité</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produit in produits" :key="produit.id">
          <td>
            <img
              v-if="produit.image"
              :src="`http://localhost:8080/uploads/${produit.image}`"
              width="60"
            />
            <span v-else>❌</span>
          </td>
          <td>{{ produit.nom }}</td>
          <td>{{ produit.description }}</td>
          <td>{{ produit.prix }} FCFA</td>
          <td>{{ produit.quantite }}</td>
          <td>
            <button class="edit" @click="goToEdit(produit.id)">✏️</button>
            <button class="delete" @click="deleteProduit(produit.id)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
h2 {
  margin-bottom: 15px;
}
.add-btn {
  display: inline-block;
  margin-bottom: 15px;
  padding: 10px;
  background: #42b983;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background: #f4f4f4;
}
img {
  border-radius: 5px;
}
button {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
.edit {
  background-color: orange;
  color: white;
}
.delete {
  background-color: red;
  color: white;
}
button:hover {
  opacity: 0.8;
}
</style>
