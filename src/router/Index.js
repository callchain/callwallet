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
        redirect: '/wallet',
        meta: {auth: true},
        children: [
          {
            path: '/wallet',
            name: 'Wallet',
            redirect: '/balance',
            component: () => import('../views/main/Wallet/index.vue'),
            children: [
              { path: '/balance', name: 'Balance', component: () => import('../views/main/Wallet/Balance.vue'), meta: {auth: true} },
              { path: '/history', name: 'History', component: () => import('../views/main/Wallet/History.vue'), meta: {auth: true} },
              { path: '/contacts', name: 'Contacts', component: () => import('../views/main/Wallet/Contacts.vue'), meta: {auth: true} },
              { path: '/security', name: 'Security', component: () => import('../views/main/Wallet/Security.vue'), meta: {auth: true} }
            ]
          },
          {
            path: '/send',
            name: 'Send',
            component: () => import('../views/main/Send/index.vue'),
            redirect: '/send',
            children: [
              { path: '/send', name: 'send', component: () => import('../views/main/Send/send.vue'), meta: {auth: true}},
              { path: '/sendConfirm', name: 'sendConfirm', component: () => import('../views/main/Send/sendConfirm.vue'), meta: {auth: true} },
              { path: '/submitted', name: 'submitted', component: () => import('../views/main/Send/submitted.vue'), meta: {auth: true} },
              { path: '/cleared', name: 'cleared', component: () => import('../views/main/Send/cleared.vue'), meta: {auth: true} },
            ]
          },
          {
            path: '/receive',
            name: 'Receive',
            component: () => import('../views/main/Receive/index.vue'),
            meta: {auth: true}
          },
          {
            path: '/issue',
            name: 'Issue',
            component: () => import('../views/main/Issue/index.vue'),
            meta: {auth: true}
          },
          {
            path: '/advanced',
            name: 'Advanced',
            component: () => import('../views/main/Advanced/index.vue'),
            redirect: '/trust',
            children: [
              { path: '/trust', name: 'Trust', component: () => import('../views/main/Advanced/Trust.vue'), meta: {auth: true} },
              { path: '/options', name: 'Options', component: () => import('../views/main/Advanced/Options.vue'), },
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

router.beforeEach(function(to, from, next) {
  if (to.meta.auth) {
    var userdata = sessionStorage.getItem("userdata");
    if (!userdata) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
    else
    {
      next()
    }
  }
  else
  {
    next()
  }
})

export default router