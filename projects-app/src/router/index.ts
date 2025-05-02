import { createRouter, createWebHistory } from 'vue-router/auto'

import TasksComponent from '@/pages/tasks/index.vue'
import SingleTaskComponent from '@/pages/tasks/[id].vue'
import ProjectComponent from '@/pages/projects/index.vue'
import SingleProjectComponent from '@/pages/projects/[slug].vue'

const routes = [
  { path: '/', redirect: '/task' },
  { path: '/task', component: TasksComponent },
  { path: '/task/:taskId', component: SingleTaskComponent },
  { path: '/project', component: ProjectComponent },
  { path: '/project/:slug', component: SingleProjectComponent },
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
    return {
      name: '/login'
    }
  }

  if (authStore.user && isAuthPage) {
    return {
      name: '/'
    }
  }
})

export default router
