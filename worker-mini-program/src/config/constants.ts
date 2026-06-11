/**
 * 邻选·履约 — 全局常量
 * deliveryFeePerOrder：接他人单收入；consumerDeliveryFee 与消费者端配送费对齐
 */
export const API_BASE_URL = process.env.TARO_APP_API || 'http://localhost:8090/api/v1';
export const USE_MOCK_API = false;

export const MVP_COMMUNITY = {
  id: 'C001',
  name: '山屿西山著',
  warehouseId: 'WH001',
  warehouseName: '山屿西山著地下仓',
  address: '北京市海淀区山屿西山著',
};

export const EMPTY_WORKER_DASHBOARD = {
  todayInbound: 0,
  todayPick: 0,
  todayDelivery: 0,
  todayEarnings: 0,
  pendingPick: 0,
  pendingDelivery: 0,
  holdingCount: 0,
  maxHold: 100,
};

export const MVP_ZONES = [
  { id: 'EAST', name: '东区', buildingCount: 21, unitsPerBuilding: 3 },
  { id: 'WEST', name: '西区', buildingCount: 17, unitsPerBuilding: 3 },
];

export const BUSINESS_RULES = {
  minOrderAmount: 1,
  deliveryFeePerOrder: 5,
  consumerDeliveryFee: 1,
  selfDeliveryCourierReward: 0,
  maxConcurrentOrders: 100,
  pickupTimeoutMinutes: 20,
};

export const WORKER_ROLES = {
  INBOUND: 'inbound',
  PICK: 'pick',
  DELIVERY: 'delivery',
} as const;

export const PAGE_PATH = {
  HOME: '/pages/home/index',
  LOGIN: '/pages/login/index',
  INBOUND: '/pages/inbound/index',
  PICK: '/pages/pick/index',
  PICK_DETAIL: '/pages/pick/detail',
  DELIVERY: '/pages/delivery/index',
  DELIVERY_CONFIRM: '/pages/delivery/confirm',
  MINE: '/pages/mine/index',
};

export const STORAGE_ZONES = {
  normal: { label: '常温', icon: '🏭' },
  cold: { label: '冷藏', icon: '❄️' },
  frozen: { label: '冷冻', icon: '🧊' },
};
