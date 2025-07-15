// lib/itemApi.ts
import type { Item } from "@/types/inventory";

const API_URL = "/api/inventory";

export async function apiFetchItems(token: string, page = 1, limit = 10, search?: string) {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_URL}?page=${page}&limit=${limit}${searchParam}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function apiFetchItemById(id: number, token: string) {
  const res = await fetch(`/api/inventory?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch item details");
  return res.json();
}

export async function apiCreateItem(data: Omit<Item, "id">, token: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function apiUpdateItem(id: number, data: Partial<Omit<Item, "id">>, token: string) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

export async function apiDeleteItem(id: number, token: string) {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
} 