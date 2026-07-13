import { useEffect, useState } from "react";
import { categoriaService } from "../services/categoriaService";
import Swal from "sweetalert2";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recargarDatos, setRecargarDatos] = useState(0);

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        if (recargarDatos > 0) setLoading(true);
        const data = await categoriaService.getAll();
        if (activo) {
          setCategorias(data);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudieron cargar las categorías");
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

  const handleForm = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "El nombre de la categoría es obligatorio.",
        confirmButtonColor: "#008674",
      });
      return;
    }

    const object = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    Swal.fire({
      title: "Procesando...",
      text: "Guardando la nueva categoria",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await categoriaService.create(object);
      setNombre("");
      setDescripcion("");

      Swal.fire({
        icon: "success",
        title: "¡Creada!",
        text: "Categoría registrada con éxito.",
        confirmButtonColor: "#008674",
        timer: 1500,
      });

      setRecargarDatos((prev) => prev + 1);
    } catch (e) {
      console.error("Error", e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la categoría.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEliminar = async (id, nombreCat) => {
    const result = await Swal.fire({
      title: `¿Desactivar "${nombreCat}"?`,
      text: "Los productos asociados mantendrán su integridad, pero la categoría ya no estará disponible para nuevos registros",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#bcc9c5",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await categoriaService.delete(id);
        Swal.fire({
          icon: "success",
          title: "Desactivada",
          text: "La categoría ha sido dada de baja",
          confirmButtonColor: "#008674",
          timer: 1500,
        });
        setRecargarDatos((prev) => prev + 1);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo realizar la acción.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Gestion de Categorias
        </h1>
      </header>

      <main className="flex-1">
        <div className=" bg-white mx-auto max-w-7xl p-6 mt-6 rounded-xl border border-slate-200 shadow-md">
          <form className="flex gap-4 items-end" onSubmit={handleForm}>
            <div className="flex flex-col gap-1.5 flex-1 w-full">
              <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                Nombre de Categoria:
              </label>
              <input
                className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                placeholder="Ej: Tintas"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
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
            <div className="w-auto">
              <button
                className="w-full md:w-auto bg-[#008674] hover:bg-[#006e5f] px-4 py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                type="submit"
              >
                Crear Categoria
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white mx-auto max-w-7xl p-6 rounded-xl border border-slate-200 shadow-md mt-6">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Listado de Categorias
            </h2>
            <span className="text-sm bg-[#008674]/10 text-[#008674] font-bold px-3 py-1 rounded-full">
              {categorias.length} categorias
            </span>
          </div>

          {/*TABLA*/}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-800 font-medium">
                Cargando categorias...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium">
                {error}
              </div>
            ) : categorias.length === 0 ? (
              <div className="p-10 text-center text-slate-800 italic">
                No hay categorias registradas
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-24 text-center">ID</th>
                    <th className="py-4 px-6 w-64">Nombre</th>
                    <th className="py-4 px-6">Descripcion</th>
                    <th className="py-4 px-6 w-44 text-center">
                      Fecha Creacion
                    </th>
                    <th className="py-4 px-6 w-44 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr
                      key={cat.id_categoria}
                      className="hover:bg-slate-50/80 transition-colors duration-150"
                    >
                      <td className="py-5 px-6 text-center font-mono text-sm font-bold text-slate-400">
                        # {cat.id_categoria}
                      </td>
                      <td className="py-5 px-6 text-md text-black">
                        {cat.nombre}
                      </td>
                      <td className="py-5 px-6 text-md text-black">
                        {cat.descripcion}
                      </td>
                      <td className="py-5 px-10 text-md text-black">
                        {new Date(cat.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleEliminar(cat.id_categoria, cat.nombre)
                          }
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                          title="Desactivar categoría"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
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

export default Categorias;
