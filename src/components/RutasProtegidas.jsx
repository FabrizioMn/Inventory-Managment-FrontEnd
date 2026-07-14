import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function RutasProtegidas() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <main className="pl-80 min-h-screen bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}

export default RutasProtegidas;
