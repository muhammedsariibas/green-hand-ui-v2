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
import ApplicationCategory from '@/components/ApplicationCategory.vue'
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
      name: 'Giriş',
      component: LoginPage,
      meta: {
        layout: LoginPage,
      }
    },
    {
      name: 'Tek Seferlik Yardım',
      path: '/one-time-aid',
      component: () => import('@/components/Public/OneTimeAidApplication.vue'),
      meta : {
          layout : OneTimeAidApplication
      }
    },
    {
      path: '/home',
      name: 'Anasayfa',
      component: HomeVue,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/application',
      name: 'Başvuru',
      component: Application,
      meta: {
        layout: Application
      }
    },
    {
      path: '/success',
      name: 'Başarılı',
      component: SuccessPage,
      meta: {
        layout: SuccessPage
      }
    },
    {
      path: '/applications',
      name: 'Başvurular',
      component: ApplicationList,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/visit-list',
      name: 'Ziyaret Kayıt',
      component: VisitListComp,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/visit-report',
      name: 'Ziyaret Rapor',
      component: VisitReportComp,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/users',
      name: 'Kullanıcılar',
      component: Users,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/roles',
      name: 'Roller',
      component: Roles,
      meta: {
        layout: DefaultVue
      }
    },
    {
      path: '/application-category',
      name: 'Başvuru Kategorileri',
      component: ApplicationCategory,
      meta: {
        layout: DefaultVue
      }
    },

  ]


})



export default router
