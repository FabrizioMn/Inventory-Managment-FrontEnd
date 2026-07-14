import { useEffect, useState } from "react";
import { proveedorService } from "../services/proveedorService";
import Swal from "sweetalert2";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [ruc, setRuc] = useState("");
  const [rznSocial, setRznSocial] = useState("");
  const [telf, setTelf] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recargarDatos, setRecargarDatos] = useState(0);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    let activo = true;
    async function iniciarCarga() {
      try {
        if (recargarDatos > 0) setLoading(true);
        const data = await proveedorService.getAll(false);
        if (activo) {
          setProveedores(data);
          setError(null);
        }
      } catch (e) {
        if (activo) {
          setError("No se pudieron cargar los proveedores");
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

    const rucLimpio = ruc.trim();
    const razonLimpia = rznSocial.trim();

    if (!rucLimpio || rucLimpio.length !== 11 || isNaN(rucLimpio)) {
      Swal.fire({
        icon: "warning",
        title: "RUC Inválido",
        text: "El RUC es obligatorio y debe tener exactamente 11 dígitos numericos",
        confirmButtonColor: "#008674",
      });
      return;
    }

    if (!razonLimpia) {
      Swal.fire({
        icon: "warning",
        title: "Campo obligatorio",
        text: "La Razon Social es obligatoria",
        confirmButtonColor: "#008674",
      });
      return;
    }

    const object = {
      ruc: rucLimpio,
      razon_social: razonLimpia,
      telefono: telf.trim(),
    };

    try {
      Swal.fire({
        title: "Guardando proveedor...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await proveedorService.create(object);

      setRuc("");
      setRznSocial("");
      setTelf("");

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Proveedor registrado correctamente.",
        confirmButtonColor: "#008674",
        timer: 1500,
      });

      setRecargarDatos((prev) => prev + 1);
    } catch (e) {
      console.error("Error", e);
      Swal.fire({
        icon: "error",
        title: "Error de registro",
        text:
          e.message ||
          "No se pudo registrar el proveedor. Verifique que el RUC no esté duplicado.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEliminar = async (id, razonSocial) => {
    const result = await Swal.fire({
      title: `¿Desactivar a ${razonSocial}?`,
      text: "Ya no se podrán registrar nuevas órdenes de abastecimiento con este proveedor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#bcc9c5",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await proveedorService.delete(id);
        Swal.fire({
          icon: "success",
          title: "Desactivado",
          text: "El proveedor ha sido dado de baja.",
          confirmButtonColor: "#008674",
          timer: 1500,
        });
        setRecargarDatos((prev) => prev + 1);
      } catch (e) {
        console.error(e);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar el estado del proveedor.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const proveedoresActivos = proveedores.filter((prov) => prov.activo);

  const listaFiltrada = proveedoresActivos.filter((prov) => {
    const palabra = busqueda.toLowerCase().trim();

    if (!palabra) return true;

    const coincideNombre = prov.razon_social.toLowerCase().includes(palabra);
    const coincideRUC = prov.ruc.toLowerCase().includes(palabra);

    return coincideNombre || coincideRUC;
  });

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
            <div className="w-full sm:max-w-xl">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre"
                className="w-full bg-slate-50 px-4 py-2.5 border border-[#bcc9c5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00685d]/20 focus:border-[#00685d] transition-all"
              />
            </div>
            <span className="text-sm bg-[#008674]/10 text-[#008674] font-bold px-3 py-1 rounded-full">
              {listaFiltrada.length} proveedores
            </span>
          </div>

          {/*TABLA*/}
          <div className="overflow-x-auto max-h-100 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 text-center text-slate-800 font-medium">
                Cargando proveedores...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-medium">
                {error}
              </div>
            ) : listaFiltrada.length === 0 ? (
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
                    <th className="py-4 px-6 w-44 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaFiltrada.map((prov) => (
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

                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleEliminar(prov.id_proveedor, prov.razon_social)
                          }
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                          title="Desactivar proveedor"
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

export default Proveedores;
