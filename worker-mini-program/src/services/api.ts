import Taro from '@tarojs/taro';
import { API_BASE_URL, USE_MOCK_API, PAGE_PATH } from '../config/constants';
import {
  mockWorkerUser,
  mockDashboard,
  mockInboundRecent,
  mockPickTasks,
  mockPickDetail,
  mockDeliveryPool,
  mockActiveDelivery,
} from './mockData';

const request = async <T>(url: string, options: any = {}): Promise<T> => {
  if (USE_MOCK_API) {
    return mockRequest(url, options) as T;
  }

  const res = await Taro.request({
    url: `${API_BASE_URL}${url}`,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Taro.getStorageSync('worker_token')}`,
      'X-Client-Type': 'worker',
    },
  });

  if (res.statusCode === 401) {
    Taro.removeStorageSync('worker_token');
    Taro.redirectTo({ url: PAGE_PATH.LOGIN });
    throw new Error('登录已过期，请重新登录');
  }

  if (res.statusCode === 200 && res.data.code === 0) {
    return res.data.data as T;
  }
  throw new Error(res.data.message || '请求失败');
};

const mockRequest = (url: string, _options: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url.includes('/worker/dashboard')) return resolve(mockDashboard);
      if (url.includes('/worker/profile')) return resolve(mockWorkerUser);
      if (url.includes('/wms/inbound/recent')) return resolve(mockInboundRecent);
      if (url.includes('/wms/pick/tasks/PT')) return resolve(mockPickDetail);
      if (url.includes('/wms/pick/tasks')) return resolve(mockPickTasks);
      if (url.includes('/delivery/pool')) return resolve({ online: true, list: mockDeliveryPool, holdingCount: mockDashboard.holdingCount, maxHold: 100 });
      if (url.includes('/delivery/active')) return resolve(mockActiveDelivery);
      if (url.includes('/worker/login')) return resolve({ token: 'mock_worker_token', user: mockWorkerUser });
      resolve({ success: true });
    }, 200);
  });
};

export const workerApi = {
  login: (data: { code?: string; phone?: string; consumerUserId?: string; nickname?: string }) =>
    request('/worker/login', { method: 'POST', data }),
  register: (data?: { nickname?: string; phone?: string; consumerUserId?: string }) =>
    request('/worker/register', { method: 'POST', data: data || {} }),
  getProfile: () => request('/worker/profile'),
  getDashboard: () => request('/worker/dashboard'),
  getInboundRecent: () => request('/wms/inbound/recent'),
  submitInbound: (data: any) => request('/wms/inbound', { method: 'POST', data }),
  getPickTasks: () => request('/wms/pick/tasks'),
  getPickDetail: (id: string) => request(`/wms/pick/tasks/${id}`),
  completePick: (id: string) => request(`/wms/pick/tasks/${id}/complete`, { method: 'POST' }),
  getDeliveryPool: () => request('/delivery/pool'),
  grabOrder: (id: string) => request(`/delivery/tasks/${id}/grab`, { method: 'POST' }),
  getActiveDelivery: () => request('/delivery/active'),
  confirmDeliver: (id: string, signCode: string) =>
    request(`/delivery/tasks/${id}/deliver`, { method: 'POST', data: { signCode } }),
  setOnlineStatus: (online: boolean) =>
    request('/worker/online', { method: 'PUT', data: { online } }),
};
