// Category API logic for Inventory Dashboard

export async function fetchCategories(page = 1, limit = 10, token?: string) {
  const res = await fetch(`/api/category?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function updateCategory(id: number, category_name: string, token?: string) {
  const res = await fetch("/api/category", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, category_name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update category");
  }
  return res.json();
}

export async function deleteCategory(id: number, token?: string) {
  const res = await fetch("/api/category", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete category");
  }
  return res.json();
} 