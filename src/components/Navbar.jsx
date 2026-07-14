import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 h-screen w-80 flex flex-col  bg-[#008674] text-slate-100">
      <div className="px-6 py-8 text-center w-full shrink-0">
        <h1 className="text-3xl font-black tracking-wider uppercase">
          InvManager
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 custom-scrollbar">
        {/*GRUPO GENERAL*/}
        <div className="flex flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40  ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Inicio
          </NavLink>
        </div>

        {/*GRUPO OPERACIONES*/}
        <div className="flex flex-col gap-2">
          <span className="px-4 text-[11px] font-bold text-teal-200/60 uppercase tracking-widest mb-1 block">
            Operaciones
          </span>
          <NavLink
            to="/ventas"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Punto de Venta
          </NavLink>
          <NavLink
            to="/abastecimiento"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Ingreso de Stock
          </NavLink>
        </div>

        {/* GRUPO CATALOGO/PROVEEDORES */}
        <div className="flex flex-col gap-2">
          <span className="px-4 text-[11px] font-bold text-teal-200/60 uppercase tracking-widest mb-1 block">
            Almacen y Proveedores
          </span>
          <NavLink
            to="/categorias"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Categorias
          </NavLink>
          <NavLink
            to="/productos"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/proveedores"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Proveedores
          </NavLink>
        </div>

        {/* GRUPO REPORTES/HISTORIAL */}
        <div className="flex flex-col gap-2">
          <span className="px-4 text-[11px] font-bold text-teal-200/60 uppercase tracking-widest mb-1 block">
            Historiales
          </span>
          <NavLink
            to="/historial-ventas"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Historial de Ventas
          </NavLink>
          <NavLink
            to="/historial-abastecimientos"
            className={({ isActive }) =>
              `flex px-4 py-2.5 text-md rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Historial de Entradas
          </NavLink>
        </div>
      </div>

      {/*FOOTER*/}
      <div className="p-4 bg-teal-950/20 shrink-0 w-full">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="cursor-pointer flex px-4 py-2.5 text-sm rounded-lg font-medium hover:bg-white/40 w-full"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
