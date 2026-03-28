import api from "@/plugins/http";

export const crearPago = async (data) => {
  // Usamos el httpClient centralizado
  return await api.post("/pagos/crear", data, true);
};

export const verificarPago = async (payment_id) => {
  return await api.get(`/pagos/verificar/${payment_id}`, true);
};
