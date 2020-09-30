import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

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
            name: 'wallet',
            redirect: '/balance',
            component: () => import('../views/main/Wallet/index.vue'),
            children: [
              { path: '/balance', name: 'balance', component: () => import('../views/main/Wallet/Balance.vue'), meta: {auth: true} },
              { path: '/history', name: 'history', component: () => import('../views/main/Wallet/History.vue'), meta: {auth: true} },
              { path: '/contacts', name: 'contacts', component: () => import('../views/main/Wallet/Contacts.vue'), meta: {auth: true} },
              { path: '/security', name: 'security', component: () => import('../views/main/Wallet/Security.vue'), meta: {auth: true} }
            ]
          },
          {
            path: '/sendHome',
            name: 'sendHome',
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
            name: 'receive',
            component: () => import('../views/main/Receive/index.vue'),
            meta: {auth: true}
          },
          {
            path: '/trade',
            name: 'trade',
            component: () => import('../views/main/Trade/index.vue'),
            meta: {auth: true}
          },
          {
            path: '/issue',
            name: 'Issue',
            component: () => import('../views/main/Issue/index.vue'),
            redirect: '/issue',
            children: [
              { path: '/issue', name: 'issue', component: () => import('../views/main/Issue/list.vue'), meta: {auth: true}},
              { path: '/newIssue', name: 'newIssue', component: () => import('../views/main/Issue/newIssue.vue'), meta: {auth: true}},
              { path: '/issueConfirm', name: 'issueConfirm', component: () => import('../views/main/Issue/issueConfirm.vue'), meta: {auth: true} },
              { path: '/issueSubmitted', name: 'issueSubmitted', component: () => import('../views/main/Issue/issueSubmitted.vue'), meta: {auth: true} },
              { path: '/issueToUser', name: 'issueToUser', component: () => import('../views/main/Issue/issueToUser.vue'), meta: {auth: true} },
              { path: '/issueToUserSubmitted', name: 'issueToUserSubmitted', component: () => import('../views/main/Issue/issueToUserSubmitted.vue'), meta: {auth: true} },
            ],
            meta: {auth: true}
          },
          {
            path: '/advanced',
            name: 'advanced',
            component: () => import('../views/main/Advanced/index.vue'),
            redirect: '/trust',
            children: [
              { path: '/trust', name: 'trust', component: () => import('../views/main/Advanced/Trust.vue'), meta: {auth: true} },
              { path: '/options', name: 'options', component: () => import('../views/main/Advanced/Options.vue'), },
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
    var islogin = sessionStorage.getItem("islogin");
    if (!islogin) {
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
