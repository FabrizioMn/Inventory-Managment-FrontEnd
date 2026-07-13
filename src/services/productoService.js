import { apiClient } from "./apiClient";

export const productoService = {
  getAll: async (soloActivos = true) => {
    return await apiClient(`/productos/?solo_activos=${soloActivos}`);
  },

  create: async (productoData) => {
    return await apiClient("/productos/", {
      method: "POST",
      body: JSON.stringify(productoData),
    });
  },

  delete: async (id_producto) => {
    return await apiClient(`/productos/${id_producto}`, {
      method: "DELETE",
    });
  },
};