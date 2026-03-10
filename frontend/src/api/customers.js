export async function fetchCustomers({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  
  // Explicitly try relative paths first for Vite proxy
  const url = `/customers/?${params}`;
  console.log('Fetching customers from:', url);
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch customers: ${res.status}`);
  }
  return res.json();
}
