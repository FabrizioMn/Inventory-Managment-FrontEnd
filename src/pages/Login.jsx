// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Por favor, llene todos los campos.", confirmButtonColor: "#008674" });
      return;
    }

    setLoading(false);
    try {
      // Consumimos el endpoint que creamos en el backend
      const data = await apiClient("/usuarios/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Guardamos credenciales y token de forma persistente
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      Swal.fire({ icon: "success", title: "¡Bienvenido!", text: `Sesión iniciada correctamente`, confirmButtonColor: "#008674", timer: 1500, showConfirmButton: false });
      
      // Redirigimos al Dashboard (Inicio)
      navigate("/");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error de autenticación", text: err.message || "Credenciales incorrectas.", confirmButtonColor: "#d33" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[#008674] tracking-tight">InvManager</h1>
          <p className="text-slate-400 mt-2 text-sm">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full bg-slate-50 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685d]/20 focus:border-[#00685d] transition-all text-sm text-slate-800"
              placeholder="admin@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Contraseña</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685d]/20 focus:border-[#00685d] transition-all text-sm text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-[#008674] hover:bg-[#006e5f] text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;