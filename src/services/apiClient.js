const BASE_URL = "http://localhost:8080";

export async function apiClient(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeader = {
    "Content-Type": "application/json",
    ...options.header,
  };

  try {
    const response = await fetch(url, { ...options, headers: defaultHeader });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (e) {
    console.error("Error en la peticion:", e);
  }
}
