import { useEffect, useState } from "react";
import { categoriaService } from "../services/categoriaService";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        const data = await categoriaService.getAll();
        if (activo) {
          setCategorias(data);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudieron cargar las categorias");
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

  const handleForm = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const object = {
      nombre: nombre.trim(),
      descripcion: descripcion,
    };

    try {
      const nuevaCat = await categoriaService.create(object);
      setCategorias((prev) => [nuevaCat, ...prev]);
      setNombre("");
      setDescripcion("");
      alert("Categoria creada con exito");
    } catch (e) {
      console.error("Error", e);
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
