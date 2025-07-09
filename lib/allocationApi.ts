// lib/allocationApi.ts
import type { Allocation } from "@/types/inventory";

const API_URL = "/api/allocation";

export async function apiFetchAllocations(token: string, params: { userId?: number; itemId?: number; status?: string; page?: number; limit?: number } = {}) {
  const url = new URL(API_URL, window.location.origin);
  if (params.userId) url.searchParams.append("userId", params.userId.toString());
  if (params.itemId) url.searchParams.append("itemId", params.itemId.toString());
  if (params.status) url.searchParams.append("status", params.status);
  if (params.page) url.searchParams.append("page", params.page.toString());
  if (params.limit) url.searchParams.append("limit", params.limit.toString());
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch allocations");
  return res.json();
}

export async function apiFetchAllocationById(id: number, token: string) {
  const res = await fetch(`${API_URL}?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch allocation details");
  return res.json();
}

export async function apiCreateAllocation(data: { userId: number; itemId: number; message?: string }, token: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create allocation");
  return res.json();
}

export async function apiUpdateAllocation(id: number, data: { message?: string; status?: string }, token: string) {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update allocation");
  return res.json();
}

export async function apiDeleteAllocation(id: number, token: string) {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete allocation");
  return res.json();
} 