import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/login',
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
      },
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('../views/Welcome.vue')
      },
      {
        path: '/service',
        name: 'service',
        component: () => import('../views/TermOfService.vue')
      },
      {
        path: '/main',
        name: 'main',
        component: () => import('../views/main/Index.vue'),
        redirect: '/Wallet',
        children: [
          {
            path: '/Wallet',
            name: 'Wallet',
            redirect: '/Balance',
            component: () => import('../views/main/Wallet/index.vue'),
            children: [
              { path: '/Balance', name: 'Balance', component: () => import('../views/main/Wallet/Balance.vue'), },
              { path: '/History', name: 'History', component: () => import('../views/main/Wallet/History.vue'), },
              { path: '/Contacts', name: 'Contacts', component: () => import('../views/main/Wallet/Contacts.vue'), },
              { path: '/Security', name: 'Security', component: () => import('../views/main/Wallet/Security.vue'), }
            ]
          },
          {
            path: '/Send',
            name: 'Send',
            component: () => import('../views/main/Send/index.vue'),
            redirect: '/send',
            children: [
              { path: '/send', name: 'send', component: () => import('../views/main/Send/send.vue'), },
              { path: '/sendConfirm', name: 'sendConfirm', component: () => import('../views/main/Send/sendConfirm.vue'), },
              { path: '/submitted', name: 'submitted', component: () => import('../views/main/Send/submitted.vue'), },
              { path: '/cleared', name: 'cleared', component: () => import('../views/main/Send/cleared.vue'), },
            ]
          },
          {
            path: '/Receive',
            name: 'Receive',
            component: () => import('../views/main/Receive/index.vue'),
          },
          {
            path: '/Issue',
            name: 'Issue',
            component: () => import('../views/main/Issue/index.vue'),
          },
          {
            path: '/Advanced',
            name: 'Advanced',
            component: () => import('../views/main/Advanced/index.vue'),
            redirect: '/Trust',
            children: [
              { path: '/Trust', name: 'Trust', component: () => import('../views/main/Advanced/Trust.vue'), },
              { path: '/Options', name: 'Options', component: () => import('../views/main/Advanced/Options.vue'), },
            ]
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
