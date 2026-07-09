import { apiClient } from "./apiClient";

export const productoService = {
  getAll: async () => {
    return await apiClient("/productos/");
  },

  create: async (productoData) => {
    return await apiClient("/productos/", {
      method: "POST",
      body: JSON.stringify(productoData),
    });
  },

  delete: async(id_producto)=>{
    return await apiClient(`/productos/${id_producto}`,{
      method:"DELETE"
    });
  }
};
