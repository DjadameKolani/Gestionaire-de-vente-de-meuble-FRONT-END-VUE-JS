<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  adresse: '',
  role: 'ROLE_USER',
  password: '',
  confirmPassword: '',
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const message = ref('')
const success = ref(false)

const valider = () => {
  errors.value = {}
  if (!form.value.prenom.trim()) errors.value.prenom = 'Le prénom est requis'
  if (!form.value.nom.trim()) errors.value.nom = 'Le nom est requis'
  if (!form.value.email.trim()) errors.value.email = "L'email est requis"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    errors.value.email = 'Format email invalide'
  if (!form.value.password) errors.value.password = 'Le mot de passe est requis'
  else if (form.value.password.length < 6) errors.value.password = 'Minimum 6 caractères'
  if (form.value.password !== form.value.confirmPassword)
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas'
  return Object.keys(errors.value).length === 0
}

const submit = async () => {
  if (!valider()) return
  loading.value = true
  message.value = ''
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('${import.meta.env.VITE_API_URL}/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nom: form.value.nom,
        prenom: form.value.prenom,
        email: form.value.email,
        telephone: form.value.telephone,
        adresse: form.value.adresse,
        username: form.value.email,
        role: form.value.role,
        password: form.value.password,
        confirmPassword: form.value.confirmPassword,
      }),
    })

    if (res.ok) {
      success.value = true
      message.value = 'Utilisateur ajouté avec succès !'
      setTimeout(() => router.push({ name: 'ListeUtilisateur' }), 1500)
    } else {
      const err = await res.text()
      success.value = false
      message.value = err ?? "Erreur lors de l'ajout"
    }
  } catch {
    success.value = false
    message.value = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="router.push({ name: 'ListeUtilisateur' })">
          ← Retour
        </button>
        <div>
          <h1 class="page-title">Ajouter un utilisateur</h1>
          <p class="page-sub">Créez un nouveau compte utilisateur</p>
        </div>
      </div>
    </div>

    <div class="form-card">
      <form @submit.prevent="submit">
        <div class="two-col">
          <!-- Colonne gauche -->
          <div class="col-main">
            <div class="section-block">
              <h2 class="section-title">Informations personnelles</h2>

              <div class="field-row">
                <div class="field-group">
                  <label>Prénom *</label>
                  <input
                    v-model="form.prenom"
                    type="text"
                    placeholder="Jean"
                    :class="{ 'input-err': errors.prenom }"
                  />
                  <span v-if="errors.prenom" class="err-msg">{{ errors.prenom }}</span>
                </div>
                <div class="field-group">
                  <label>Nom *</label>
                  <input
                    v-model="form.nom"
                    type="text"
                    placeholder="Dupont"
                    :class="{ 'input-err': errors.nom }"
                  />
                  <span v-if="errors.nom" class="err-msg">{{ errors.nom }}</span>
                </div>
              </div>

              <div class="field-group">
                <label>Email *</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="jean@exemple.com"
                  :class="{ 'input-err': errors.email }"
                />
                <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label>Téléphone</label>
                  <input v-model="form.telephone" type="tel" placeholder="+228 90 00 00 00" />
                </div>
                <div class="field-group">
                  <label>Rôle</label>
                  <select v-model="form.role">
                    <option value="ROLE_USER">Utilisateur</option>
                    <option value="ROLE_ADMIN">Administrateur</option>
                    <option value="ROLE_EXPERT">Expert</option>
                  </select>
                </div>
              </div>

              <div class="field-group">
                <label>Adresse</label>
                <input v-model="form.adresse" type="text" placeholder="Lomé, Togo" />
              </div>
            </div>

            <div class="section-block">
              <h2 class="section-title">Sécurité</h2>

              <div class="field-row">
                <div class="field-group">
                  <label>Mot de passe *</label>
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="••••••••"
                    :class="{ 'input-err': errors.password }"
                  />
                  <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
                </div>
                <div class="field-group">
                  <label>Confirmer *</label>
                  <input
                    v-model="form.confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    :class="{ 'input-err': errors.confirmPassword }"
                  />
                  <span v-if="errors.confirmPassword" class="err-msg">
                    {{ errors.confirmPassword }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne droite : aperçu -->
          <div class="col-side">
            <div class="section-block">
              <h2 class="section-title">Aperçu</h2>
              <div class="preview-card">
                <div class="preview-avatar">
                  {{ (form.prenom?.[0] ?? '?') + (form.nom?.[0] ?? '') }}
                </div>
                <div class="preview-nom">{{ form.prenom || 'Prénom' }} {{ form.nom || 'Nom' }}</div>
                <div class="preview-email">{{ form.email || 'email@exemple.com' }}</div>
                <span
                  class="role-badge"
                  :class="{
                    'badge-admin': form.role === 'ROLE_ADMIN',
                    'badge-expert': form.role === 'ROLE_EXPERT',
                    'badge-user': form.role === 'ROLE_USER',
                  }"
                >
                  {{
                    form.role === 'ROLE_ADMIN'
                      ? 'Administrateur'
                      : form.role === 'ROLE_EXPERT'
                        ? 'Expert'
                        : 'Utilisateur'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div v-if="message" :class="['alert-msg', success ? 'alert-success' : 'alert-error']">
          {{ success ? '✅' : '❌' }} {{ message }}
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-cancel"
            @click="router.push({ name: 'ListeUtilisateur' })"
          >
            Annuler
          </button>
          <button type="submit" class="btn-save" :disabled="loading">
            <span v-if="loading" class="btn-spin"></span>
            <span v-else>✅ Enregistrer</span>
          </button>
        </div>
      </form>
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
  align-items: center;
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
}
.back-btn:hover {
  background: #f0f4f8;
  border-color: #185fa5;
  color: #185fa5;
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

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  padding: 32px;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 260px;
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

.section-block {
  background: #fafbfc;
  border: 1.5px solid #edf0f7;
  border-radius: 12px;
  padding: 20px;
}
.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #185fa5;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8f0fb;
}

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
.field-group select {
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
.field-group select:focus {
  outline: none;
  border-color: #185fa5;
  box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.12);
}
.input-err {
  border-color: #ef4444 !important;
}
.err-msg {
  font-size: 12px;
  color: #b91c1c;
  margin-top: 4px;
  display: block;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Aperçu utilisateur */
.preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 16px;
  text-align: center;
}
.preview-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #185fa5, #42b983);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
}
.preview-nom {
  font-weight: 700;
  color: #1a1a2e;
  font-size: 16px;
}
.preview-email {
  font-size: 13px;
  color: #6b7280;
}

.role-badge {
  display: inline-block;
  padding: 4px 14px;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
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
}
.btn-cancel:hover {
  background: #e2e8f0;
}
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 28px;
  background: #185fa5;
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
  background: #0c447c;
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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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
}
</style>
