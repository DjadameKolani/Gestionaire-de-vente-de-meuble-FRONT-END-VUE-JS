<!-- src/views/Admin/produit/editProduit.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const id = route.params.id as string

const produit = ref({
  nom: '',
  description: '',
  prix: 0,
  quantite: 0,
})

const image = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const currentImage = ref<string | null>(null)
const message = ref('')
const success = ref(false)
const loading = ref(false)
const fetching = ref(true)

// ─── Chargement du produit existant ────────────────────────────────────────
const fetchProduit = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:8080/api/produits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Produit introuvable')

    const data = await res.json()
    produit.value = {
      nom: data.nom,
      description: data.description,
      prix: data.prix,
      quantite: data.quantite,
    }
    currentImage.value = data.image || null
  } catch (error) {
    message.value = 'Erreur lors du chargement du produit'
    success.value = false
  } finally {
    fetching.value = false
  }
}

// ─── Aperçu image sélectionnée ─────────────────────────────────────────────
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    image.value = target.files[0]
    imagePreview.value = URL.createObjectURL(target.files[0])
  }
}

const removeImage = () => {
  image.value = null
  imagePreview.value = null
  currentImage.value = null
}

// ─── Soumission du formulaire ──────────────────────────────────────────────
const updateProduit = async () => {
  loading.value = true
  message.value = ''

  try {
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('nom', produit.value.nom)
    formData.append('description', produit.value.description)
    formData.append('prix', String(produit.value.prix))
    formData.append('quantite', String(produit.value.quantite))
    if (image.value) {
      formData.append('image', image.value)
    }

    const response = await fetch(`http://localhost:8080/api/produits/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (response.ok) {
      success.value = true
      message.value = '✅ Produit mis à jour avec succès !'
      setTimeout(() => router.push({ name: 'Listeproduit' }), 1500)
    } else {
      success.value = false
      message.value = "❌ Erreur lors de la mise à jour"
    }
  } catch (error) {
    success.value = false
    message.value = '❌ Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push({ name: 'Listeproduit' })

onMounted(fetchProduit)
</script>

<template>
  <div class="edit-page">
    <!-- En-tête -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span> Retour à la liste
      </button>
      <div class="header-title">
        <h1>Modifier le Produit</h1>
        <p class="subtitle">ID : #{{ id }}</p>
      </div>
    </div>

    <!-- Loader pendant la récupération -->
    <div v-if="fetching" class="loader-wrap">
      <div class="spinner"></div>
      <p>Chargement du produit...</p>
    </div>

    <!-- Formulaire principal -->
    <div v-else class="form-card">
      <form @submit.prevent="updateProduit" class="edit-form">

        <!-- Colonne gauche : champs texte -->
        <div class="form-fields">

          <div class="field-group">
            <label for="nom">Nom du produit</label>
            <input
              id="nom"
              v-model="produit.nom"
              type="text"
              placeholder="Ex : Chaise en bois..."
              required
            />
          </div>

          <div class="field-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="produit.description"
              placeholder="Décrivez le produit..."
              rows="4"
              required
            ></textarea>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label for="prix">Prix (FCFA)</label>
              <div class="input-icon-wrap">
                <span class="currency">₣</span>
                <input
                  id="prix"
                  v-model="produit.prix"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div class="field-group">
              <label for="quantite">Quantité</label>
              <div class="input-icon-wrap">
                <span class="currency">📦</span>
                <input
                  id="quantite"
                  v-model="produit.quantite"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne droite : image -->
        <div class="image-section">
          <label>Image du produit</label>

          <!-- Aperçu image -->
          <div class="image-preview-box">
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Aperçu nouvelle image"
              class="preview-img"
            />
            <img
              v-else-if="currentImage"
              :src="`http://localhost:8080/uploads/${currentImage}`"
              alt="Image actuelle"
              class="preview-img"
            />
            <div v-else class="no-image">
              <span>🖼️</span>
              <p>Aucune image</p>
            </div>

            <!-- Bouton supprimer image -->
            <button
              v-if="imagePreview || currentImage"
              type="button"
              class="remove-img-btn"
              @click="removeImage"
            >✕</button>
          </div>

          <!-- Upload -->
          <label class="upload-label" for="file-input">
            <span>📁 Choisir une image</span>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="file-input"
            />
          </label>

          <p class="image-hint">JPG, PNG, WEBP · Max 5Mo</p>
        </div>

        <!-- Boutons d'action -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="goBack">
            Annuler
          </button>
          <button type="submit" class="btn-save" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else>💾 Enregistrer les modifications</span>
          </button>
        </div>

        <!-- Message retour -->
        <p v-if="message" :class="['feedback-msg', success ? 'msg-success' : 'msg-error']">
          {{ message }}
        </p>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* ── Variables ─────────────────────────────────────────────── */
:root {
  --green: #42b983;
  --green-dark: #369f6e;
  --red: #e74c3c;
  --gray-light: #f5f6fa;
  --gray-border: #dde3ef;
  --text: #2c3e50;
  --muted: #7f8c9a;
}

/* ── Page ──────────────────────────────────────────────────── */
.edit-page {
  padding: 28px 32px;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
  color: var(--text, #2c3e50);
}

/* ── Header ────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f0f4f8;
  border: 1px solid #dde3ef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
  transition: background 0.2s;
  white-space: nowrap;
}
.back-btn:hover { background: #e2e8f0; }
.back-icon { font-size: 16px; }

.header-title h1 { margin: 0; font-size: 22px; font-weight: 700; }
.subtitle { margin: 2px 0 0; font-size: 13px; color: #7f8c9a; }

/* ── Loader ─────────────────────────────────────────────────── */
.loader-wrap {
  text-align: center;
  padding: 60px;
  color: #7f8c9a;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #dde3ef;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Card ───────────────────────────────────────────────────── */
.form-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #dde3ef;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  padding: 32px;
}

/* ── Formulaire en 2 colonnes ───────────────────────────────── */
.edit-form {
  display: grid;
  grid-template-columns: 1fr 260px;
  grid-template-rows: auto auto auto;
  gap: 28px;
}

.form-fields { grid-column: 1; grid-row: 1; }
.image-section { grid-column: 2; grid-row: 1; }
.form-actions { grid-column: 1 / -1; grid-row: 2; }
.feedback-msg  { grid-column: 1 / -1; grid-row: 3; }

/* ── Champs ─────────────────────────────────────────────────── */
.field-group {
  margin-bottom: 18px;
}
.field-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #4a5568;
}

.field-group input,
.field-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #dde3ef;
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  background: #fafbfc;
}
.field-group input:focus,
.field-group textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66,185,131,0.15);
  background: #fff;
}
.field-group textarea { resize: vertical; }

