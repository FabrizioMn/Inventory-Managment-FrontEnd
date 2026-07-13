import { apiClient } from "./apiClient";

export const categoriaService = {
  getAll: async (soloActivos = true) => {
    return await apiClient(`/categorias/?solo_activos=${soloActivos}`);
  },

  create: async (categoriaData) => {
    return await apiClient("/categorias/", {
      method: "POST",
      body: JSON.stringify(categoriaData),
    });
  },

  delete: async (id_categoria) => {
    return await apiClient(`/categorias/${id_categoria}`, {
      method: "DELETE",
    });
  },
};
