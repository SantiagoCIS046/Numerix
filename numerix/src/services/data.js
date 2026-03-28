import { httpClient } from "../plugins/http.js";

// Ajustado a las rutas reales del backend
export const getLecturas = async () => {
  // En el backend está como /api/producto/getLecturas
  const data = await httpClient.get("/producto/getLecturas", true);
  return data;
};

export const getMovimientos = async () => {
  // Ajustar si existe el endpoint de movimientos
  const data = await httpClient.get("/producto/getMovimientos", true);
  return data;
};

export const getPagos = async () => {
  // En el backend está como /api/pagos/getPagos o similar
  const data = await httpClient.get("/pagos/all", true);
  return data;
};
