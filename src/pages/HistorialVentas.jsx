import { useEffect, useState } from "react";
import { transaccionService } from "../services/transaccionService";

function HistorialVentas() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        const data = await transaccionService.getHistorialVentas();
        if (activo) {
          setHistorial(data);
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

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Historial de ventas
        </h1>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {loading ? (
          <div className="p-10 text-center text-slate-500 font-medium bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#008674] mx-auto mb-4"></div>
            Cargando historial de transacciones...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-medium bg-white rounded-xl shadow-sm border border-red-100">
            {error}
          </div>
        ) : historial.length === 0 ? (
          <div className="p-10 text-center text-slate-400 italic bg-white rounded-xl shadow-sm">
            Aún no se han registrado ventas en el sistema.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {historial.map((venta) => (
              <div
                key={venta.id_venta}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Bloque Izquierdo: ID e Info de cabecera */}
                <div className="flex items-center gap-4">
                  <div className="bg-[#008674]/10 text-[#008674] font-mono font-black p-3 rounded-lg text-sm min-w-16 text-center">
                    #{venta.id_venta}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                      Fecha y Hora
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {formatearFecha(venta.created_at)}
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Atendido por Usuario ID:{" "}a
                      <strong>{venta.id_usuario}</strong>
                    </span>
                  </div>
                </div>

                {/* Bloque Derecho: El Monto Cobrado */}
                <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex md:flex-col justify-between items-center md:items-end gap-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider md:text-right">
                      Total Pagado
                    </span>
                    <span className="text-xl font-black text-[#008674] tracking-tight">
                      S/ {parseFloat(venta.total).toFixed(2)}
                    </span>
                  </div>

                  {/* Estado rápido de la transacción */}
                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Completado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </section>
  );
}

export default HistorialVentas;
