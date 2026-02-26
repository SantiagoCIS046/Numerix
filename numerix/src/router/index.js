import { createRouter, createWebHistory } from "vue-router";
import AuthView from "../views/Login.vue";
import PagPrincipal from "../views/PagPrincipal.vue";
import Alineacion from "../views/Alineacion.vue";

const routes = [
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("token");
      return token ? "/home" : "/auth";
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthView,
    meta: { guestOnly: true },
  },
  {
    path: "/home",
    name: "Home",
    component: PagPrincipal,
    meta: { requiresAuth: true },
  },
  {
    path: "/alineacion",
    name: "Alineacion",
    component: Alineacion,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/auth");
  }
  if (to.meta.guestOnly && token) {
    return next("/home");
  }
  next();
});

export default router;
