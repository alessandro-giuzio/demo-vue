import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateNoteView from '@/views/CreateNoteView.vue'
import TodoDetail from '../components/todo/TodoDetail.vue'
import SharedNotesView from '@/views/SharedNotesView.vue'

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
      name: 'todo-detail',
      component: TodoDetail,
      props: true
    },
    {
      path: '/note',
      name: 'note',
      component: () => import('../views/NoteView.vue'),
    },
    {

        path: '/note/shared',
        name: 'shared-notes',
        component: SharedNotesView

    },
    {
      path: '/note/create',
      name: 'create-note',
      component: CreateNoteView,
      props: route => ({ users: JSON.parse(localStorage.getItem('users') || '[]') })
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      props: () => {
        const storedUsers = localStorage.getItem('users')
        return {
          users: storedUsers ? JSON.parse(storedUsers) : []
        }
      }
    }
  ]
})

export default router