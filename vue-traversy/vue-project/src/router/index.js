import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import JobsView from "@/views/JobsView.vue";
import NotFoudView from "@/views/NotFoudView.vue";
import JobView from "@/views/JobView.vue";
import AddJobView from "@/views/AddJobView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView
    },
    {
      path: "/jobs",
      name: "jobs",
      component: JobsView
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: JobView
    },
    {
      path: "/jobs/add",
      name: "add-job",
      component: AddJobView
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoudView
    }
  ]

})

export default router;