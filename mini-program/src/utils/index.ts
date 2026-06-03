import Taro from '@tarojs/taro';
import { ORDER_STATUS_TEXT, PAGE_PATH, POINTS_PER_YUAN } from '../config/constants';

/**
 * 格式化价格
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * 格式化时间
 */
export const formatTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(/-/g, '/'));
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

/**
 * 获取订单状态文本
 */
export const getOrderStatusText = (status: string): string => {
  return ORDER_STATUS_TEXT[status] || '未知状态';
};

/**
 * 获取订单状态颜色
 */
export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending_pay: '#fa8c16',
    pending_deliver: '#1890ff',
    delivering: '#52c41a',
    completed: '#999',
    refunding: '#f5222d',
    refunded: '#999',
    closed: '#999'
  };
  return colorMap[status] || '#999';
};

/**
 * 手机号脱敏
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 7) return phone;
  return phone.substring(0, 3) + '****' + phone.substring(7);
};

/**
 * 生成订单号
 */
export const generateOrderNo = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LX${y}${m}${d}${h}${min}${s}${rand}`;
};

/**
 * 导航到页面
 */
export const navigateTo = (url: string, params?: Record<string, string>) => {
  if (params) {
    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    url = `${url}?${query}`;
  }
  Taro.navigateTo({ url });
};

/**
 * 切换到 Tab 页
 */
export const switchTab = (url: string) => {
  Taro.switchTab({ url });
};

/**
 * 显示 Toast
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'none' = 'none') => {
  Taro.showToast({ title, icon, duration: 2000 });
};

/**
 * 显示确认弹窗
 */
export const showConfirm = (title: string, content: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Taro.showModal({
      title,
      content,
      success: (res) => resolve(res.confirm)
    });
  });
};

/**
 * 复制到剪贴板
 */
export const copyText = (text: string) => {
  Taro.setClipboardData({
    data: text,
    success: () => showToast('已复制', 'success')
  });
};

/**
 * 分享配置生成
 */
export const getShareConfig = (title: string, path: string, imageUrl?: string) => {
  return {
    title,
    path,
    imageUrl
  };
};

/**
 * 计算佣金
 */
export const calculateCommission = (amount: number, rate: number): number => {
  return Math.round(amount * rate * 100) / 100;
};

/**
 * 防抖函数
 */
export const debounce = (fn: Function, delay: number) => {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * 检查是否登录，未登录则跳转登录页
 */
export const checkLogin = (): boolean => {
  const token = Taro.getStorageSync('token');
  if (!token) {
    Taro.navigateTo({ url: PAGE_PATH.LOGIN });
    return false;
  }
  return true;
};

/**
 * 计算可获得积分（消费1元=1积分）
 */
export const calculatePoints = (amount: number): number => {
  return Math.floor(amount) * POINTS_PER_YUAN;
};

/**
 * 格式化积分数字
 */
export const formatPoints = (points: number): string => {
  if (points >= 10000) {
    return (points / 10000).toFixed(1) + '万';
  }
  return points.toLocaleString();
};
