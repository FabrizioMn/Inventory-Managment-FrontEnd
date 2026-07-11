import { apiClient } from "./apiClient";

export const transaccionService = {
  registrarVenta: async (ventaData) => {
    return await apiClient("/transacciones/venta", {
      method: "POST",
      body: JSON.stringify(ventaData),
    });
  },

  getHistorialVentas: async () => {
    return await apiClient("/transacciones/historial-ventas");
  },
};
