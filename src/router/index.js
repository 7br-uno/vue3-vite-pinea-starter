import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './routes'
import { vue3starterAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (!to.matched.some((record) => !!record)) next('/error/page-not-found')
  const routeRequiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth,
  )
  if (!routeRequiresAuth) next()
  else {
    const authStore = vue3starterAuthStore()
    await authStore.isSignedIn().then((user) => {
      if (!user) next('/sign-in')
      else if (!user.emailVerified) next('/error/email-not-verified')
      else next()
    })
  }
})

router.afterEach((to) => {
  document.title = to.meta.parent
})

export default router
