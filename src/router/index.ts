import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
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

      // Utilisateur
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
    ],
  },

  // User layout
  {
    path: '/User',
    component: () => import('../Layouts/UtilisateurLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_USER' },
    children: [
      {
        path: '',
        name: 'User-dashbord',
        component: () => import('../views/User/UserHomeView.vue'),
      },
      {
        path: 'Utilisateur/Shop',
        name: 'Shop',
        component: () => import('../components/Utilisateur/Shop.vue'),
      },
      {
        path: 'Utilisateur/Services',
        name: 'Services',
        component: () => import('../components/Utilisateur/Services.vue'),
      },
      {
        path: 'Utilisateur/Contact_US',
        name: 'Contact_US',
        component: () => import('../components/Utilisateur/Contact_US.vue'),
      },
      {
        path: 'Utilisateur/About_US',
        name: 'About_US',
        component: () => import('../components/Utilisateur/About_US.vue'),
      },
      {
        path: 'Utilisateur/Card',
        name: 'Card',
        component: () => import('../components/Utilisateur/Card.vue'),
      },
      {
        path: 'Utilisateur/Blog',
        name: 'Blog',
        component: () => import('../components/Utilisateur/Blog.vue'),
      },
    ],
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
]

// ← createRouter en dehors, une seule fois
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Protection des routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    next('/connection') // ← pas connecté → page connexion
  } else if (to.meta.role && to.meta.role !== role) {
    next('/connection') // ← mauvais rôle → page connexion
  } else {
    next()
  }
})

export default router
