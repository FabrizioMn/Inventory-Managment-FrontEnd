const BASE_URL = "http://localhost:8080";

export async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeader = {
    "Content-Type": "application/json",
    ...options.header,
  };

  const response = await fetch(url, { ...options, headers: defaultHeader });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Ocurrio un error en el servidor");
  }
  
  return await response.json();
}
