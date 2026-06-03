import { create } from 'zustand';
import Taro from '@tarojs/taro';

// ==================== 用户状态 ====================
interface UserState {
  token: string;
  userInfo: any | null;
  isLogin: boolean;
  community: any | null;
  building: any | null;

  setToken: (token: string) => void;
  setUserInfo: (info: any) => void;
  setCommunity: (community: any) => void;
  setBuilding: (building: any) => void;
  logout: () => void;
  checkLogin: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  token: Taro.getStorageSync('token') || '',
  userInfo: null,
  isLogin: false,
  community: null,
  building: null,

  setToken: (token: string) => {
    Taro.setStorageSync('token', token);
    set({ token, isLogin: true });
  },

  setUserInfo: (info: any) => {
    set({ userInfo: info, isLogin: true });
  },

  setCommunity: (community: any) => set({ community }),
  setBuilding: (building: any) => set({ building }),

  logout: () => {
    Taro.removeStorageSync('token');
    set({ token: '', userInfo: null, isLogin: false, community: null, building: null });
  },

  checkLogin: () => {
    const token = Taro.getStorageSync('token');
    if (token) {
      set({ token, isLogin: true });
      return true;
    }
    return false;
  }
}));

// ==================== 购物车状态 ====================
interface CartItem {
  id: string;
  productId: string;
  skuId: string;
  productName: string;
  productIcon: string;
  skuName: string;
  price: number;
  quantity: number;
  stock: number;
  checked: boolean;
}

interface CartState {
  items: CartItem[];
  loading: boolean;

  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCheck: (id: string) => void;
  checkAll: (checked: boolean) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  getCheckedItems: () => CartItem[];
  getTotalAmount: () => number;
  getCheckedCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  setItems: (items) => set({ items }),

  addItem: (item) => {
    const items = get().items;
    const existIndex = items.findIndex(i => i.skuId === item.skuId);
    if (existIndex >= 0) {
      items[existIndex].quantity += item.quantity;
      set({ items: [...items] });
    } else {
      set({ items: [...items, item] });
    }
  },

  updateQuantity: (id, quantity) => {
    const items = get().items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item
    );
    set({ items });
  },

  toggleCheck: (id) => {
    const items = get().items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    set({ items });
  },

  checkAll: (checked) => {
    set({ items: get().items.map(item => ({ ...item, checked })) });
  },

  removeItem: (id) => {
    set({ items: get().items.filter(item => item.id !== id) });
  },

  clearChecked: () => {
    set({ items: get().items.filter(item => !item.checked) });
  },

  getCheckedItems: () => get().items.filter(item => item.checked),

  getTotalAmount: () => {
    return get().items
      .filter(item => item.checked)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCheckedCount: () => {
    return get().items.filter(item => item.checked).reduce((sum, item) => sum + item.quantity, 0);
  }
}));

// ==================== 订单状态 ====================
interface OrderState {
  currentOrder: any | null;
  orderList: any[];
  activeTab: string;

  setCurrentOrder: (order: any) => void;
  setOrderList: (list: any[]) => void;
  setActiveTab: (tab: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  orderList: [],
  activeTab: 'all',

  setCurrentOrder: (order) => set({ currentOrder: order }),
  setOrderList: (list) => set({ orderList: list }),
  setActiveTab: (tab) => set({ activeTab: tab })
}));
