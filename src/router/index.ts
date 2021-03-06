import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "rootPath",
    redirect: "/learn"
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterLogin/Register.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/RegisterLogin/Login.vue")
  },
  {
    path: "/learn",
    name: "learn",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/Learn/Learn/Learn.vue")
  },
  {
    path: "/learn/content/:id",
    name: "learn-content",
    component: () => import("@/views/Learn/LearnContent/LearnContent.vue")
  },
  {
    path: "/competition",
    name: "competition",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/Competition/Competition/Competition.vue")
  },
  {
    path: "/competition/content/:id",
    name: "competition-content",
    component: () =>
      import("@/views/Competition/CompetitionContent/CompetitionContent.vue")
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error_page/404.vue")
  },
  {
    path: "*",
    redirect: "/404"
  }
]

const router = new VueRouter({
  // mode: "history",
  mode: "hash",
  base: process.env.BASE_URL,
  routes
})

export default router
