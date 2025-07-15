// Model API logic for Inventory Dashboard

export async function fetchModels(page = 1, limit = 10, token?: string, search?: string) {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`/api/model?page=${page}&limit=${limit}${searchParam}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

export async function createModel(model_name: string, token?: string) {
  const res = await fetch("/api/model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ model_name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create model");
  }
  return res.json();
}

export async function updateModel(id: number, model_name: string, token?: string) {
  const res = await fetch("/api/model", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, model_name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update model");
  }
  return res.json();
}

export async function deleteModel(id: number, token?: string) {
  const res = await fetch("/api/model", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete model");
  }
  return res.json();
} 