<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const produit = ref({ nom: '', description: '', prix: 0, quantite: 0 })
const image = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const currentImage = ref<string | null>(null)
const message = ref('')
const success = ref(false)
const loading = ref(false)
const fetching = ref(true)

const fetchProduit = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    produit.value = {
      nom: data.nom,
      description: data.description,
      prix: data.prix,
      quantite: data.quantite,
    }
    currentImage.value = data.imageUrl || null
  } catch {
    message.value = 'Erreur lors du chargement du produit'
    success.value = false
  } finally {
    fetching.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    image.value = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(target.files[0])
  }
}

const removeImage = () => {
  image.value = null
  imagePreview.value = null
  currentImage.value = null
}

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
    if (image.value) formData.append('image', image.value)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (response.ok) {
      success.value = true
      message.value = 'Produit mis à jour avec succès !'
      setTimeout(() => router.push({ name: 'Listeproduit' }), 1500)
    } else {
      success.value = false
      message.value = 'Erreur lors de la mise à jour'
    }
  } catch {
    success.value = false
    message.value = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduit)
</script>

<template>
  <div class="page-wrapper">
    <!-- Loader plein écran -->
    <div v-if="fetching" class="loader-overlay">
      <div class="spinner"></div>
      <p>Chargement du produit...</p>
    </div>

    <div v-else class="page-content">
      <!-- En-tête -->
      <div class="page-header">
        <div class="header-left">
          <button class="back-btn" @click="router.push({ name: 'Listeproduit' })">← Retour</button>
          <div>
            <h1 class="page-title">Modifier le produit</h1>
            <p class="page-sub">ID : #{{ id }}</p>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="form-card">
        <form @submit.prevent="updateProduit">
          <!-- Sections en 2 colonnes -->
          <div class="two-col">
            <!-- Colonne gauche -->
            <div class="col-main">
              <div class="section-block">
                <h2 class="section-title">Informations générales</h2>

                <div class="field-group">
                  <label>Nom du produit</label>
                  <input
                    v-model="produit.nom"
                    type="text"
                    placeholder="Ex : Chaise scandinave..."
                    required
                  />
                </div>

                <div class="field-group">
                  <label>Description</label>
                  <textarea
                    v-model="produit.description"
                    placeholder="Décrivez le produit en détail..."
                    rows="5"
                    required
                  ></textarea>
                </div>
              </div>

              <div class="section-block">
                <h2 class="section-title">Prix et stock</h2>

                <div class="field-row">
                  <div class="field-group">
                    <label>Prix (FCFA)</label>
                    <div class="input-prefix-wrap">
                      <span class="prefix">₣</span>
                      <input
                        v-model="produit.prix"
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div class="field-group">
                    <label>Quantité en stock</label>
                    <div class="input-prefix-wrap">
                      <span class="prefix">📦</span>
                      <input
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
            </div>

            <!-- Colonne droite : image -->
            <div class="col-side">
              <div class="section-block">
                <h2 class="section-title">Image du produit</h2>

                <!-- Aperçu -->
                <div class="image-box">
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Nouvelle image"
                    class="preview-img"
                  />
                  <img
                    v-else-if="currentImage"
                    :src="`http://localhost:8080${currentImage}`"
                    alt="Image actuelle"
                    class="preview-img"
                  />
                  <div v-else class="no-image">
                    <span class="no-image-icon">🖼️</span>
                    <p>Aucune image sélectionnée</p>
                  </div>

                  <button
                    v-if="imagePreview || currentImage"
                    type="button"
                    class="remove-btn"
                    @click="removeImage"
                  >
                    ✕
                  </button>
                </div>

                <!-- Badge image actuelle -->
                <div v-if="currentImage && !imagePreview" class="current-badge">
                  ✅ Image actuelle conservée
                </div>
                <div v-if="imagePreview" class="current-badge new-badge">
                  🆕 Nouvelle image sélectionnée
                </div>

                <!-- Upload -->
                <label class="upload-zone" for="file-edit">
                  <span class="upload-icon">📁</span>
                  <span class="upload-text">
                    {{ imagePreview ? "Changer l'image" : 'Choisir une image' }}
                  </span>
                  <span class="upload-hint">JPG, PNG, WEBP · Max 5Mo</span>
                  <input
                    id="file-edit"
                    type="file"
                    accept="image/*"
                    class="hidden-input"
                    @change="handleFileUpload"
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Message retour -->
          <div v-if="message" :class="['alert-msg', success ? 'alert-success' : 'alert-error']">
            {{ success ? '✅' : '❌' }} {{ message }}
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="router.push({ name: 'Listeproduit' })">
              Annuler
            </button>
            <button type="submit" class="btn-save" :disabled="loading">
              <span v-if="loading" class="btn-spin"></span>
              <span v-else>💾 Enregistrer les modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Base ── */
