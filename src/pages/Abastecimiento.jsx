import { useEffect, useState } from "react";
import { productoService } from "../services/productoService";
import { proveedorService } from "../services/proveedorService";
import { transaccionService } from "../services/transaccionService";
import Swal from "sweetalert2";

function Abastecimiento() {
  const [listaProductos, setListaProductos] = useState([]);
  const [listaProveedores, setListaProveedores] = useState([]);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recargarDatos, setRecargarDatos] = useState(0);

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        if (recargarDatos > 0) setLoading(true);

        // 🌟 CORRECCIÓN: Traemos históricos completos (false) para que la tabla
        // e indicadores reflejen los productos y proveedores descontinuados.
        const dataProductos = await productoService.getAll(false);
        const dataProveedores = await proveedorService.getAll(false);
        if (activo) {
          setListaProductos(dataProductos);
          setListaProveedores(dataProveedores);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudo cargar el módulo de inventario");
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
  }, [recargarDatos]);

  const productosActivos = listaProductos.filter((p) => p.activo);
  const proveedoresActivos = listaProveedores.filter((prov) => prov.activo);
  const productosStockBajo = listaProductos.filter((prod) => prod.stock <= 10);

  const handleForm = async (e) => {
    e.preventDefault();

    const prodEncontrado = productosActivos.find(
      (p) => p.sku.trim().toLowerCase() === producto.trim().toLowerCase(),
    );

    if (!prodEncontrado) {
      Swal.fire({
        icon: "warning",
        title: "Producto no disponible",
        text: "El SKU ingresado no existe o corresponde a un producto descontinuado.",
        confirmButtonColor: "#008674",
      });
      return;
    }

    if (!cantidad || parseInt(cantidad) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "Por favor, ingrese una cantidad mayor a cero",
        confirmButtonColor: "#008674",
      });
      return;
    }

    if (!proveedor) {
      Swal.fire({
        icon: "warning",
        title: "Falta Proveedor",
        text: "Debe seleccionar un proveedor para este abastecimiento",
        confirmButtonColor: "#008674",
      });
      return;
    }

    const precioNumerico = parseFloat(precioCompra);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Precio inválido",
        text: "El precio de costo por unidad debe ser mayor a S/ 0.00",
        confirmButtonColor: "#008674",
      });
      return;
    }

    Swal.fire({
      title: "Procesando entrada...",
      text: "Actualizando los registros de stock.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    const idUsuarioActual = usuarioGuardado?.id_usuario || 1;

    try {
      const payload = {
        id_producto: prodEncontrado.id_producto,
        id_proveedor: parseInt(proveedor),
        cantidad: parseInt(cantidad),
        precio_compra: precioNumerico,
        id_usuario: idUsuarioActual,
      };

      await transaccionService.registrarAbastecimiento(payload);

      Swal.fire({
        icon: "success",
        title: "¡Stock Actualizado!",
        text: `Se agregaron ${cantidad} unidades a "${prodEncontrado.nombre}"`,
        confirmButtonColor: "#008674",
        timer: 2500,
      });

      setProducto("");
      setCantidad("");
      setProveedor("");
      setPrecioCompra("");

      setRecargarDatos((prev) => prev + 1);
    } catch (err) {
      console.error("Error al abastecer:", err);
      Swal.fire({
        icon: "error",
        title: "Error de Servidor",
        text: "No se pudo registrar el abastecimiento. Intente nuevamente.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Gestión de Stock
        </h1>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* Bloque principal */}
        <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-[#3d4946] mb-4 pb-2 border-b border-slate-100">
              Registrar Entrada de Mercadería
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form
              className="flex flex-col gap-4 items-end"
              onSubmit={handleForm}
            >
              <div className="w-full flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                    SKU Producto Activo
                  </label>
                  <input
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d] text-sm"
                    placeholder="Ej: TINT-EPS-N"
                    type="text"
                    value={producto}
                    onChange={(e) => setProducto(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:w-1/3">
                  <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                    Cantidad
                  </label>
                  <input
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d] text-sm"
                    placeholder="0"
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                    Proveedor Activo:
                  </label>
                  <select
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d] text-sm"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedoresActivos.map((prov) => (
                      <option key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.razon_social}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:w-1/3">
                  <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                    Precio Costo u.
                  </label>
                  <input
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d] text-sm"
                    placeholder="S/ 0.00"
                    type="number"
                    step="0.01"
                    value={precioCompra}
                    onChange={(e) => setPrecioCompra(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto bg-[#008674] hover:bg-[#006e5f] px-6 py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                  type="submit"
                >
                  Cargar Inventario
                </button>
              </div>
            </form>
          </div>

          {/* Bloque Lateral Stock Bajo */}
          <div className="w-full lg:w-80 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-90">
            <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
              <h2 className="text-md font-bold text-slate-700 uppercase tracking-wide">
                Stock Bajo
              </h2>
              <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {productosStockBajo.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 flex-1 h-0 overflow-y-auto pr-1 custom-scrollbar">
              {productosStockBajo.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  No hay productos con stock crítico.
                </p>
              ) : (
                productosStockBajo.map((prod) => (
                  <div
                    key={prod.id_producto}
                    className={`flex items-center justify-between p-3 rounded-lg border hover:bg-red-50 transition-colors ${
                      !prod.activo
                        ? "bg-slate-50/70 border-slate-200 opacity-60"
                        : "bg-red-50/60 border-red-100"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 flex-1 pr-2">
                      <span
                        className={`text-sm font-semibold truncate ${!prod.activo ? "text-slate-400 line-through" : "text-slate-800"}`}
                      >
                        {prod.nombre}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {prod.sku} {!prod.activo && "(De baja)"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-red-500 block font-medium">
                        Stock
                      </span>
                      <span className="text-sm font-black text-red-600">
                        {prod.stock} u.
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tabla General de Productos */}
        <div className="bg-white w-full p-6 rounded-xl border border-slate-200 shadow-sm mt-2">
          <div className="px-2 py-3 border-b border-slate-100 flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Listado Total de Inventario
            </h2>
            <span className="text-sm bg-[#008674]/10 text-[#008674] font-bold px-3 py-1 rounded-full">
              {listaProductos.length} productos registrados
            </span>
          </div>

          <div className="w-full overflow-x-auto max-h-120 overflow-y-auto custom-scrollbar border border-slate-100 rounded-lg">
            {loading ? (
              <div className="p-10 text-center text-slate-500 font-medium bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008674] mx-auto mb-3"></div>
                Sincronizando existencias...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium bg-white">
                {error}
              </div>
            ) : listaProductos.length === 0 ? (
              <div className="p-10 text-center text-slate-400 italic bg-white">
                No hay productos registrados en el sistema.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-32 text-center">SKU</th>
                    <th className="py-4 px-6 w-64">Nombre</th>
                    <th className="py-4 px-6">Descripción</th>
                    <th className="py-4 px-6 w-28 text-center">Stock</th>
                    <th className="py-4 px-6 w-28 text-center">Estado</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {listaProductos.map((prod, index) => {
                    const stock = parseInt(prod.stock) || 0;

                    let rowStyles = "bg-white hover:bg-slate-50/80";
                    if (!prod.activo) {
                      rowStyles = "bg-slate-50/50 text-slate-400";
                    } else if (stock < 5) {
                      rowStyles =
                        "bg-red-50/60 hover:bg-red-100/50 text-red-900";
                    } else if (stock >= 5 && stock <= 10) {
                      rowStyles =
                        "bg-amber-50/60 hover:bg-amber-100/50 text-amber-900";
                    }

                    return (
                      <tr
                        key={prod.id_producto || prod.sku || index}
                        className={`${rowStyles} transition-colors duration-150`}
                      >
                        <td className="py-4 px-6 font-mono font-bold text-center opacity-70 text-sm">
                          {prod.sku}
                        </td>
                        <td
                          className={`py-4 px-6 text-sm font-semibold ${!prod.activo ? "line-through opacity-60" : ""}`}
                        >
                          {prod.nombre}
                        </td>
                        <td className="py-4 px-6 text-sm opacity-80">
                          {prod.descripcion || "---"}
                        </td>
                        <td className="py-4 px-6 text-sm text-center font-bold">
                          {prod.stock} u.
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              prod.activo
                                ? "bg-teal-50 text-teal-700 border border-teal-200"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {prod.activo ? "Activo" : "Descontinuado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}

export default Abastecimiento;
