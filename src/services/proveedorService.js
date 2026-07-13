import { apiClient } from "./apiClient";

export const proveedorService = {
  getAll: async (soloActivos = true) => {
    return await apiClient(`/proveedores/?solo_activos=${soloActivos}`);
  },

  create: async (proveedorData) => {
    return await apiClient("/proveedores/", {
      method: "POST",
      body: JSON.stringify(proveedorData),
    });
  },

  delete: async (id_proveedor) => {
    return await apiClient(`/proveedores/${id_proveedor}`, {
      method: "DELETE",
    });
  },
};