.page-wrapper {
  background: #f4f6f9;
  min-height: 100vh;
  padding: 32px;
  font-family: 'Segoe UI', sans-serif;
}

/* ── Loader ── */
.loader-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #6b7280;
  gap: 12px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.back-btn {
  padding: 8px 16px;
  background: white;
  border: 1.5px solid #dde3ef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.2s;
  white-space: nowrap;
}
.back-btn:hover {
  background: #f0f4f8;
  border-color: #42b983;
  color: #42b983;
}
.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}
.page-sub {
  font-size: 13px;
  color: #6b7280;
  margin: 2px 0 0;
}

/* ── Card formulaire ── */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  padding: 32px;
}

/* ── 2 colonnes ── */
.two-col {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  margin-bottom: 24px;
}
.col-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.col-side {
  display: flex;
  flex-direction: column;
}

/* ── Blocs sections ── */
.section-block {
  background: #fafbfc;
  border: 1.5px solid #edf0f7;
  border-radius: 12px;
  padding: 20px;
}
.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #42b983;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8f5ee;
}

/* ── Champs ── */
.field-group {
  margin-bottom: 16px;
}
.field-group:last-child {
  margin-bottom: 0;
}
.field-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}
.field-group input,
.field-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #dde3ef;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a2e;
  background: white;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.field-group input:focus,
.field-group textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.12);
}
.field-group textarea {
  resize: vertical;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Préfixe input */
.input-prefix-wrap {
  position: relative;
}
.prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #9ca3af;
  pointer-events: none;
}
.input-prefix-wrap input {
  padding-left: 34px !important;
}

/* ── Image ── */
.image-box {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f0f4f8;
  border: 2px dashed #dde3ef;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: border-color 0.2s;
}
.image-box:hover {
  border-color: #42b983;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  text-align: center;
  color: #9ca3af;
}
.no-image-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 6px;
}
.no-image p {
  font-size: 13px;
  margin: 0;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition:
    background 0.2s,
    transform 0.15s;
}
.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Badges statut image */
.current-badge {
  font-size: 12px;
  font-weight: 600;
  color: #065f46;
  background: #d1fae5;
  border-radius: 6px;
  padding: 5px 10px;
  margin-bottom: 10px;
  text-align: center;
}
.new-badge {
  color: #1e40af;
  background: #dbeafe;
}

/* Zone upload */
.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px;
  background: #f0f9f4;
  border: 2px dashed #42b983;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
}
.upload-zone:hover {
  background: #e0f4ec;
}
.upload-icon {
  font-size: 22px;
}
.upload-text {
  font-size: 13px;
  font-weight: 700;
  color: #42b983;
}
.upload-hint {
  font-size: 11px;
  color: #9ca3af;
}
.hidden-input {
  display: none;
}

/* ── Message alert ── */
.alert-msg {
  padding: 14px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}
.alert-success {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #42b983;
}
.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  border-left: 4px solid #ef4444;
}

/* ── Actions ── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1.5px solid #f0f4f8;
}
.btn-cancel {
  padding: 10px 24px;
  background: #f5f6fa;
  border: 1.5px solid #dde3ef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 28px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-save:hover:not(:disabled) {
  background: #369f6e;
  transform: scale(1.02);
}
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spin {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px;
  }
  .two-col {
    grid-template-columns: 1fr;
  }
  .field-row {
    grid-template-columns: 1fr;
  }
  .form-actions {
    flex-direction: column;
  }
  .btn-save,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
}
</style>
