import Taro from '@tarojs/taro';
import { API_BASE_URL, USE_MOCK_API } from '../config/constants';
import {
  mockProducts, mockCategories, mockCartItems, mockOrders,
  mockUser, mockFlashSales, mockDistributionData, mockCoupons,
  mockCommunity,
  mockPointsInfo, mockPointsRecords, mockPointsServices, mockExchangeRecords,
  mockOrderTracks
} from './mockData';
import {
  getStoredAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from './addressStorage';

// 请求封装
const request = async <T>(url: string, options: any = {}): Promise<T> => {
  if (USE_MOCK_API) {
    return mockRequest(url, options) as T;
  }

  try {
    const res = await Taro.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Taro.getStorageSync('token')}`,
        'X-Client-Type': 'consumer',
        ...options.header
      }
    });
    if (res.statusCode === 200 && res.data.code === 0) {
      return res.data.data as T;
    }
    throw new Error(res.data.message || '请求失败');
  } catch (err: any) {
    Taro.showToast({ title: err.message || '网络错误', icon: 'none' });
    throw err;
  }
};

// 模拟请求处理
const mockRequest = (url: string, options: any): any => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url.includes('/products/list')) return resolve(mockProducts);
      if (url.includes('/products/categories')) return resolve(mockCategories);
      if (url.includes('/products/detail')) return resolve(mockProducts[0]);
      if (url.includes('/products/flash-sale')) return resolve(mockFlashSales);
      if (url.includes('/cart/list')) return resolve(mockCartItems);
      if (url.includes('/cart/add')) return resolve({ success: true });
      if (url.includes('/cart/update')) return resolve({ success: true });
      if (url.includes('/cart/delete')) return resolve({ success: true });
      if (url.includes('/orders/list')) return resolve(mockOrders);
      if (url.includes('/orders/track/')) {
        const orderId = url.split('/orders/track/')[1]?.split('?')[0];
        return resolve(mockOrderTracks[orderId] || mockOrderTracks.O001);
      }
      if (url.includes('/orders/create')) return resolve({ orderId: 'O001', orderNo: '20260608001', signCode: '836291' });
      if (url.includes('/user/info')) return resolve(mockUser);
      if (url.includes('/user/login')) return resolve({ token: 'mock_token_' + Date.now(), user: mockUser });
      if (url.includes('/distribution/data')) return resolve(mockDistributionData);
      if (url.includes('/coupons/list')) return resolve(mockCoupons);
      if (url.includes('/community/info')) return resolve(mockCommunity);
      if (url.includes('/address/list')) return resolve(getStoredAddresses());
      if (url.includes('/address/add')) {
        const list = addAddress(options.data, options.data?.isDefault !== false);
        return resolve(list[0]);
      }
      if (url.match(/\/address\/[^/]+$/) && options.method === 'PUT') {
        const id = url.split('/address/')[1];
        if (options.data?.isDefault) {
          return resolve(setDefaultAddress(id));
        }
        return resolve(updateAddress(id, options.data));
      }
      if (url.match(/\/address\/[^/]+$/) && options.method === 'DELETE') {
        const id = url.split('/address/')[1];
        return resolve(deleteAddress(id));
      }
      if (url.includes('/points/info')) return resolve(mockPointsInfo);
      if (url.includes('/points/records')) return resolve(mockPointsRecords);
      if (url.includes('/points/services')) return resolve(mockPointsServices);
      if (url.includes('/points/exchanges')) return resolve(mockExchangeRecords);
      if (url.includes('/points/exchange')) return resolve({ success: true, message: '兑换成功' });
      resolve({ success: true });
    }, 300);
  });
};

// ==================== 用户相关 API ====================
export const userApi = {
  // 微信登录
  login: (code: string) => request('/user/login', { method: 'POST', data: { code } }),

  // 获取用户信息
  getUserInfo: () => request('/user/info'),

  // 更新用户信息
  updateUserInfo: (data: any) => request('/user/update', { method: 'PUT', data }),

  // 绑定小区和楼栋
  bindCommunity: (data: {
    communityId: string;
    buildingId: string;
    unit: string;
    room: string;
    zoneId?: string;
    zoneName?: string;
    buildingName?: string;
    contactName?: string;
    contactPhone?: string;
    fullAddress?: string;
  }) => request('/user/bind-community', { method: 'POST', data }),

  // 获取地址列表
  getAddresses: () => request('/address/list'),

  // 添加地址
  addAddress: (data: any) => request('/address/add', { method: 'POST', data }),

  // 更新地址
  updateAddress: (id: string, data: any) => request(`/address/${id}`, { method: 'PUT', data }),

  // 删除地址
  deleteAddress: (id: string) => request(`/address/${id}`, { method: 'DELETE' }),
};

// ==================== 商品相关 API ====================
export const productApi = {
  // 获取商品分类
  getCategories: () => request('/products/categories'),

  // 获取商品列表
  getProducts: (params: any) => request('/products/list', { data: params }),

  // 获取商品详情
  getProductDetail: (id: string) => request(`/products/detail/${id}`),

  // 获取秒杀商品
  getFlashSale: () => request('/products/flash-sale'),

  // 搜索商品
  searchProducts: (keyword: string) => request('/products/search', { data: { keyword } }),
};

// ==================== 购物车相关 API ====================
export const cartApi = {
  // 获取购物车列表
  getCartList: () => request('/cart/list'),

  // 添加购物车
  addToCart: (data: { productId: string; skuId: string; quantity: number }) =>
    request('/cart/add', { method: 'POST', data }),

  // 更新购物车
  updateCartItem: (id: string, data: { quantity: number; checked?: boolean }) =>
    request(`/cart/update/${id}`, { method: 'PUT', data }),

  // 删除购物车商品
  deleteCartItem: (id: string) => request(`/cart/delete/${id}`, { method: 'DELETE' }),

  // 全选/取消全选
  checkAll: (checked: boolean) => request('/cart/check-all', { method: 'PUT', data: { checked } }),
};

// ==================== 订单相关 API ====================
export const orderApi = {
  // 获取订单列表
  getOrders: (params: { status?: string; page?: number; pageSize?: number }) =>
    request('/orders/list', { data: params }),

  // 获取订单详情
  getOrderDetail: (id: string) => request(`/orders/detail/${id}`),

  // 配送追踪
  getOrderTrack: (id: string) => request(`/orders/track/${id}`),

  // 创建订单
  createOrder: (data: {
    items: Array<{ productId: string; skuId: string; quantity: number }>;
    addressId: string;
    couponId?: string;
    deliveryType: string;
    distributorCode?: string;
    remark?: string;
  }) => request('/orders/create', { method: 'POST', data }),

  // 支付订单
  payOrder: (orderId: string, paymentMethod: string) =>
    request(`/orders/${orderId}/pay`, { method: 'POST', data: { paymentMethod } }),

  // 取消订单
  cancelOrder: (orderId: string) => request(`/orders/${orderId}/cancel`, { method: 'PUT' }),

  // 确认收货
  confirmReceive: (orderId: string) => request(`/orders/${orderId}/receive`, { method: 'PUT' }),

  // 申请退款
  applyRefund: (orderId: string, reason: string) =>
    request(`/orders/${orderId}/refund`, { method: 'POST', data: { reason } }),

  // 评价订单
  reviewOrder: (orderId: string, data: { rating: number; content: string; images?: string[] }) =>
    request(`/orders/${orderId}/review`, { method: 'POST', data }),
};

// ==================== 分销相关 API ====================
export const distributionApi = {
  // 获取分销数据
  getDistributionData: () => request('/distribution/data'),

  // 获取佣金记录
  getCommissionRecords: (params: { page?: number; pageSize?: number }) =>
    request('/distribution/commissions', { data: params }),

  // 获取下级成员
  getSubMembers: (params: { page?: number; pageSize?: number }) =>
    request('/distribution/members', { data: params }),

  // 申请提现
  withdraw: (amount: number) => request('/distribution/withdraw', { method: 'POST', data: { amount } }),

  // 获取邀请二维码
  getInviteQRCode: () => request('/distribution/qrcode'),
};

// ==================== 优惠券相关 API ====================
export const couponApi = {
  // 获取优惠券列表
  getCoupons: () => request('/coupons/list'),

  // 领取优惠券
  receiveCoupon: (couponId: string) => request(`/coupons/${couponId}/receive`, { method: 'POST' }),
};

// ==================== 社区相关 API ====================
export const communityApi = {
  // 获取社区信息
  getCommunityInfo: () => request('/community/info'),

  // 搜索社区
  searchCommunity: (keyword: string) => request('/community/search', { data: { keyword } }),
};

// ==================== 积分相关 API ====================
export const pointsApi = {
  // 获取积分总览
  getPointsInfo: () => request('/points/info'),

  // 获取积分流水
  getPointsRecords: (params: { page?: number; pageSize?: number; type?: string }) =>
    request('/points/records', { data: params }),

  // 获取可兑换服务列表
  getServices: () => request('/points/services'),

  // 积分兑换服务
  exchangeService: (serviceId: string) =>
    request('/points/exchange', { method: 'POST', data: { serviceId } }),

  // 获取兑换记录
  getExchangeRecords: (params: { page?: number; pageSize?: number }) =>
    request('/points/exchanges', { data: params }),
};

export default {
  user: userApi,
  product: productApi,
  cart: cartApi,
  order: orderApi,
  distribution: distributionApi,
  coupon: couponApi,
  community: communityApi,
  points: pointsApi
};
