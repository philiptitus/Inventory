// Fetch all users (admin only)
export async function apiFetchAllUsers(token: string, search?: string) {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`/api/user?all=true${searchParam}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
}

// Fetch user details by ID (admin only)
export async function apiFetchUserById(token: string, userId: number) {
  const res = await fetch(`/api/user?id=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user details');
  }
  return res.json();
}

// Delete user by ID (admin only)
export async function apiDeleteUserById(token: string, userId: number) {
  const res = await fetch(`/api/user?id=${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete user');
  }
  return res.json();
}

// Add user as admin (admin only)
export async function apiAdminAddUser(token: string, userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  isAdmin?: boolean;
  departmentId?: number;
  county: string;
}) {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ action: 'admin_add', ...userData }),
  });
  if (!res.ok) {
    throw new Error('Failed to add user');
  }
  return res.json();
} 