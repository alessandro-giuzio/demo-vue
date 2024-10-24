import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoDetail from '../components/todo/TodoDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/todo',
      name: 'todo',
      component: () => import('../views/TodoView.vue')
    },
    {
      path: '/todo-detail/:id',
      name: 'note-detail',
      component: TodoDetail,
      props: true
    },
    {
      path:'/note',
      name: 'note',
      component: () => import('../views/NoteView.vue')
    },
   /*  {
      path:'/edit-note/:id',
      name: 'edit-note',
      component: () => import('../views/EditNoteView.vue'),
    }, */
  ]
})

export default router
