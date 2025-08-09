// lib/allocationApi.ts
import type { Allocation } from "@/types/inventory";

const API_URL = "/api/allocation";

export async function apiFetchAllocations(token: string, params: { userId?: number; itemId?: number; status?: string; page?: number; limit?: number; search?: string } = {}) {
  const url = new URL(API_URL, window.location.origin);
  if (params.userId) url.searchParams.append("userId", params.userId.toString());
  if (params.itemId) url.searchParams.append("itemId", params.itemId.toString());
  if (params.status) url.searchParams.append("status", params.status);
  if (params.page) url.searchParams.append("page", params.page.toString());
  if (params.limit) url.searchParams.append("limit", params.limit.toString());
  if (params.search) url.searchParams.append("search", params.search);
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

export interface CreateAllocationParams {
  userId?: number;
  itemId: number;
  message?: string;
}

export async function apiCreateAllocation(data: CreateAllocationParams, token: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.error || "Failed to create allocation");
  }
  return responseData;
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
  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.error || "Failed to update allocation");
  }
  return responseData;
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

export interface ReturnRequestParams {
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
  search?: string;
}

export async function apiFetchReturnRequests(token: string, params: ReturnRequestParams = {}) {
  const url = new URL('/api/allocation/return-request', window.location.origin);
  
  if (params.status) url.searchParams.append('status', params.status);
  if (params.page) url.searchParams.append('page', params.page.toString());
  if (params.limit) url.searchParams.append('limit', params.limit.toString());
  if (params.search) url.searchParams.append('search', params.search);
  
  const res = await fetch(url.toString(), {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });
  
  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.error || 'Failed to fetch return requests');
  }
  return responseData;
}

export async function apiCreateReturnRequest(data: { allocationId: number; message?: string }, token: string) {
  const res = await fetch('/api/allocation/return-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.error || 'Failed to create return request');
  }
  return responseData;
}

export async function apiUpdateReturnRequestStatus(
  requestId: number, 
  data: { status: 'approved' | 'rejected'; adminNotes?: string }, 
  token: string
) {
  const res = await fetch('/api/allocation/return-request', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      requestId,
      ...data
    })
  });

  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.error || 'Failed to update return request status');
  }
  return responseData;
}