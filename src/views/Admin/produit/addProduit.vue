<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const produit = ref({
  nom: '',
  description: '',
  prix: 0,
  quantite: 0,
})

const image = ref<File | null>(null)
const message = ref('')
const success = ref(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    image.value = target.files[0]
  }
}

const addProduit = async () => {
  try {
    const token = localStorage.getItem('token')

    // ✅ FormData pour envoyer image + données ensemble
    const formData = new FormData()
    formData.append('nom', produit.value.nom)
    formData.append('description', produit.value.description)
    formData.append('prix', String(produit.value.prix))
    formData.append('quantite', String(produit.value.quantite))
    if (image.value) {
      formData.append('image', image.value)
    }

    const response = await fetch('http://localhost:8080/api/produits', {
      method: 'POST',
      headers: {
        // ✅ Ne pas mettre Content-Type manuellement avec FormData
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (response.ok) {
      success.value = true
      message.value = 'Produit ajouté avec succès !'
      // ✅ Réinitialisation complète incluant image
      produit.value = { nom: '', description: '', prix: 0, quantite: 0 }
      image.value = null
      // ✅ Redirection vers la liste après ajout
      setTimeout(() => router.push({ name: 'Listeproduit' }), 1500)
    } else {
      success.value = false
      message.value = "Erreur lors de l'ajout du produit"
    }
  } catch (error) {
    success.value = false
    message.value = 'Erreur de connexion au serveur'
  }
}
</script>

<template>
  <div class="addProduit">
    <h2>Ajouter un Produit</h2>

    <form @submit.prevent="addProduit">
      <div>
        <label>Nom du produit</label>
        <input v-model="produit.nom" type="text" placeholder="Nom du produit" required />
      </div>
      <div>
        <label>Description</label>
        <textarea v-model="produit.description" placeholder="Description" required></textarea>
      </div>
      <div>
        <label>Prix</label>
        <input v-model="produit.prix" type="number" placeholder="Prix" required />
      </div>
      <div>
        <label>Quantité</label>
        <input v-model="produit.quantite" type="number" placeholder="Quantité" required />
      </div>
      <div>
        <label>Image</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>
      <button type="submit">Ajouter</button>
    </form>

    <p v-if="message" :class="success ? 'success' : 'error'">{{ message }}</p>
  </div>
</template>

<style scoped>
.addProduit {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}
form div {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
button:hover {
  background-color: #369f6e;
}
.success {
  color: green;
  margin-top: 10px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
