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

  registrarAbastecimiento: async (abastecimientoData) => {
    return await apiClient("/transacciones/abastecer", {
      method: "POST",
      body: JSON.stringify(abastecimientoData),
    });
  },
  
  getHistorialAbastecimientos: async () => {
    return await apiClient("/transacciones/historial-abastecimientos");
  },
};
