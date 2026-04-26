// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },

  // ✅ Card accessible à TOUS les utilisateurs connectés (sorti du layout /User)
  {
    path: '/panier',
    name: 'Card',
    component: () => import('../components/Utilisateur/Card.vue'),
    meta: { requiresAuth: true }, // ← connecté suffit, pas de rôle spécifique
  },

  // Admin layout
  {
    path: '/admin',
    component: () => import('../Layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_ADMIN' },
    children: [
      {
        path: '',
        name: 'admin-dashbord',
        component: () => import('../views/Admin/Dashbord.vue'),
      },
      {
        path: 'produit',
        name: 'Listeproduit',
        component: () => import('../views/Admin/produit/Listeproduit.vue'),
      },
      {
        path: 'produit/addProduit',
        name: 'addProduit',
        component: () => import('../views/Admin/produit/addProduit.vue'),
      },
      {
        path: 'produit/edit/:id',
        name: 'editProduit',
        component: () => import('../views/Admin/produit/editProduit.vue'),
      },
      {
        path: 'Utilisateur/ListeUtilisateur',
        name: 'ListeUtilisateur',
        component: () => import('../views/Admin/Utilisateur/ListeUtilisateur.vue'),
      },
      {
        path: 'Utilisateur/ajouter',
        name: 'ajouterUtilisateur',
        component: () => import('../views/Admin/Utilisateur/ajouterUtilisateur.vue'),
      },
      {
        path: 'Utilisateur/editeUtilisateur/:id',
        name: 'editeUtilisateur',
        component: () => import('../views/Admin/Utilisateur/editeUtilisateur.vue'),
      },
      {
        path: 'Utilisateur/suprimerUtilisateur/:id',
        name: 'suprimerUtilisateur',
        component: () => import('../views/Admin/Utilisateur/suprimerUtilisateur.vue'),
      },
      {
        path: 'commandes',
        name: 'ListeCommandes',
        component: () => import('../views/Admin/commande/ListeCommandes.vue'),
      },
    ],
  },

  // User layout
  {
    path: '/User',
    component: () => import('../Layouts/UtilisateurLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_USER' },
    children: [
      {
        path: 'historique',
        name: 'HistoriqueCommandes',
        component: () => import('../views/User/HistoriqueCommandes.vue'),
      },
    ],
  },

  // Routes publiques
  {
    path: '',
    name: 'User-dashbord',
    component: () => import('../views/User/UserHomeView.vue'),
  },
  {
    path: '/Shop',
    name: 'Shop',
    component: () => import('../components/Utilisateur/Shop.vue'),
  },
  {
    path: '/Blog',
    name: 'Blog',
    component: () => import('../components/Utilisateur/Blog.vue'),
  },
  {
    path: '/Services',
    name: 'Services',
    component: () => import('../components/Utilisateur/Services.vue'),
  },
  {
    path: '/Contact_US',
    name: 'Contact_US',
    component: () => import('../components/Utilisateur/Contact_US.vue'),
  },
  {
    path: '/About_US',
    name: 'About_US',
    component: () => import('../components/Utilisateur/About_US.vue'),
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: () => import('../views/Inscription/Inscription.vue'),
  },
  {
    path: '/connection',
    name: 'Connection',
    component: () => import('../views/Inscription/Connection.vue'),
  },

  // ✅ Page 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Guard corrigé — supporte plusieurs rôles autorisés
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    // Pas connecté → login
    next('/connection')
    return
  }

  if (to.meta.role) {
    // ✅ Accepter aussi ROLE_ADMIN sur les routes USER (admin peut tout voir)
    const rolesAutorises = [to.meta.role, 'ROLE_ADMIN']
    if (!rolesAutorises.includes(role)) {
      next('/connection')
      return
    }
  }

  next()
})

export default router
