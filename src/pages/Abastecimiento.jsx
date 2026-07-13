import { productoService } from "../services/productoService";
import { proveedorService } from "../services/proveedorService";
import { transaccionService } from "../services/transaccionService";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

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

        const dataProductos = await productoService.getAll();
        const dataProveedores = await proveedorService.getAll();
        if (activo) {
          setListaProductos(dataProductos);
          setListaProveedores(dataProveedores);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudo el modulo de carga de inventario");
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

  const productosStockBajo = listaProductos.filter((prod) => prod.stock <= 10);

  const handleForm = async (e) => {
    e.preventDefault();

    const prodEncontrado = listaProductos.find(
      (p) => p.sku.trim().toLowerCase() === producto.trim().toLowerCase(),
    );

    if (!prodEncontrado) {
      Swal.fire({
        icon: "warning",
        title: "Producto no encontrado",
        text: "El SKU ingresado no coincide con ningún producto registrado",
        confirmButtonColor: "#008674",
      });
      return;
    }

    if (!cantidad || parseInt(cantidad) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad invalida",
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

    if (!precioCompra || parseFloat(precioCompra) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Precio invalido",
        text: "El precio de costo por unidad debe ser mayor a 0",
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

    try {
      const payload = {
        id_producto: prodEncontrado.id_producto,
        id_proveedor: parseInt(proveedor),
        cantidad: parseInt(cantidad),
        precio_compra: parseFloat(precioCompra),
        id_usuario: 1,
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
          Gestion de Stock
        </h1>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {/*Bloque principal*/}
        <div className="max-w-7xl w-full mx-auto flex gap-6 items-stretch h-90">
          <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-[#3d4946] mb-4 pb-2">
              Registrar Entrada de Mercaderia
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
              <div className="w-full flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                    SKU Producto
                  </label>
                  <input
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                    placeholder="Ej: Tintas"
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
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                    placeholder="0"
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1 w-full">
                  <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                    Proveedor:
                  </label>
                  <select
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  >
                    <option value="">Seleccione un proveedor</option>
                    {listaProveedores.map((prov) => (
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
                    className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                    placeholder="S/ 0.00"
                    type="number"
                    step="0.01"
                    value={precioCompra}
                    onChange={(e) => setPrecioCompra(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-auto">
                <button
                  className="w-full md:w-auto bg-[#008674] hover:bg-[#006e5f] px-4 py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                  type="submit"
                >
                  Cargar Producto
                </button>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-80 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
              <h2 className="text-md font-bold text-slate-700 uppercase tracking-wide">
                Stock Bajo
              </h2>
              <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {productosStockBajo.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 flex-1 h-0 overflow-y-auto pr-1">
              {productosStockBajo.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  No hay productos con stock crítico.
                </p>
              ) : (
                productosStockBajo.map((prod) => (
                  <div
                    key={prod.id_producto}
                    className="flex items-center justify-between p-3 bg-red-50/60 rounded-lg border border-red-100 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex flex-col min-w-0 flex-1 pr-2">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {prod.nombre}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {prod.sku}
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

        {/*Lista Productos*/}
        <div className="bg-white mx-auto w-full max-w-7xl p-6 rounded-xl border border-slate-200 shadow-md mt-6">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Listado de Productos
            </h2>
            <span className="text-sm bg-[#008674]/10 text-[#008674] font-bold px-3 py-1 rounded-full">
              {listaProductos.length} productos
            </span>
          </div>

          {/*TABLA*/}
          <div className="w-full overflow-x-auto max-h-120 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 text-center text-slate-800 font-medium">
                Cargando productos...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium">
                {error}
              </div>
            ) : listaProductos.length === 0 ? (
              <div className="p-10 text-center text-slate-800 italic">
                No hay productos registrados
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                    <th className="py-4 px-6 w-24 text-center">SKU</th>
                    <th className="py-4 px-6 w-64 text-center">Nombre</th>
                    <th className="py-4 px-6">Descripcion</th>
                    <th className="py-4 px-6 w-24">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {listaProductos.map((prod, index) => {
                    const stock = parseInt(prod.stock) || 0;

                    let rowStyles = "bg-white hover:bg-slate-50/80";
                    if (stock < 5) {
                      rowStyles =
                        "bg-red-50 hover:bg-red-100/70 transition-colors text-red-900";
                    } else if (stock >= 5 && stock <= 10) {
                      rowStyles =
                        "bg-amber-50 hover:bg-amber-100/70 transition-colors text-amber-900";
                    }

                    return (
                      <tr
                        key={prod.id_producto || prod.sku || index}
                        className={`${rowStyles} transition-colors duration-150`}
                      >
                        <td className="py-5 px-6 text-md">{prod.sku}</td>
                        <td className="py-5 px-6 text-md text-center">
                          {prod.nombre}
                        </td>
                        <td className="py-5 px-6 text-md">
                          {prod.descripcion}
                        </td>
                        <td className="py-5 px-6 text-md text-center">
                          {prod.stock}
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
