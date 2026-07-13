import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 h-screen w-80 flex flex-col items-center justify-center bg-[#008674] text-slate-100">
      <div className="px-2 py-8 text-center w-full">
        <h1 className="text-3xl font-bold tracking-wider">InvManager</h1>
      </div>
      <ul className=" flex-1 flex flex-col py-8 px-3 gap-3 w-full">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg font-medium rounded-lg hover:bg-white/40  ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categorias"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Categorias
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/productos"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Inventario
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/proveedores"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Proveedores
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ventas"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Nueva Venta
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/historial-ventas"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Registro de Ventas
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/abastecimiento"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Registrar Stock
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/historial-abastecimientos"
            className={({ isActive }) =>
              `flex px-5 py-3 text-lg rounded-lg font-medium hover:bg-white/40 ${
                isActive
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-slate-100 font-normal"
              }`
            }
          >
            Movimientos de Stock
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
