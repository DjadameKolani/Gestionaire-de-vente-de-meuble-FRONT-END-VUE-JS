<template>
  <nav
    class="custom-navbar navbar navbar-expand-md navbar-dark bg-dark"
    aria-label="Furni navigation bar"
  >
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'User-dashbord' }"
        >Furni<span>.</span></router-link
      >

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarsFurni"
        aria-controls="navbarsFurni"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsFurni">
        <ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'User-dashbord' }">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Shop' }">Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'About_US' }">About us</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Services' }">Services</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Blog' }">Blog</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Contact_US' }">Contact us</router-link>
          </li>
        </ul>

        <ul
          class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-4 d-flex flex-row align-items-center"
        >
          <!-- User dropdown avec avatar rond -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center gap-2"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="user-avatar">
                {{ userInitial }}
              </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <span class="dropdown-item text-muted" style="font-size: 13px">
                  Connecté en tant que <strong>{{ username }}</strong>
                </span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                  <i class="fa fa-sign-out me-2"></i> Se déconnecter
                </a>
              </li>
            </ul>
          </li>
          <!-- Panier -->
          <li class="nav-item me-2">
            <router-link class="nav-link" :to="{ name: 'Card' }">
              <img src="/assets/images/cart.svg" width="22" height="22" />
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()
const username = ref(localStorage.getItem('username') || 'Utilisateur')

// ← Première lettre en majuscule
const userInitial = computed(() => {
  return username.value.charAt(0).toUpperCase()
})

function handleLogout() {
  authService.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-brand span {
  color: #f0a500;
}

/* ← Style du rond avec la lettre */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #27ef9f, #0db8de);
  color: #1a2226;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-transform: uppercase;
}

.dropdown-menu {
  min-width: 220px;
}
</style>
