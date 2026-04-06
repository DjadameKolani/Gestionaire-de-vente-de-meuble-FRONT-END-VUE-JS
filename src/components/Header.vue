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
        <ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li><router-link class="nav-link" to="/shop">Shop</router-link></li>
          <li><router-link class="nav-link" to="/about">About us</router-link></li>
          <li><router-link class="nav-link" to="/services">Services</router-link></li>
          <li><router-link class="nav-link" to="/blog">Blog</router-link></li>
          <li><router-link class="nav-link" to="/contact">Contact us</router-link></li>
        </ul>

        <ul class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
          <ul class="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
            <li><a class="nav-link" href="#">👤</a></li>
            <li><a class="nav-link" href="#">🛒</a></li>
          </ul>
        </ul>
      </div>
    </div>
  </nav>
</template>
