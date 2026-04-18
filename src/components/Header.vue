<template>
  <nav class="custom-navbar navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Furni<span>.</span></router-link>

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
        <!-- Liens de navigation -->
        <ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shop">Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About us</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/services">Services</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/blog">Blog</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">Contact us</router-link>
          </li>
        </ul>

        <!-- Icônes CTA (connexion + panier) -->
        <ul class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-4 align-items-center">
          <li class="nav-item">
            <router-link class="nav-link cta-icon" :to="{ name: 'Connection' }">
              <i class="fas fa-user"></i>
            </router-link>
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
function goToCart() {
  const token = localStorage.getItem('token')
  if (token) {
    router.push({ name: 'Card' }) // ← connecté → page panier
  } else {
    router.push('/connection') // ← pas connecté → page connexion
  }
}
</script>

<style scoped>
.custom-navbar .navbar-brand span {
  color: #f0a500;
}

.cta-icon {
  font-size: 1.2rem;
  padding: 0.4rem 0.6rem;
  transition: color 0.2s;
}

.cta-icon:hover {
  color: #f0a500 !important;
}
</style>
