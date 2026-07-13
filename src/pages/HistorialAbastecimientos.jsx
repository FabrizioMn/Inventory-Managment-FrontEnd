import { useEffect, useState } from "react";
import { transaccionService } from "../services/transaccionService";
import { productoService } from "../services/productoService";
import { proveedorService } from "../services/proveedorService";
import { categoriaService } from "../services/categoriaService";

function HistorialAbastecimientos() {
  const [historial, setHistorial] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [listaProveedores, setListaProveedores] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        const data = await transaccionService.getHistorialAbastecimientos();
        const dataProductos = await productoService.getAll(false);
        const dataProveedores = await proveedorService.getAll(false);
        const dataCategorias = await categoriaService.getAll(false);
        if (activo) {
          setHistorial(data);
          setListaProductos(dataProductos);
          setListaProveedores(dataProveedores);
          setListaCategorias(dataCategorias);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudo cargar el historial de abastecimientos");
          console.error("Error:", e);
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

  const obtenerNombreProducto = (id) => {
    const resultado = listaProductos.find(
      (prod) => prod.id_producto === parseInt(id),
    );
    return resultado ? resultado.nombre : "Producto no encontrado";
  };

  const obtenerSKUProducto = (id) => {
    const resultado = listaProductos.find(
      (prod) => prod.id_producto === parseInt(id),
    );
    return resultado ? resultado.sku : "SKU no encontrado";
  };

  const obtenerNombreProveedor = (id) => {
    const resultado = listaProveedores.find(
      (prov) => prov.id_proveedor === parseInt(id),
    );
    return resultado ? resultado.razon_social : "Proveedor no encontrado";
  };

  const obtenerNombreCategoria = (id) => {
    const producto = listaProductos.find(
      (prod) => prod.id_producto === parseInt(id),
    );
    if (!producto || !producto.id_categoria) return "Sin Categoría";

    const resultado = listaCategorias.find(
      (cat) => cat.id_categoria === parseInt(producto.id_categoria),
    );
    return resultado ? resultado.nombre : "Sin Categoria";
  };

  const cantidadDeMovimientosHoy = () => {
    const hoy = new Date().toLocaleDateString("es-PE");

    return historial.filter((abast) => {
      if (!abast.created_at) return false;
      const fechaMovimiento = new Date(abast.created_at).toLocaleDateString(
        "es-PE",
      );
      return fechaMovimiento == hoy;
    }).length;
  };

  const obtenerProductoMasMovido = () => {
    if (historial.length === 0) return "Ninguno";

    const conteoProductos = {};
    let maxId = null;
    let maxConteo = 0;

    historial.forEach((abast) => {
      const id = abast.id_producto;
      conteoProductos[id] = (conteoProductos[id] || 0) + 1;

      if (conteoProductos[id] > maxConteo) {
        maxConteo = conteoProductos[id];
        maxId = id;
      }
    });

    return maxId ? obtenerNombreProducto(maxId) : "Ninguno";
  };

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Historial de Entradas
        </h1>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        <div className="w-full mx-auto max-w-7xl mt-6 flex gap-6 mb-5">
          <div className="flex-1 flex flex-col gap-3 bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <span className="text-md font-medium text-black uppercase tracking-wider text-left">
              Movimientos Hoy
            </span>
            <h2 className="text-5xl font-light">
              {cantidadDeMovimientosHoy()}
            </h2>
          </div>
          <div className="flex-1 flex flex-col gap-3 bg-white p-6 rounded-xl border border-slate-200 shadow-md">
            <span className="text-md font-medium text-black uppercase tracking-wider text-left">
              Producto mas movido
            </span>
            <h2 className="text-4xl font-light">
              {obtenerProductoMasMovido()}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 font-medium bg-white rounded-xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#008674] mx-auto mb-4"></div>
            Cargando historial de movimientos...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-medium bg-white rounded-xl shadow-sm border border-red-100">
            {error}
          </div>
        ) : historial.length === 0 ? (
          <div className="p-10 text-center text-slate-400 italic bg-white rounded-xl shadow-sm">
            Aún no se han registrado entradas de stock en el sistema.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto max-h-130 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-center">
                      Categoria
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-center">
                      Proveedor
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-center">
                      Cantidad
                    </th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-center">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historial.map((abast) => {
                    const totalInvertido =
                      abast.cantidad * parseFloat(abast.precio_compra);
                    return (
                      <tr
                        key={abast.id_abastecimiento}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                          {formatearFecha(abast.created_at)}
                        </td>

                        {/* PRODUCTO */}
                        <td className="p-4 text-sm text-slate-800">
                          <span className="font-semibold block">
                            {obtenerNombreProducto(abast.id_producto)}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {obtenerSKUProducto(abast.id_producto)}
                          </span>
                        </td>

                        {/* Categoria */}
                        <td className="p-4 text-sm text-slate-800 text-center">
                          <span className="font-semibold block">
                            {obtenerNombreCategoria(abast.id_producto)}
                          </span>
                        </td>

                        {/* PROVEEDOR */}
                        <td className="p-4 text-sm text-slate-800 text-center">
                          <span className="font-semibold block">
                            {obtenerNombreProveedor(abast.id_proveedor)}
                          </span>
                        </td>

                        {/* CANTIDAD */}
                        <td className="p-4 text-sm text-slate-800 text-center whitespace-nowrap">
                          <span className="font-bold">{abast.cantidad}</span>
                          <span className="text-xs text-slate-400 block">
                            c/u: S/ {parseFloat(abast.precio_compra).toFixed(2)}
                          </span>
                        </td>

                        {/* TOTAL */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className="text-sm font-bold text-[#008674]">
                            S/ {totalInvertido.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}

export default HistorialAbastecimientos;
