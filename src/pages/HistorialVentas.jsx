import { useEffect, useState } from "react";
import { transaccionService } from "../services/transaccionService";
import { productoService } from "../services/productoService";
import Swal from "sweetalert2";

function HistorialVentas() {
  const [historial, setHistorial] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    inicio: "",
    fin: "",
  });

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        const data = await transaccionService.getHistorialVentas();
        const dataProductos = await productoService.getAll();
        if (activo) {
          setHistorial(data);
          setListaProductos(dataProductos);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudieron cargar las ventas");
          console.log("Error:", e);
        }
      } finally {
        if (activo) setLoading(false);
      }
    }

    iniciarCarga();

    return () => {
      activo = false;
    };
  }, []);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "---";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obtenerNombreProductoPorId = (id) => {
    const encontrado = listaProductos.find(
      (p) => p.id_producto === parseInt(id),
    );
    return encontrado ? encontrado.nombre : `Producto #${id}`;
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Fechas inválidas",
        text: "La fecha de inicio no puede ser posterior a la fecha fin.",
        confirmButtonColor: "#008674",
      });
      return;
    }
    setFiltrosAplicados({ inicio: fechaInicio, fin: fechaFin });
  };

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setFiltrosAplicados({ inicio: "", fin: "" });
  };

  const historialFiltrado = historial.filter((venta) => {
    if (!venta.created_at) return true;

    const fechaLocal = new Date(venta.created_at);

    const year = fechaLocal.getFullYear();
    const month = String(fechaLocal.getMonth() + 1).padStart(2, "0");
    const day = String(fechaLocal.getDate()).padStart(2, "0");

    const fechaVentaStr = `${year}-${month}-${day}`;

    if (filtrosAplicados.inicio && fechaVentaStr < filtrosAplicados.inicio)
      return false;
    if (filtrosAplicados.fin && fechaVentaStr > filtrosAplicados.fin)
      return false;

    return true;
  });

  const verDetalleVenta = (venta) => {
    const productos = venta.productos || [];

    const filasHtml =
      productos.length === 0
        ? `<tr><td colspan="4" class="text-center py-4 text-slate-400 italic text-sm">No hay detalles registrados para esta venta.</td></tr>`
        : productos
            .map(
              (p) => `
          <tr class="text-slate-700 text-sm">
            <td class="py-3 text-left font-medium">${obtenerNombreProductoPorId(p.id_producto)}</td>
            <td class="py-3 text-center">${p.cantidad}</td>
            <td class="py-3 text-right">S/ ${parseFloat(p.precio_unitario).toFixed(2)}</td>
          </tr>
        `,
            )
            .join("");

    Swal.fire({
      title: `<span class="text-xl font-bold text-slate-800">Detalle de Venta</span>`,
      html: `
        <div class="text-left bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-xs text-slate-600 flex justify-between">
          <div><strong>Fecha:</strong> ${formatearFecha(venta.created_at)}</div>
          <div><strong>ID Venta:</strong> #${venta.id_venta}</div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th class="pb-2 text-left">Producto</th>
                <th class="pb-2 text-center">Cant.</th>
                <th class="pb-2 text-right">P. Unit</th>
              </tr>
            </thead>
            <tbody>
              ${filasHtml}
            </tbody>
          </table>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
          <span class="text-md font-bold text-slate-700">TOTAL PROCESADO</span>
          <span class="text-xl font-black text-[#008674]">S/ ${parseFloat(venta.total).toFixed(2)}</span>
        </div>
      `,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#008674",
      width: "550px",
    });
  };

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Historial de ventas
        </h1>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <form
            onSubmit={aplicarFiltros}
            className="flex flex-col sm:flex-row items-end gap-4"
          >
            <div className="flex flex-1 gap-4 w-full">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-slate-50 px-4 py-2.5 border border-[#bcc9c5] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00685d] text-slate-700"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-slate-50 px-4 py-2.5 border border-[#bcc9c5] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00685d] text-slate-700"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="px-4 py-2.5 border border-slate-300 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#008674] hover:bg-[#006e5f] text-white font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Filtrar Ventas
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 font-medium bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#008674] mx-auto mb-4"></div>
            Cargando historial de transacciones...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-medium bg-white rounded-xl shadow-sm border border-red-100">
            {error}
          </div>
        ) : historialFiltrado.length === 0 ? (
          <div className="p-10 text-center text-slate-400 italic bg-white rounded-xl shadow-sm">
            Aún no se han registrado ventas en el sistema.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto max-h-130 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Fecha y Hora</th>
                    <th className="p-4 text-right pr-12">Monto Total</th>
                    <th className="p-4 text-center w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historialFiltrado.map((venta) => (
                    <tr
                      key={venta.id_venta}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 pl-6 text-sm font-medium text-slate-700 whitespace-nowrap">
                        {formatearFecha(venta.created_at)}
                      </td>

                      {/* TOTAL */}
                      <td className="p-4 text-right pr-12 whitespace-nowrap">
                        <span className="text-sm font-bold text-[#008674]">
                          S/ {parseFloat(venta.total).toFixed(2)}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-[#008674] bg-slate-50 hover:bg-[#008674]/10 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                          title="Ver detalle completo"
                          onClick={() => verDetalleVenta(venta)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}

export default HistorialVentas;
