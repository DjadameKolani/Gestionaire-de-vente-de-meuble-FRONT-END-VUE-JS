<template>
  <div class="page-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 login-box">
          <div class="login-key">
            <i class="fa fa-user-plus"></i>
          </div>

          <div class="login-title">INSCRIPTION</div>

          <div class="login-form">
            <div v-if="error" class="login-error">{{ error }}</div>
            <div v-if="success" class="login-success">{{ success }}</div>

            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <label class="form-control-label">USERNAME</label>
                <input
                  v-model="form.username"
                  type="text"
                  class="form-control"
                  placeholder="Choisissez un username"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label">PRÉNOM</label>
                <input
                  v-model="form.prenom"
                  type="text"
                  class="form-control"
                  placeholder="Votre prénom"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label">EMAIL</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="Votre email"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label">PASSWORD</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="Choisissez un mot de passe"
                />
              </div>

              <div class="form-group">
                <label class="form-control-label">CONFIRMER PASSWORD</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-control"
                  placeholder="Confirmez le mot de passe"
                />
              </div>

              <div class="loginbttm row">
                <div class="col-6 login-btm login-text">
                  <span v-if="loading" class="loading-text">Inscription...</span>
                </div>
                <div class="col-6 login-btm login-button">
                  <button type="submit" class="btn btn-outline-primary" :disabled="loading">
                    S'INSCRIRE
                  </button>
                </div>
              </div>

              <div class="register-link">
                Déjà un compte ?
                <router-link to="/connection">Se connecter</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'

export default {
  name: 'Inscription',
  data() {
    return {
      form: {
        username: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'ROLE_USER',
      },
      error: '',
      success: '',
      loading: false,
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        await authService.register(this.form)
        this.success = 'Compte créé avec succès !'
        setTimeout(() => this.$router.push('/connection'), 1500)
      } catch (err) {
        this.error = err.response?.data || "Erreur lors de l'inscription"
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.page-bg {
  background: #222d32;
  height: 100vh; /* ← hauteur écran */
  overflow: auto; /* ← scroll uniquement si le formulaire dépasse */
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
}
.login-box {
  margin-top: 50px;
  margin-bottom: 50px;
  background: #1a2226;
  text-align: center;
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  padding-bottom: 20px;
}
.login-key {
  height: 100px;
  font-size: 80px;
  line-height: 100px;
  background: -webkit-linear-gradient(#27ef9f, #0db8de);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.login-title {
  margin-top: 15px;
  font-size: 30px;
  letter-spacing: 2px;
  font-weight: bold;
  color: #ecf0f5;
}
.login-form {
  margin-top: 25px;
  text-align: left;
  padding: 0 25px;
}
.form-group {
  margin-bottom: 25px;
}
.form-control-label {
  font-size: 10px;
  color: #6c6c6c;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 0;
}
.form-control {
  background-color: #1a2226;
  border: none;
  border-bottom: 2px solid #0db8de;
  border-radius: 0;
  font-weight: bold;
  outline: 0;
  padding-left: 0;
  color: #ecf0f5;
  width: 100%;
}
.form-control:focus {
  background-color: #1a2226;
  color: #ecf0f5;
  border-bottom: 2px solid #0db8de;
  box-shadow: none;
  outline: 0;
}
.loginbttm {
  padding: 0;
  margin-top: 10px;
}
.login-btm {
  float: left;
}
.login-text {
  text-align: left;
  padding-left: 0;
  color: #a2a4a4;
  line-height: 38px;
}
.loading-text {
  font-size: 13px;
  color: #0db8de;
}
.login-button {
  text-align: right;
  padding-right: 0;
  margin-bottom: 25px;
}
.btn-outline-primary {
  border-color: #0db8de;
  color: #0db8de;
  border-radius: 0;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}
.btn-outline-primary:hover {
  background-color: #0db8de;
  color: #fff;
}
.login-error {
  color: #e74c3c;
  font-size: 13px;
  margin-bottom: 15px;
  text-align: center;
}
.login-success {
  color: #27ef9f;
  font-size: 13px;
  margin-bottom: 15px;
  text-align: center;
}
.register-link {
  text-align: center;
  margin-top: 15px;
  color: #a2a4a4;
  font-size: 13px;
}
.register-link a {
  color: #0db8de;
  text-decoration: none;
}
.register-link a:hover {
  text-decoration: underline;
}
</style>
