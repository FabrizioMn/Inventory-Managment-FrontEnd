import { apiClient } from "./apiClient";

export const proveedorService = {
  getAll: async () => {
    return await apiClient("/proveedores/");
  },

  create: async (productoData) => {
    return await apiClient("/proveedores/", {
      method: "POST",
      body: JSON.stringify(productoData),
    });
  },
};
