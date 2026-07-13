import { useEffect, useState } from "react";
import { categoriaService } from "../services/categoriaService";
import { productoService } from "../services/productoService";
import Swal from "sweetalert2";

function Productos() {
  const [sku, setSku] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [listaCategorias, setListaCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recargarDatos, setRecargarDatos] = useState(0);

  useEffect(() => {
    let activo = true;

    async function iniciarCarga() {
      try {
        if (recargarDatos > 0) setLoading(true);
        const dataCategoria = await categoriaService.getAll(false);
        const dataProductos = await productoService.getAll(false);

        if (activo) {
          setListaCategorias(dataCategoria);
          setProductos(dataProductos);
          setError(null);
        }
      } catch (e) {
        console.error("Error", e);
        if (activo) setError("No se pudieron cargar los productos");
      } finally {
        if (activo) setLoading(false);
      }
    }

    iniciarCarga();

    return () => {
      activo = false;
    };
  }, [recargarDatos]);

  const handleForm = async (e) => {
    e.preventDefault();
    if (!sku.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo obligatorio",
        text: "El campo SKU / CÓDIGO es requerido para registrar el producto.",
        confirmButtonColor: "#008674",
      });
      return;
    }

    if (!nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre ausente",
        text: "El Nombre del Producto es obligatorio.",
        confirmButtonColor: "#008674",
      });
      return;
    }

    const precioNumerico = parseFloat(precio);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      Swal.fire({
        icon: "error",
        title: "Precio inválido",
        text: "Por favor, ingrese un precio válido y mayor a S/. 0.00",
        confirmButtonColor: "#008674",
      });
      return;
    }

    if (!categoria) {
      Swal.fire({
        icon: "warning",
        title: "Campo obligatorio",
        text: "Debe seleccionar una categoría",
        confirmButtonColor: "#008674",
      });
      return;
    }

    const nuevoProducto = {
      sku: sku.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: precioNumerico,
      id_categoria: parseInt(categoria),
      stock: 0,
    };

    Swal.fire({
      title: "Guardando producto...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      await productoService.create(nuevoProducto);

      setSku("");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");

      Swal.fire({
        title: "¡Éxito!",
        text: "Producto creado exitosamente",
        icon: "success",
        confirmButtonColor: "#008674",
        timer: 1500,
      });

      setRecargarDatos((prev) => prev + 1);
    } catch (e) {
      console.error("ERROR", e);
      Swal.fire({
        icon: "error",
        title: "Error de registro",
        text:
          e.message || "No se pudo crear el producto. Verifique duplicados.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const obtenerNombreCategoria = (id) => {
    const encontrada = listaCategorias.find(
      (c) => c.id_categoria === parseInt(id),
    );
    return encontrada ? encontrada.nombre : "Sin categoria";
  };

  const descontinuarProducto = async (id, nombreProducto) => {
    const resultado = await Swal.fire({
      title: `¿Descontinuar producto?`,
      text: `El producto "${nombreProducto}" ya no aparecerá en el catálogo de ventas ni en cargas de stock.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#bcc9c5",
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await productoService.delete(id);

        Swal.fire({
          title: "¡Desactivado!",
          text: "El producto ha sido dado de baja de forma lógica.",
          icon: "success",
          confirmButtonColor: "#008674",
          timer: 1500,
        });

        setRecargarDatos((prev) => prev + 1);
      } catch (e) {
        console.error("Error al eliminar:", e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar el estado del producto.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const categoriasActivas = listaCategorias.filter((cat) => cat.activo);

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Gestion de Productos
        </h1>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className=" bg-white mx-auto max-w-7xl p-6 mt-6 rounded-xl border border-slate-200 shadow-md">
          <form className="flex flex-col gap-4 items-end" onSubmit={handleForm}>
            <div className="w-full flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1 w-full">
                <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                  SKU / CODIGO:
                </label>
                <input
                  className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                  placeholder="Ej: Tintas"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-2 w-full">
                <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                  Nombre de Producto:
                </label>
                <input
                  className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                  placeholder="Ej: Tintas"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 w-full">
                <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                  Categoria:
                </label>
                <select
                  className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Seleccione una categoria</option>
                  {categoriasActivas.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full flex gap-4">
              <div className="flex flex-col gap-1.5 flex-2 w-full">
                <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                  Descripcion:
                </label>
                <input
                  className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                  placeholder="Breve descripcion..."
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 w-full max-w-75">
                <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                  Precio:
                </label>
                <input
                  className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                  placeholder="Breve descripcion..."
                  type="text"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
            </div>
            <div className="w-auto">
              <button
                className="w-full md:w-auto bg-[#008674] hover:bg-[#006e5f] px-4 py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                type="submit"
              >
                Crear Producto
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white mx-auto max-w-7xl p-6 rounded-xl border border-slate-200 shadow-md mt-6">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Listado de Productos
            </h2>
            <span className="text-sm bg-[#008674]/10 text-[#008674] font-bold px-3 py-1 rounded-full">
              {productos.length} productos
            </span>
          </div>

          {/*TABLA*/}
          <div className="overflow-x-auto max-h-120 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 text-center text-slate-800 font-medium">
                Cargando productos...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium">
                {error}
              </div>
            ) : productos.length === 0 ? (
              <div className="p-10 text-center text-slate-800 italic">
                No hay productos registradas
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                    <th className="py-4 px-6 w-24 text-center">SKU</th>
                    <th className="py-4 px-6 w-64">Nombre</th>
                    <th className="py-4 px-6">Descripcion</th>
                    <th className="py-4 px-6 w-24">Categoria</th>
                    <th className="py-4 px-6 w-24">Precio</th>
                    <th className="py-4 px-6 w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod, index) => (
                    <tr
                      key={prod.id_producto || prod.sku || index}
                      className="hover:bg-slate-50/80 transition-colors duration-150"
                    >
                      <td className="py-5 px-6 text-md text-black">
                        {prod.sku}
                      </td>
                      <td className="py-5 px-6 text-md text-black">
                        {prod.nombre}
                      </td>
                      <td className="py-5 px-6 text-md text-black">
                        {prod.descripcion}
                      </td>
                      <td className="py-5 px-6 text-md text-black text-center">
                        {obtenerNombreCategoria(prod.id_categoria)}
                      </td>
                      <td className="py-5 px-6 text-md text-black text-center">
                        S/{prod.precio}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer group"
                            title="Eliminar producto"
                            onClick={() => {
                              descontinuarProducto(
                                prod.id_producto,
                                prod.nombre,
                              );
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 55 55"
                              className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                              id="trash"
                            >
                              <path
                                d="M43.19,7.97h-8.42V5.51c0-1.66-1.35-3.01-3.01-3.01h-8.52c-1.66,0-3.01,1.35-3.01,3.01v2.46h-8.42
          c-2.32,0-4.22,1.89-4.22,4.22v4.14c0,0.55,0.45,1,1,1h2.09v30.96c0,2.33,1.89,4.22,4.21,4.22H40.1c2.33,0,4.22-1.89,4.22-4.22
          V17.32h2.09c0.55,0,1-0.45,1-1v-4.14C47.41,9.86,45.52,7.97,43.19,7.97z M22.23,5.51c0-0.56,0.45-1.01,1.01-1.01h8.52
          c0.56,0,1.01,0.45,1.01,1.01v2.46H22.23V5.51z M42.32,48.28c0,1.23-0.99,2.22-2.22,2.22H14.89c-1.22,0-2.21-0.99-2.21-2.22V17.32
          h29.64V48.28z M45.41,15.32H9.59v-3.14c0-1.22,0.99-2.22,2.22-2.22h31.39c1.22,0,2.22,0.99,2.22,2.22V15.32z"
                              />
                              <path d="M30.77 46.5c.55 0 1-.45 1-1V22.32c0-.55-.45-1-1-1s-1 .45-1 1V45.5C29.77 46.05 30.22 46.5 30.77 46.5zM24.23 46.5c.55 0 1-.45 1-1V22.32c0-.55-.45-1-1-1s-1 .45-1 1V45.5C23.23 46.05 23.67 46.5 24.23 46.5zM37.32 46.5c.55 0 1-.45 1-1V22.32c0-.55-.45-1-1-1s-1 .45-1 1V45.5C36.32 46.05 36.77 46.5 37.32 46.5zM17.68 46.5c.55 0 1-.45 1-1V22.32c0-.55-.45-1-1-1s-1 .45-1 1V45.5C16.68 46.05 17.13 46.5 17.68 46.5z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}

export default Productos;
