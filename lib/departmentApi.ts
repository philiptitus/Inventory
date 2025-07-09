// Department API logic for Inventory Dashboard

export async function apiFetchDepartments(page = 1, limit = 10, token?: string) {
  const res = await fetch(`/api/department?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch departments");
  return res.json();
}

export async function apiCreateDepartment(Dep_ID: number, Dep_name: string, token?: string) {
  const res = await fetch("/api/department", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Dep_ID, Dep_name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create department");
  }
  return res.json();
}

export async function apiUpdateDepartment(id: number, Dep_ID?: number, Dep_name?: string, token?: string) {
  const res = await fetch("/api/department", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, Dep_ID, Dep_name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update department");
  }
  return res.json();
}

export async function apiDeleteDepartment(id: number, token?: string) {
  const res = await fetch("/api/department", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete department");
  }
  return res.json();
} 