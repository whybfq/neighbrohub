import { MVP_COMMUNITY } from '../config/constants';

export const mockWorkerUser = {
  id: 'W001',
  nickname: '王芳',
  avatar: '👩‍🏭',
  phone: '138****8888',
  roles: ['inbound', 'pick', 'delivery'],
  courierStatus: 'active' as 'active' | 'offline' | 'pending',
  warehouse: MVP_COMMUNITY.warehouseName,
};

export const mockDashboard = {
  todayInbound: 28,
  todayPick: 45,
  todayDelivery: 18,
  todayEarnings: 90,
  pendingPick: 3,
  pendingDelivery: 5,
  holdingCount: 1,
  maxHold: 100,
};

export const mockInboundRecent = [
  { id: 'IB001', name: '西红柿 500g', qty: 20, location: 'B-003', time: '09:15' },
  { id: 'IB002', name: '纯牛奶 250ml×24', qty: 15, location: 'B-008', time: '09:02' },
];

export const mockPickTasks = [
  {
    id: 'PT001',
    orderNo: '20260608001',
    address: '东区3栋501',
    zoneId: 'EAST',
    itemCount: 3,
    waitingMinutes: 8,
    status: 'pending',
  },
  {
    id: 'PT002',
    orderNo: '20260607008',
    address: '西区7栋1202',
    zoneId: 'WEST',
    itemCount: 2,
    waitingMinutes: 15,
    status: 'pending',
  },
  {
    id: 'PT003',
    orderNo: '20260608003',
    address: '西区2栋301',
    zoneId: 'WEST',
    itemCount: 4,
    waitingMinutes: 5,
    status: 'pending',
  },
  {
    id: 'PT004',
    orderNo: '20260608004',
    address: '东区8栋602',
    zoneId: 'EAST',
    itemCount: 1,
    waitingMinutes: 3,
    status: 'pending',
  },
];

export const mockPickDetail = {
  taskId: 'PT001',
  orderNo: '20260608001',
  address: '山屿西山著东区 3栋501',
  items: [
    { skuId: 'SKU001', name: '农夫山泉 ×2', location: 'A-012', zone: 'normal', picked: false },
    { skuId: 'SKU009', name: '西红柿 500g ×1', location: 'B-003', zone: 'cold', picked: false },
    { skuId: 'SKU010', name: '薯片 ×1', location: 'A-045', zone: 'normal', picked: false },
  ],
};

export const mockDeliveryPool = [
  {
    id: 'DT001',
    orderNo: '20260608001',
    address: '东区3栋501',
    zoneId: 'EAST',
    itemCount: 3,
    fee: 5,
    waitingMinutes: 12,
  },
  {
    id: 'DT002',
    orderNo: '20260607008',
    address: '西区7栋1202',
    zoneId: 'WEST',
    itemCount: 2,
    fee: 5,
    waitingMinutes: 10,
  },
  {
    id: 'DT004',
    orderNo: '20260608003',
    address: '西区2栋301',
    zoneId: 'WEST',
    itemCount: 4,
    fee: 5,
    waitingMinutes: 6,
  },
  {
    id: 'DT005',
    orderNo: '20260608004',
    address: '东区8栋602',
    zoneId: 'EAST',
    itemCount: 1,
    fee: 5,
    waitingMinutes: 4,
  },
];

export const mockActiveDelivery = {
  id: 'DT003',
  orderNo: '20260606003',
  address: '东区5栋802',
  zoneId: 'EAST',
  status: 'delivering',
  signCode: '836291',
};
