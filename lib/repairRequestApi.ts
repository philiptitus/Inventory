// Repair Request API service for Inventory Dashboard

type RepairRequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
type SortOrder = 'asc' | 'desc';
type SortField = 'requestedAt' | 'updatedAt' | 'completedAt' | 'status' | 'issue';

interface RepairRequest {
  id: number;
  status: RepairRequestStatus;
  issue: string;
  adminNotes?: string;
  requestedAt: string;
  updatedAt?: string;
  completedAt?: string;
  itemId: number;
  allocationId: number;
  requestedById: number;
  completedById?: number;
  item: {
    id: number;
    pname: string;
    serialno: string;
  };
  requestedBy: {
    id: number;
    name: string;
    email: string;
  };
  completedBy?: {
    id: number;
    name: string;
    email: string;
  };
  allocation: {
    id: number;
    status: string;
    Date_Allocated: string;
    user: {
      id: number;
      name: string;
      email: string;
      department: {
        id: number;
        Dep_name: string;
      };
    };
  };
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CreateRepairRequestData {
  allocationId: number;
  issue: string;
  additionalNotes?: string;
}

interface UpdateRepairRequestData {
  status: RepairRequestStatus;
  adminNotes?: string;
  isItemFixed?: boolean;
}

interface FetchRepairRequestsParams {
  page?: number;
  limit?: number;
  status?: RepairRequestStatus;
  search?: string;
  allocationId?: number;
  itemId?: number;
  requestedById?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

/**
 * Fetches a paginated list of repair requests with filtering and sorting options
 */
export async function fetchRepairRequests(
  params: FetchRepairRequestsParams,
  token: string
): Promise<PaginatedResponse<RepairRequest>> {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    allocationId,
    itemId,
    requestedById,
    sortBy = 'requestedAt',
    sortOrder = 'desc',
  } = params;

  // Build query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(search && { search }),
    ...(allocationId && { allocationId: allocationId.toString() }),
    ...(itemId && { itemId: itemId.toString() }),
    ...(requestedById && { requestedById: requestedById.toString() }),
    sortBy,
    sortOrder,
  });

  const res = await fetch(`/api/repair-request?${queryParams}`, {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch repair requests');
  }

  return res.json();
}

/**
 * Fetches a single repair request by ID
 */
export async function fetchRepairRequest(
  id: number,
  token: string
): Promise<{ success: boolean; repairRequest: RepairRequest }> {
  const res = await fetch(`/api/repair-request/${id}`, {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Failed to fetch repair request #${id}`);
  }

  return res.json();
}

/**
 * Creates a new repair request
 */
export async function createRepairRequest(
  data: CreateRepairRequestData,
  token: string
): Promise<{ success: boolean; repairRequest: RepairRequest }> {
  const res = await fetch('/api/repair-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      allocationId: data.allocationId,
      issue: data.issue,
      additionalNotes: data.additionalNotes,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create repair request');
  }

  return res.json();
}

/**
 * Updates a repair request status (Admin only)
 */
export async function updateRepairRequest(
  id: number,
  data: UpdateRepairRequestData,
  token: string
): Promise<{ success: boolean; repairRequest: RepairRequest }> {
  // Create a clean request body with only the necessary fields
  const requestBody: any = {
    id: id,
    status: data.status
  };

  // Only include adminNotes if it's explicitly provided and not empty
  if ('adminNotes' in data && data.adminNotes !== undefined && data.adminNotes.trim() !== '') {
    requestBody.adminNotes = data.adminNotes;
  }
  
  // Only include isItemFixed if status is 'completed'
  if (data.status === 'completed' && data.isItemFixed !== undefined) {
    requestBody.isItemFixed = data.isItemFixed;
  }

  const res = await fetch('/api/repair-request', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Failed to update repair request #${id}`);
  }

  return res.json();
}

/**
 * Fetches repair requests for a specific allocation
 */
export async function fetchRepairRequestsByAllocation(
  allocationId: number,
  token: string,
  params: Omit<FetchRepairRequestsParams, 'allocationId'> = {}
): Promise<PaginatedResponse<RepairRequest>> {
  return fetchRepairRequests({ ...params, allocationId }, token);
}

/**
 * Fetches repair requests for a specific item
 */
export async function fetchRepairRequestsByItem(
  itemId: number,
  token: string,
  params: Omit<FetchRepairRequestsParams, 'itemId'> = {}
): Promise<PaginatedResponse<RepairRequest>> {
  return fetchRepairRequests({ ...params, itemId }, token);
}

/**
 * Fetches repair requests for the current user
 */
export async function fetchMyRepairRequests(
  userId: number,
  token: string,
  params: Omit<FetchRepairRequestsParams, 'requestedById'> = {}
): Promise<PaginatedResponse<RepairRequest>> {
  return fetchRepairRequests({ ...params, requestedById: userId }, token);
}
