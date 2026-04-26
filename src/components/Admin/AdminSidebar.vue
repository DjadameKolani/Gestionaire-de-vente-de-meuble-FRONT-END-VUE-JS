<template>
  <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="#">
      <div class="sidebar-brand-icon rotate-n-15">
        <i class="fas fa-laugh-wink"></i>
      </div>
      <div class="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
    </a>

    <hr class="sidebar-divider my-0" />

    <li class="nav-item active">
      <router-link class="nav-link" to="/admin">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </router-link>
    </li>

    <hr class="sidebar-divider" />

    <div class="sidebar-heading">Interface</div>

    <!-- Produit -->
    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseProduit"
        aria-expanded="false"
        aria-controls="collapseProduit"
      >
        <i class="fas fa-fw fa-cog"></i>
        <span>Produit</span>
      </a>
      <div id="collapseProduit" class="collapse" data-parent="#accordionSidebar">
        <div class="bg-white py-2 collapse-inner rounded">
          <router-link class="collapse-item" :to="{ name: 'addProduit' }">
            Ajouter produit
          </router-link>
          <router-link class="collapse-item" :to="{ name: 'Listeproduit' }">
            Liste produit
          </router-link>
        </div>
      </div>
    </li>

    <!-- Utilisateur -->
    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseUtilisateur"
        aria-expanded="false"
        aria-controls="collapseUtilisateur"
      >
        <i class="fas fa-fw fa-users"></i>
        <span>Utilisateur</span>
      </a>
      <div id="collapseUtilisateur" class="collapse" data-parent="#accordionSidebar">
        <div class="bg-white py-2 collapse-inner rounded">
          <router-link class="collapse-item" :to="{ name: 'ajouterUtilisateur' }">
            Ajouter utilisateur
          </router-link>
          <router-link class="collapse-item" :to="{ name: 'ListeUtilisateur' }">
            Liste utilisateurs
          </router-link>
        </div>
      </div>
    </li>

    <!-- ← Ajouter ici — Commandes -->
    <li class="nav-item">
      <a
        class="nav-link collapsed"
        href="#"
        data-toggle="collapse"
        data-target="#collapseCommandes"
        aria-expanded="false"
        aria-controls="collapseCommandes"
      >
        <i class="fas fa-fw fa-shopping-cart"></i>
        <span>Commandes</span>
      </a>
      <div id="collapseCommandes" class="collapse" data-parent="#accordionSidebar">
        <div class="bg-white py-2 collapse-inner rounded">
          <router-link class="collapse-item" :to="{ name: 'ListeCommandes' }">
            Liste commandes
          </router-link>
        </div>
      </div>
    </li>
  </ul>
</template>
