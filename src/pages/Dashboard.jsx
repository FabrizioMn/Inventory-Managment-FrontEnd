import { useEffect, useState } from "react";
import { transaccionService } from "../services/transaccionService";
import { productoService } from "../services/productoService";
import { Link } from "react-router-dom";

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [totalMovimientos, setTotalMovimientos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargarMetricas() {
      try {
        const dataProductos = await productoService.getAll(false);
        const dataVentas = await transaccionService.getHistorialVentas();
        const dataAbastecer =
          await transaccionService.getHistorialAbastecimientos();

        if (activo) {
          setProductos(dataProductos);
          setTotalMovimientos(dataVentas.length + dataAbastecer.length);
          setError(null);
        }
      } catch (e) {
        console.error("Error al cargar métricas del Dashboard", e);
        if (activo) setError("No se pudieron consolidar los indicadores.");
      } finally {
        if (activo) setLoading(false);
      }
    }

    cargarMetricas();

    return () => {
      activo = false;
    };
  }, []);

  const productosActivos = productos.filter((p) => p.activo);
  const totalProductos = productosActivos.length;

  const sinStock = productosActivos.filter(
    (p) => parseInt(p.stock) === 0,
  ).length;

  const stockBajo = productosActivos.filter(
    (p) => parseInt(p.stock) > 0 && parseInt(p.stock) <= 10,
  ).length;

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Bienvenido al Sistema
        </h1>
      </header>

      <main className="flex-1">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="w-full mx-auto max-w-7xl mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">
              {loading ? "---" : totalProductos}
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Total Productos
            </span>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">
              {loading ? "---" : totalMovimientos}
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Total Movimientos
            </span>{" "}
          </div>
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">
              {loading ? "---" : sinStock}
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Sin Stock
            </span>{" "}
          </div>
          <div className="flex flex-col gap-3 justify-center items-center bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <h2 className="text-5xl font-black text-slate-800 tracking-tight">
              {loading ? "---" : stockBajo}
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Stock Bajo
            </span>{" "}
          </div>
        </div>

        <div className="bg-white mx-auto max-w-7xl p-6 rounded-xl border border-slate-200 shadow-md mt-6">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Accesos Rapidos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              to="/ventas"
              className="flex items-center gap-5 p-5 border border-slate-200 hover:border-[#008674]/40 bg-slate-50/50 hover:bg-[#008674]/5 rounded-xl group transition-all cursor-pointer shadow-sm"
            >
              <div className="p-4 bg-[#008674]/10 text-[#008674] group-hover:bg-[#008674] group-hover:text-white rounded-xl transition-all shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-base group-hover:text-[#008674] transition-colors">
                  Punto de Venta (Nueva Venta)
                </h3>
              </div>
            </Link>
            <Link
              to="/abastecimiento"
              className="flex items-center gap-5 p-5 border border-slate-200 hover:border-[#008674]/40 bg-slate-50/50 hover:bg-[#008674]/5 rounded-xl group transition-all cursor-pointer shadow-sm"
            >
              <div className="p-4 bg-[#008674]/10 text-[#008674] group-hover:bg-[#008674] group-hover:text-white rounded-xl transition-all shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-base group-hover:text-[#008674] transition-colors">
                  Abastecer Inventario (Nueva Entrada)
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Dashboard;
