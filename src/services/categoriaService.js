import { apiClient } from "./apiClient";

export const categoriaService = {
  getAll: async () => {
    return await apiClient("/categorias/");
  },

  create: async (categoriaData) => {
    return await apiClient("/categorias/", {
      method: "POST",
      body: JSON.stringify(categoriaData),
    });
  },
};
