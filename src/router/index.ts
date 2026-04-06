import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashbord from '@/views/Admin/Dashbord.vue'
import AdminLayout from '../Layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      component: () => import('../Layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-dashbord',
          component: () => import('../views/Admin/Dashbord.vue'),
        },
      ],
    },
  ],
})

export default router
