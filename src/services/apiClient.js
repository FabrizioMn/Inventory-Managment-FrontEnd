const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8080"
  : "https://inventory-managment-pd9e.onrender.com";

export async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const token = localStorage.getItem("token");

  const defaultHeader = {
    "Content-Type": "application/json",
    ...options.header,
  };

  if (token) {
    defaultHeader["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers: defaultHeader });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Ocurrio un error en el servidor");
  }

  return await response.json();
}
