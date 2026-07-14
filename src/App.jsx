import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Categorias from "./pages/Categorias";
import Proveedores from "./pages/Proveedores";
import HistorialVentas from "./pages/HistorialVentas";
import Abastecimiento from "./pages/Abastecimiento";
import HistorialAbastecimientos from "./pages/HistorialAbastecimientos";
import Login from "./pages/Login";
import RutasProtegidas from "./components/RutasProtegidas";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RutasProtegidas />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/historial-ventas" element={<HistorialVentas />} />
            <Route path="/abastecimiento" element={<Abastecimiento />} />
            <Route
              path="/historial-abastecimientos"
              element={<HistorialAbastecimientos />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
