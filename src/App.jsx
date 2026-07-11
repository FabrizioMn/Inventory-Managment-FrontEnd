import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Categorias from "./pages/Categorias";
import Movimientos from "./pages/Movimientos";
import Proveedores from "./pages/Proveedores";
import Navbar from "./components/Navbar";
import HistorialVentas from "./pages/HistorialVentas";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <main className="pl-80 min-h-screen">
          <div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/historial-ventas" element={<HistorialVentas />} />
              <Route path="/movimientos" element={<Movimientos />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
