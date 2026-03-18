import { createRouter, createWebHistory } from "vue-router";
import { hasValidToken, currentUser } from "@/store/auth.js";
import AuthView from "../views/Login.vue";
import PagPrincipal from "../views/PagPrincipal.vue";
import Alineacion from "../views/Alineacion.vue";
import Lecturas from "../views/Lecturas.vue";
import CartaNatal from "../views/CartaNatal.vue";
import Compatibilidad from "../views/Compatibilidad.vue";
import Horoscopo from "../views/Horoscopo.vue";
import Revelacion from "../views/Revelacion.vue";
import FullReport from "../views/FullReport.vue";
import PlanesSubscripcion from "../views/PlanesSubscripcion.vue";
import HistoriaEstelar from "../views/HistoriaEstelar.vue";
import MetodosPago from "../views/MetodosPago.vue";
import HistorialPagos from "../views/HistorialPagos.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthView,
    meta: { public: true },
  },
  {
    path: "/home",
    name: "Home",
    component: PagPrincipal,
  },
  {
    path: "/alineacion",
    name: "Alineacion",
    component: Alineacion,
  },
  {
    path: "/lecturas",
    name: "Lecturas",
    component: Lecturas,
  },
  {
    path: "/carta-natal",
    name: "CartaNatal",
    component: CartaNatal,
  },
  {
    path: "/compatibilidad",
    name: "Compatibilidad",
    component: Compatibilidad,
  },
  {
    path: "/horoscopo",
    name: "Horoscopo",
    component: Horoscopo,
  },
  {
    path: "/revelacion",
    name: "revelacion",
    component: Revelacion,
  },
  {
    path: "/informe-personal",
    name: "FullReport",
    component: FullReport,
  },
  {
    path: "/suscripcion",
    name: "PlanesSubscripcion",
    component: PlanesSubscripcion,
  },
  {
    path: "/historia",
    name: "HistoriaEstelar",
    component: HistoriaEstelar,
  },
  {
    path: "/pagos",
    name: "MetodosPago",
    component: MetodosPago,
  },
  {
    path: "/historial-pagos",
    name: "HistorialPagos",
    component: HistorialPagos,
  },
  {
    path: "/configuracion",
    name: "Configuracion",
    component: () => import("../views/ConfiguracionAstral.vue"),
  },
  {
    path: "/guia-dashboard",
    name: "GuiaDashboard",
    component: () => import("../views/GuiaCosmicoDashboard.vue"),
    meta: { requiresAuth: true, adminOnly: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// ─── Navigation Guard ────────────────────────────────────────
router.beforeEach((to) => {
  const isPublic = to.meta?.public === true
  const tokenExists = hasValidToken()
  const user = currentUser.value
  const roleId = user?.id_rol || user?.role_id

  // 1. Acceso a rutas protegidas sin token
  if (!isPublic && !tokenExists) {
    return { name: 'Auth' }
  }

  // 2. Acceso a rutas de Admin (Guía)
  if (to.meta?.adminOnly) {
    // Si no hay usuario cargado o no es el rol 2 (Guía Cósmico)
    if (!user || roleId !== 2) {
      console.warn('Acceso no autorizado detectado a ruta administrativa.')
      return { name: 'Home' }
    }
  }

  // Permitir la navegación si nada de lo anterior se cumple
  return true
})

export default router;
