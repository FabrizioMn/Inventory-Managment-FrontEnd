import { useEffect, useState } from "react";
import { proveedorService } from "../services/proveedorService";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [ruc, setRuc] = useState("");
  const [rznSocial, setRznSocial] = useState("");
  const [telf, setTelf] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        const data = await proveedorService.getAll();
        if (activo) {
          setProveedores(data);
          setError(null);
          console.log(data);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudieron cargar los proveedores");
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

    const rucLimpio = ruc.trim();
    const razonLimpia = rznSocial.trim();

    if (!rucLimpio || rucLimpio.length !== 11 || isNaN(rucLimpio)) {
      alert("El RUC es obligatorio y debe tener exactamente 11 números");
      return;
    }

    if (!razonLimpia) {
      alert("La Razón Social es obligatoria");
      return;
    }

    const object = {
      ruc: rucLimpio,
      razon_social: razonLimpia,
      telefono: telf,
    };

    try {
      const nuevoProvee = await proveedorService.create(object);
      setProveedores((prev) => [nuevoProvee, ...prev]);
      setRuc("");
      setRznSocial("");
      setTelf("");
      alert("¡Proveedor creado con exito!");
    } catch (e) {
      console.error("Error", e);
      alert(e.message || "No se pudo registrar el proveedor.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white min-h-24 flex items-center px-8 shadow-md">
        <h1 className="text-3xl text-[#3d4946] font-medium tracking-tight">
          Gestion de Proveedores
        </h1>
      </header>

      <main className="flex-1">
        <div className=" bg-white mx-auto max-w-7xl p-6 mt-6 rounded-xl border border-slate-200 shadow-md">
          <form className="flex gap-4 items-end" onSubmit={handleForm}>
            <div className="flex flex-col gap-1.5 flex-1 w-full">
              <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                RUC:
              </label>
              <input
                className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                placeholder="205633..."
                type="text"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-2 w-full">
              <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                Razon Social:
              </label>
              <input
                className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                placeholder="JJJ Color..."
                type="text"
                value={rznSocial}
                onChange={(e) => setRznSocial(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 w-full">
              <label className="block text-xs font-semibold text-[#3d4946] uppercase tracking-wider">
                Telefono:
              </label>
              <input
                className="w-full bg-white px-4 py-3 border border-[#bcc9c5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00685d]"
                placeholder="999-888-777"
                type="text"
                value={telf}
                onChange={(e) => setTelf(e.target.value)}
              />
            </div>
            <div className="w-auto">
              <button
                className="w-full md:w-auto bg-[#008674] hover:bg-[#006e5f] px-4 py-3 rounded-lg text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                type="submit"
              >
                Crear Proveedor
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white mx-auto max-w-7xl p-6 rounded-xl border border-slate-200 shadow-md mt-6">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-medium text-[#3d4946]">
              Listado de Proveedores
            </h2>
            <span className="text-sm bg-[#008674]/10 text-[#008674] font-bold px-3 py-1 rounded-full">
              {proveedores.length} proveedores
            </span>
          </div>

          {/*TABLA*/}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-800 font-medium">
                Cargando proveedores...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium">
                {error}
              </div>
            ) : proveedores.length === 0 ? (
              <div className="p-10 text-center text-slate-800 italic">
                No hay proveedores registrados
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-64">RUC</th>
                    <th className="py-4 px-6">Razón Social</th>
                    <th className="py-4 px-6">Telefono</th>
                    <th className="py-4 px-6 w-44 text-center">
                      Fecha Creacion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.map((prov) => (
                    <tr
                      key={prov.id_proveedor}
                      className="hover:bg-slate-50/80 transition-colors duration-150"
                    >
                      <td className="py-5 px-6 text-md text-black">
                        {prov.ruc}
                      </td>
                      <td className="py-5 px-6 text-md text-black">
                        {prov.razon_social}
                      </td>
                      <td className="py-5 px-6 text-md text-black">
                        {prov.telefono}
                      </td>
                      <td className="py-5 px-10 text-md text-black">
                        {new Date(prov.created_at).toLocaleDateString("es-ES", {
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

export default Proveedores;
