import Taro from '@tarojs/taro';
import {
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  ORDER_TAB_STATUS_GROUPS,
  PAGE_PATH,
  POINTS_PER_YUAN,
  TRACKABLE_ORDER_STATUSES,
} from '../config/constants';

export { PAGE_PATH } from '../config/constants';

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
    paid: '#1890ff',
    picking: '#1890ff',
    packed: '#722ed1',
    dispatching: '#13c2c2',
    delivering: '#52c41a',
    delivered: '#52c41a',
    completed: '#999',
    cancelled: '#999',
    refunding: '#f5222d',
    refunded: '#999',
    pending_deliver: '#1890ff',
    closed: '#999',
  };
  return colorMap[status] || '#999';
};

/**
 * 订单是否匹配列表 Tab
 */
export const matchOrderTab = (status: string, tab: string): boolean => {
  if (tab === 'all') return true;
  if (tab === ORDER_STATUS.PENDING_PAY) return status === ORDER_STATUS.PENDING_PAY;
  if (tab === ORDER_STATUS.COMPLETED) return status === ORDER_STATUS.COMPLETED;
  if (ORDER_TAB_STATUS_GROUPS[tab]) {
    return ORDER_TAB_STATUS_GROUPS[tab].includes(status);
  }
  return status === tab;
};

/**
 * 是否可查看配送追踪
 */
export const isTrackableOrder = (status: string): boolean => {
  return TRACKABLE_ORDER_STATUSES.includes(status);
};

/**
 * 格式化预计送达时间文案
 */
export const formatEtaText = (minutes: number = 120): string => {
  const now = new Date();
  const eta = new Date(now.getTime() + minutes * 60 * 1000);
  const h = String(eta.getHours()).padStart(2, '0');
  const m = String(eta.getMinutes()).padStart(2, '0');
  return `今天 ${h}:${m} 前`;
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

/**
 * 计算商品剩余保质期天数
 * @param productionDate 生产日期 (ISO字符串或 YYYY-MM-DD)
 * @param shelfLifeDays 保质期天数
 */
export const getRemainingShelfDays = (productionDate: string, shelfLifeDays: number): number => {
  if (!productionDate || !shelfLifeDays) return 0;
  const prodDate = new Date(productionDate.replace(/-/g, '/'));
  const expireDate = new Date(prodDate.getTime() + shelfLifeDays * 24 * 3600 * 1000);
  const now = new Date();
  return Math.max(0, Math.ceil((expireDate.getTime() - now.getTime()) / (24 * 3600 * 1000)));
};

/**
 * 计算最佳赏味期剩余天数
 * 最佳赏味期 = 生产日期后的前1/3保质期时间
 */
export const getTastePrimeDays = (productionDate: string, shelfLifeDays: number): number => {
  if (!productionDate || !shelfLifeDays) return 0;
  const prodDate = new Date(productionDate.replace(/-/g, '/'));
  const primeEnd = new Date(prodDate.getTime() + (shelfLifeDays / 3) * 24 * 3600 * 1000);
  const now = new Date();
  return Math.max(0, Math.ceil((primeEnd.getTime() - now.getTime()) / (24 * 3600 * 1000)));
};

/**
 * 格式化保质期剩余天数显示
 */
export const formatShelfLife = (productionDate: string, shelfLifeDays: number): string => {
  const remaining = getRemainingShelfDays(productionDate, shelfLifeDays);
  if (remaining <= 0) return '已过期';
  if (remaining <= 30) return `仅剩${remaining}天`;
  if (remaining <= 90) return `剩余${Math.ceil(remaining / 30)}个月`;
  return `剩余${Math.ceil(remaining / 30)}个月`;
};
