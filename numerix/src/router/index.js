import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
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
import HistorialPagos from "../views/HistorialPagos.vue";
import pagos from "../views/payment.vue";
import payment_result from "../views/payment-result.vue";

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
    meta: { requiresAuth: true }
  },
  {
    path: "/alineacion",
    name: "Alineacion",
    component: Alineacion,
    meta: { requiresAuth: true }
  },
  {
    path: "/lecturas",
    name: "Lecturas",
    component: Lecturas,
    meta: { requiresAuth: true }
  },
  {
    path: "/carta-natal",
    name: "CartaNatal",
    component: CartaNatal,
    meta: { requiresAuth: true, requiresSubscription: true }
  },
  {
    path: "/compatibilidad",
    name: "Compatibilidad",
    component: Compatibilidad,
    meta: { requiresAuth: true, requiresSubscription: true }
  },
  {
    path: "/horoscopo",
    name: "Horoscopo",
    component: Horoscopo,
    meta: { requiresAuth: true, requiresSubscription: true }
  },
  {
    path: "/revelacion",
    name: "revelacion",
    component: Revelacion,
    meta: { requiresAuth: true, requiresSubscription: true }
  },
  {
    path: "/informe-personal",
    name: "FullReport",
    component: FullReport,
    meta: { requiresAuth: true, requiresSubscription: true }
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
    meta: { requiresAuth: true, requiresSubscription: true }
  },
  {
    path: "/pagos",
    name: "Pagos",
    component: pagos,
    meta: { requiresAuth: true }
  },
  {
    path: "/pagos/exito",
    name: "PagoExito",
    component: payment_result,
    meta: { requiresAuth: true }
  },
  {
    path: "/pagos/fallo",
    name: "PagoFallo",
    component: payment_result,
    meta: { requiresAuth: true }
  },
  {
    path: "/pagos/pendiente",
    name: "PagoPendiente",
    component: payment_result,
    meta: { requiresAuth: true }
  },
  {
    path: "/historial-pagos",
    name: "HistorialPagos",
    component: HistorialPagos,
    meta: { requiresAuth: true }
  },
  {
    path: "/configuracion",
    name: "Configuracion",
    component: () => import("../views/ConfiguracionAstral.vue"),
    meta: { requiresAuth: true }
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


// ─── Navigation Guard ──────────────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore();

  // 1. Proteger rutas que requieren autenticación
  if (to.meta.requiresAuth && !auth.token) {
    return "/auth"; 
  }

  // 2. Proteger rutas que requieren suscripción (Modelo Freemium)
  if (to.meta.requiresSubscription && !auth.isSubscribed) {
    console.warn('Acceso restringido: Se requiere suscripción para esta ruta.');
    return "/suscripcion"; 
  }

  // 3. Acceso a rutas de Admin (Guía)
  if (to.meta.adminOnly) {
    const user = auth.user;
    const roleId = user?.id_rol || user?.role_id || user?.role;
    // En este sistema, Admin = 2 (Guía Cósmico)
    if (!user || (roleId != 2 && roleId !== 'admin')) {
      console.warn('Acceso no autorizado detectado a ruta administrativa.');
      return "/home"; 
    }
  }
});

export default router;
