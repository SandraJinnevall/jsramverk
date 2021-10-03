import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/home.vue";
Vue.use(VueRouter);
const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/",
    name: "login",
    component: () => import("../components/login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../components/register.vue")
  },
  {
    path: "/savedDocuments",
    name: "savedDocuments",
    component: () => import("../components/savedDocuments.vue"),
    meta: {
      requiresAuth: true
    }
  },
];
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;