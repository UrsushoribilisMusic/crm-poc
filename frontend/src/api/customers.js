const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function fetchCustomers({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const res = await fetch(`${BASE_URL}/customers?${params}`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}
