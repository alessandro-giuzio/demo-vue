
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  { path: '/', redirect: '/tasks', name: 'home' },
  { path: '/login', component: () => import('@/pages/login.vue'), name: 'login' },
  { path: '/register', component: () => import('@/pages/register.vue'), name: 'register' },
  { path: '/tasks', component: () => import('@/pages/tasks/index.vue'), name: 'tasks' },
  { path: '/tasks/:id', component: () => import('@/pages/tasks/[id].vue'), name: 'taskDetail' },
  { path: '/projects', component: () => import('@/pages/projects/index.vue'), name: 'projects' },
  { path: '/projects/:slug', component: () => import('@/pages/projects/[slug].vue'), name: 'projectDetail' },
  { path: '/users', component: () => import('@/pages/users/index.vue'), name: 'users' },
  { path: '/users/:username', component: () => import('@/pages/users/[username].vue'), name: 'userDetail' },
  // { path: '/project/:slug/task' }, // show all tasks of that project
  // { path: '/project/:slug/task/:taskId' }, // show single task of that project
  // { path: '/project/:slug/settings', }, // show project settings
  // { path: '/project/:slug/user', }, // show team members of that project

  // Catch-all route for 404s
  { path: '/:catchAll(.*)', component: () => import('@/pages/[...catchAll].vue'), name: 'notFound' }
]

/*
  PSEUDO CODE, DOESNT WORK
  const newTask = await createTask({...someData});
  redirect(`/task/${newTask.id}`);

  const newProject = await createProject({...someData});
  redirect(`/project/${newProject.slug}`);
*/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.getSession()

  const isAuthPage = ['/login', '/register'].includes(to.path)

  if (!authStore.user && !isAuthPage) {
    return { path: '/login' } // Use path instead of name
  }

  if (authStore.user && isAuthPage) {
    return { path: '/' } // Use path instead of name
  }
})

export default router
