import { useEffect, useState } from "react";
import { categoriaService } from "../services/categoriaService";
import { productoService } from "../services/productoService";
import { transaccionService } from "../services/transaccionService";
import Swal from "sweetalert2";

function Ventas() {
  const [listaProductos, setListaProductos] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recargarDatos, setRecargarDatos] = useState(0);

  const obtenerNombreCategoria = (id) => {
    const resultado = listaCategorias.find(
      (cat) => cat.id_categoria === parseInt(id),
    );
    return resultado ? resultado.nombre : "Sin Categoría";
  };

  useEffect(() => {
    let activo = true;

    async function inciarCarga() {
      try {
        if (recargarDatos > 0) setLoading(true);
        const dataCategoria = await categoriaService.getAll(false);
        const dataProductos = await productoService.getAll();
        if (activo) {
          setListaCategorias(dataCategoria);
          setListaProductos(dataProductos);
          setError(null);
        }
      } catch (e) {
        console.error("Error", e);
        if (activo)
          setError("No se pudieron cargar los productos en este momento.");
      } finally {
        if (activo) setLoading(false);
      }
    }

    inciarCarga();

    return () => {
      activo = false;
    };
  }, [recargarDatos]);

  const listaFiltrada = listaProductos.filter((prod) => {
    const palabra = busqueda.toLowerCase().trim();

    if (!palabra) return true;

    const coincideNombre = prod.nombre.toLowerCase().includes(palabra);
    const coincideSKU = prod.sku.toLowerCase().includes(palabra);

    return coincideNombre || coincideSKU;
  });

  const agregarAlCarrito = (prod) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(
        (item) => item.id_producto === prod.id_producto,
      );

      if (existe) {
        if (existe.cantidad >= prod.stock) {
          Swal.fire({
            icon: "warning",
            title: "Stock máximo",
            text: `Solo quedan ${prod.stock} unidades de este producto`,
            confirmButtonColor: "#008674",
          });
          return prevCarrito;
        }

        return prevCarrito.map((item) =>
          item.id_producto === prod.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }

      return [
        ...prevCarrito,
        {
          id_producto: prod.id_producto,
          sku: prod.sku,
          nombre: prod.nombre,
          precio_unitario: parseFloat(prod.precio),
          cantidad: 1,
        },
      ];
    });
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Debe añadir al menos un producto para registrar la venta",
        confirmButtonColor: "#008674",
      });
      return;
    }

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    const idUsuarioActual = usuarioGuardado?.id_usuario || 1;

    const payloadVenta = {
      id_usuario: idUsuarioActual,
      productos: carrito.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    };

    Swal.fire({
      title: "Procesando venta...",
      text: "Guardando la transacción y rebajando inventario.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await transaccionService.registrarVenta(payloadVenta);
      Swal.fire({
        icon: "success",
        title: "¡Venta Realizada!",
        text: "La transacción se ha guardado y el stock fue actualizado",
        confirmButtonColor: "#008674",
      });
      setCarrito([]);
      setRecargarDatos((prev) => prev + 1);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "No se completó la venta",
        text:
          e.message ||
          "Ocurrió un error inesperado al procesar la transacción.",
        confirmButtonColor: "#008674",
      });
    }
  };

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio_unitario * item.cantidad,
    0,
  );

  const totalItemsCarrito = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );
  const total = subtotal;

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Gestión de Ventas
        </h1>
      </header>

      <main className="flex-1 flex justify-center">
        {/* SECCIÓN CATÁLOGO */}
        <div className="p-4 flex-2 items-center justify-start">
          {/* CABECERA */}
          <div className="mb-5 flex flex-col gap-4">
            {/* TÍTULO */}
            <div>
              <h2 className="text-4xl font-bold text-black">
                Catálogo de Productos
              </h2>
              <p className="text-md text-slate-500 mt-1 pl-0.5">
                Selecciona los productos para añadirlos a la venta
              </p>
            </div>
            {/* BUSCADOR */}
            <div className="w-full sm:max-w-xl">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
                className="w-full bg-slate-50 px-4 py-2.5 border border-[#bcc9c5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00685d]/20 focus:border-[#00685d] transition-all"
              />
            </div>
          </div>

          {/* Catálogo de Productos */}
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008674] mx-auto mb-3"></div>
                Sincronizando catálogo y stock...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium bg-white rounded-xl shadow-sm border border-red-100">
                {error}
              </div>
            ) : listaFiltrada.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic text-sm bg-white rounded-xl border border-slate-200">
                No se encontraron productos para la búsqueda
              </div>
            ) : (
              listaFiltrada.map((prod) => (
                <div
                  key={prod.id_producto || prod.sku}
                  className="bg-white hover:bg-slate-100/70 p-4 rounded-lg border border-slate-200 flex items-center gap-7"
                >
                  <span className="text-sm text-slate-500 font-mono font-bold">
                    {prod.sku}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold tracking-wide">
                      {prod.nombre}
                    </h3>
                    <span className="text-[#008674] font-semibold text-sm">
                      {obtenerNombreCategoria(prod.id_categoria)}
                    </span>
                  </div>
                  <div className="text-right min-w-20 ">
                    <span className="text-xs text-slate-400 block font-medium">
                      Stock
                    </span>
                    <span className="font-bold text-md text-slate-900 tracking-tight">
                      {prod.stock}
                    </span>
                  </div>
                  <div className="text-right min-w-20">
                    <span className="text-xs text-slate-400 block font-medium">
                      Precio
                    </span>
                    <span className="font-bold text-md text-slate-900 tracking-tight">
                      S/ {parseFloat(prod.precio).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="bg-[#008674]/10 hover:bg-[#008674] text-[#008674] hover:text-white p-2.5 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center shadow-sm"
                    title="Agregar a la venta"
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/*SECCION PRODUCTOS EN COMPRA*/}
        <div className="flex-1 flex flex-col min-w-87.5 border-2 border-slate-300">
          {/*CABECERA DEL CARRITO*/}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#3d4946] flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[#008674]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              Detalle de Venta
            </h2>
            <span className="text-xs font-bold bg-[#008674]/10 text-[#008674] px-2.5 py-1 rounded-full">
              {totalItemsCarrito} items
            </span>
          </div>

          {/* LISTADO DE PRODUCTOS A VENDER */}
          <div className="flex-4 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50 custom-scrollbar">
            {carrito.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center gap-2">
                <p className="text-sm italic font-medium">
                  El carrito está vacío
                </p>
                <p className="text-xs text-slate-400">
                  Agrega productos desde el catálogo de la izquierda
                </p>
              </div>
            ) : (
              carrito.map((item) => (
                <div
                  key={item.id_producto}
                  className="bg-white p-3 border border-slate-200 rounded-lg flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#3d4946] truncate">
                      {item.nombre}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      SKU: {item.sku}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.cantidad} x S/ {item.precio_unitario.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      S/ {(item.precio_unitario * item.cantidad).toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        setCarrito((prev) =>
                          prev.filter(
                            (p) => p.id_producto !== item.id_producto,
                          ),
                        )
                      }
                      className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen */}
          <div className="flex-1 border-t border-slate-200 p-5 bg-white flex flex-col gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
              </div>
              <hr className="border-dashed border-slate-200 my-0.5" />
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-[#3d4946]">
                  TOTAL
                </span>
                <span className="text-2xl font-black text-[#008674] tracking-tight">
                  S/ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* BOTON DE COMPRA */}
            <div className="flex items-center justify-center">
              <button
                onClick={finalizarVenta}
                className="w-80 bg-[#008674] hover:bg-[#006e5f] text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                Finalizar Venta
              </button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default Ventas;
