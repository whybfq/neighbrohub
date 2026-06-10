const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8090/api/v1';

interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Type': 'admin',
      Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
      ...(options.headers || {}),
    },
  });
  const json: ApiResult<T> = await res.json();
  if (json.code !== 0) {
    throw new Error(json.message || '请求失败');
  }
  return json.data;
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ token: string; name: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getDashboard: () => request<any>('/admin/dashboard'),

  getProducts: () => request<any[]>('/admin/products'),

  toggleProductStatus: (id: string) =>
    request(`/admin/products/${id}/status`, { method: 'PUT' }),

  getInventory: () => request<any[]>('/admin/inventory'),

  getInboundRecords: () => request<any[]>('/admin/inbound'),

  getOrders: (status?: string) =>
    request<any[]>(status && status !== 'all' ? `/admin/orders?status=${status}` : '/admin/orders'),

  getCouriers: () => request<any[]>('/admin/couriers'),

  approveCourier: (id: string) =>
    request(`/admin/couriers/${id}/approve`, { method: 'PUT' }),

  suspendCourier: (id: string) =>
    request(`/admin/couriers/${id}/suspend`, { method: 'PUT' }),

  getWarehouse: () => request<any>('/admin/warehouse'),
};
