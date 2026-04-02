const API_URL = process.env.NEXT_PUBLIC_API_URL;

function isFormData(body: RequestInit["body"]): boolean {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("token");
  const formData = isFormData(options?.body);

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(!formData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro");
  }

  return data;
}