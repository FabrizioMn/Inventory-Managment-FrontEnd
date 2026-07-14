const BASE_URL = "http://localhost:8080";

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
