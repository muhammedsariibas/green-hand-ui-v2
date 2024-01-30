import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import HomeVue from '../pages/Home.vue'
import DefaultVue from '../layouts/Default.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      meta : {
        layout : LoginPage,
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeVue,
      meta : {
        layout : DefaultVue
      }
    },
   
  ]
})

export default router