/* Ligne prix + quantité */
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.input-icon-wrap {
  position: relative;
}
.input-icon-wrap .currency {
  position: absolute;
  left: 12px; top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #7f8c9a;
  pointer-events: none;
}
.input-icon-wrap input {
  padding-left: 36px !important;
}

/* ── Section Image ──────────────────────────────────────────── */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.image-section > label {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
}

.image-preview-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f5f6fa;
  border: 2px dashed #dde3ef;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-image {
  text-align: center;
  color: #b0bec5;
}
.no-image span { font-size: 36px; }
.no-image p { margin: 4px 0 0; font-size: 13px; }

.remove-img-btn {
  position: absolute;
  top: 8px; right: 8px;
  width: 26px; height: 26px;
  background: rgba(231,76,60,0.85);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 13px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.remove-img-btn:hover { background: #c0392b; }

.upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #f0f9f4;
  border: 1.5px dashed #42b983;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #42b983;
  transition: background 0.2s;
}
.upload-label:hover { background: #e0f4ec; }
.file-input { display: none; }

.image-hint {
  font-size: 11px;
  color: #b0bec5;
  text-align: center;
  margin: 0;
}

/* ── Actions ─────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel {
  padding: 10px 22px;
  background: #f5f6fa;
  border: 1.5px solid #dde3ef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4a5568;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-cancel:hover
