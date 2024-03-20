import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import HomeVue from '../pages/Home.vue'
import DefaultVue from '../layouts/Default.vue'
import Application from '../pages/Application.vue'
import ApplicationComp from '../components/ApplicationComp.vue'
import SuccessPage from '../pages/SuccessPage.vue'
import ApplicationList from '../pages/ApplicationList.vue'
import VisitListComp from '../components/VisitListComp.vue'
import VisitReportComp from '../components/VisitReportComp.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Index from '../components/Index.vue'
import OneTimeAidApplication from '@/components/Public/OneTimeAidApplication.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        layout: Index,
      }
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      meta: {
        layout: LoginPage,
      }
    },
    {
      name: 'one-time-aid-application',
      path: '/one-time-aid',
      component: () => import('@/components/Public/OneTimeAidApplication.vue'),
      meta : {
          layout : OneTimeAidApplication
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeVue,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/application',
      name: 'Application',
      component: Application,
      meta: {
        layout: Application
      }
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessPage,
      meta: {
        layout: SuccessPage
      }
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationList,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/visit-list',
      name: 'visit-list',
      component: VisitListComp,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/visit-report',
      name: 'visit-report',
      component: VisitReportComp,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/roles',
      name: 'roles',
      component: Roles,
      meta: {
        layout: DefaultVue
      }
    },

  ]


})



export default router
