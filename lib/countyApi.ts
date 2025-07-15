// County API logic for Inventory Dashboard

export async function fetchCounties(page = 1, limit = 10, token?: string, search?: string) {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`/api/county?page=${page}&limit=${limit}${searchParam}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch counties");
  return res.json();
}

export async function createCounty(county_name: string, county_number: number, token?: string) {
  const res = await fetch("/api/county", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ county_name, county_number }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create county");
  }
  return res.json();
}

export async function updateCounty(id: number, county_name: string, county_number: number, token?: string) {
  console.log('updateCounty called', { id, county_name, county_number });
  const res = await fetch("/api/county", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, county_name, county_number }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update county");
  }
  return res.json();
}

export async function apiDeleteCounty(id: number, token?: string) {
  const res = await fetch("/api/county", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete county");
  }
  return res.json();
} 