import { createRouter, createWebHistory } from "vue-router";
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
