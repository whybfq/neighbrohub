import Taro from '@tarojs/taro';
import { PAGE_PATH, MVP_ZONES } from '../config/constants';

export const formatPrice = (price: number): string => price.toFixed(2);

export const showToast = (title: string, icon: 'success' | 'error' | 'none' = 'none') => {
  Taro.showToast({ title, icon, duration: 2000 });
};

export const navigateTo = (url: string, params?: Record<string, string>) => {
  if (params) {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    url = `${url}?${query}`;
  }
  Taro.navigateTo({ url });
};

export const checkWorkerLogin = (): boolean => {
  const token = Taro.getStorageSync('worker_token');
  if (!token) {
    Taro.redirectTo({ url: PAGE_PATH.LOGIN });
    return false;
  }
  return true;
};

export const getZoneName = (zoneId?: string) =>
  MVP_ZONES.find((z) => z.id === zoneId)?.name || '';

export const copyText = (text: string, okMsg = '已复制') => {
  Taro.setClipboardData({
    data: text,
    success: () => showToast(okMsg, 'success'),
  });
};

export { PAGE_PATH };
