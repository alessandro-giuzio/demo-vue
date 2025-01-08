import { createRouter, createWebHistory } from 'vue-router/auto'
import {routes} from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach( (to,from) => {
  const {user} = storeToRefs(useAuthStore())

  if(!user.value && to.path !== '/login' && to.path !== '/register') {
    return {name: '/login'}
  }
})

export default router
