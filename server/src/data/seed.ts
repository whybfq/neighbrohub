/** 与服务三端 Mock 对齐的种子数据 */

export const community = {
  id: 'C001',
  name: '山屿西山著',
  address: '北京市海淀区山屿西山著',
  warehouse: { id: 'WH001', name: '山屿西山著地下仓' },
  zones: [
    {
      id: 'EAST',
      name: '东区',
      buildings: [
        { id: 'E-B001', name: '1栋', units: ['1单元', '2单元', '3单元'] },
        { id: 'E-B003', name: '3栋', units: ['1单元', '2单元', '3单元'] },
        { id: 'E-B004', name: '5栋', units: ['1单元', '2单元'] },
      ],
    },
    {
      id: 'WEST',
      name: '西区',
      buildings: [
        { id: 'W-B002', name: '3栋', units: ['1单元', '2单元', '3单元'] },
        { id: 'W-B004', name: '7栋', units: ['1单元', '2单元'] },
      ],
    },
  ],
  businessHours: { open: '08:00', close: '21:00' },
  isOpen: true,
  etaMinutes: 120,
};

export const categories = [
  { id: 1, name: '酒水饮料', icon: '🍺', color: '#e6f0ff' },
  { id: 2, name: '方便速食', icon: '🍜', color: '#ffe6e6' },
  { id: 9, name: '生鲜果蔬', icon: '🥬', color: '#fff0e6' },
  { id: 4, name: '零食坚果', icon: '🥜', color: '#ffe6f0' },
];

export const products = [
  {
    id: 'P001',
    name: '农夫山泉 饮用天然水 550ml×24瓶 整箱装',
    categoryId: 1,
    coverImage: '💧',
    price: 29.9,
    marketPrice: 39.9,
    stock: 5000,
    sales: 2356,
    tags: ['长保质期', '热卖'],
    skus: [{ id: 'SKU001', name: '550ml×24瓶', price: 29.9, stock: 3000 }],
    productIcon: '💧',
  },
  {
    id: 'P002',
    name: '西红柿 500g',
    categoryId: 9,
    coverImage: '🍅',
    price: 5.9,
    marketPrice: 7.9,
    stock: 120,
    sales: 890,
    tags: ['生鲜'],
    skus: [{ id: 'SKU009', name: '500g', price: 5.9, stock: 120 }],
    productIcon: '🍅',
  },
  {
    id: 'P003',
    name: '乐事薯片 原味 104g',
    categoryId: 4,
    coverImage: '🥔',
    price: 8.5,
    marketPrice: 10.0,
    stock: 800,
    sales: 456,
    tags: [],
    skus: [{ id: 'SKU010', name: '104g', price: 8.5, stock: 800 }],
    productIcon: '🥔',
  },
];

export const adminProducts = products.map((p, i) => ({
  id: p.id,
  name: p.name.replace(' 饮用天然水 550ml×24瓶 整箱装', ' 550ml×24瓶').slice(0, 30),
  category: categories.find((c) => c.id === p.categoryId)?.name || '其他',
  price: p.price,
  stock: p.stock,
  sales: p.sales,
  status: i === 2 ? 'off' : 'on',
  storageZone: i === 1 ? 'B-003' : 'A-012',
  tempZone: i === 1 ? '冷藏' : '常温',
}));

export const consumerUser = {
  id: 'U10001',
  nickname: '山屿西山著-李明',
  avatar: '😊',
  phone: '138****5678',
  role: 'building_leader',
  community: { id: 'C001', name: '山屿西山著', address: community.address },
  zone: { id: 'EAST', name: '东区' },
  building: { id: 'E-B003', name: '3栋', unit: '2单元' },
};

export const addresses = [
  {
    id: 'A001',
    name: '李明',
    phone: '138****5678',
    address: '山屿西山著东区 3栋 2单元 501室',
    zone: '东区',
    zoneId: 'EAST',
    isDefault: true,
  },
  {
    id: 'A002',
    name: '李明',
    phone: '138****5678',
    address: '山屿西山著西区 7栋 1202室',
    zone: '西区',
    zoneId: 'WEST',
    isDefault: false,
  },
];

export const orders = [
  {
    id: 'O001',
    orderNo: '20260608001',
    status: 'picking',
    zone: '东区',
    address: '山屿西山著东区 3栋501',
    addressShort: '东区3栋501',
    customer: '李明',
    contactName: '李明',
    contactPhone: '138****5678',
    amount: 45.8,
    payAmount: 45.8,
    itemCount: 3,
    items: [
      { productId: 'P001', skuId: 'SKU001', productName: '农夫山泉', productIcon: '💧', skuName: '550ml×24', price: 29.9, quantity: 1 },
      { productId: 'P002', skuId: 'SKU009', productName: '西红柿', productIcon: '🍅', skuName: '500g', price: 5.9, quantity: 2 },
    ],
    picker: '王芳',
    courier: null,
    signCode: '836291',
    createdAt: '2026-06-08 14:02:00',
  },
  {
    id: 'O002',
    orderNo: '20260607008',
    status: 'delivering',
    zone: '西区',
    address: '山屿西山著西区 7栋1202',
    addressShort: '西区7栋1202',
    customer: '张华',
    contactName: '张华',
    contactPhone: '139****6666',
    amount: 32.5,
    payAmount: 32.5,
    itemCount: 2,
    items: [],
    picker: '王芳',
    courier: { name: '张师傅', phone: '139****6666' },
    signCode: '726481',
    createdAt: '2026-06-08 13:50:00',
  },
  {
    id: 'O003',
    orderNo: '20260608003',
    status: 'paid',
    zone: '西区',
    address: '山屿西山著西区 2栋301',
    addressShort: '西区2栋301',
    customer: '刘女士',
    contactName: '刘女士',
    contactPhone: '137****1234',
    amount: 68.0,
    payAmount: 68.0,
    itemCount: 4,
    items: [],
    picker: null,
    courier: null,
    signCode: '918273',
    createdAt: '2026-06-08 14:15:00',
  },
];

export const orderTracks: Record<string, object> = {
  O001: {
    orderNo: '20260608001',
    status: 'picking',
    etaText: '今天 16:30 前',
    signCode: '836291',
    address: '山屿西山著东区 3栋501',
    courier: null,
    timeline: [
      { step: 'delivered', text: '商品已送达', time: null, done: false, current: false },
      { step: 'delivering', text: '配送员正在赶来', time: null, done: false, current: false },
      { step: 'picking', text: '仓库正在拣货', time: '2026-06-08 14:05:00', done: true, current: true },
      { step: 'paid', text: '订单已支付', time: '2026-06-08 14:02:00', done: true, current: false },
    ],
  },
  O002: {
    orderNo: '20260607008',
    status: 'delivering',
    etaText: '今天 16:00 前',
    signCode: '726481',
    address: '山屿西山著西区 7栋1202',
    courier: { name: '张师傅', phone: '139****6666' },
    timeline: [
      { step: 'delivered', text: '商品已送达', time: null, done: false, current: false },
      { step: 'delivering', text: '配送员正在赶来', time: '2026-06-08 14:18:00', done: true, current: true },
      { step: 'packed', text: '仓库已完成拣货', time: '2026-06-08 14:10:00', done: true, current: false },
      { step: 'paid', text: '订单已支付', time: '2026-06-08 13:50:00', done: true, current: false },
    ],
  },
};

export const workerUser = {
  id: 'W001',
  nickname: '王芳',
  avatar: '👩‍🏭',
  phone: '138****8888',
  roles: ['inbound', 'pick', 'delivery'],
  courierStatus: 'active',
  warehouse: community.warehouse.name,
};

export const pickTasks = [
  { id: 'PT001', orderNo: '20260608001', address: '东区3栋501', zoneId: 'EAST', itemCount: 3, waitingMinutes: 8, status: 'pending' },
  { id: 'PT002', orderNo: '20260607008', address: '西区7栋1202', zoneId: 'WEST', itemCount: 2, waitingMinutes: 15, status: 'pending' },
  { id: 'PT003', orderNo: '20260608003', address: '西区2栋301', zoneId: 'WEST', itemCount: 4, waitingMinutes: 5, status: 'pending' },
];

export const pickDetail = {
  taskId: 'PT001',
  orderNo: '20260608001',
  address: '山屿西山著东区 3栋501',
  items: [
    { skuId: 'SKU001', name: '农夫山泉 ×2', location: 'A-012', zone: 'normal', picked: false },
    { skuId: 'SKU009', name: '西红柿 500g ×1', location: 'B-003', zone: 'cold', picked: false },
  ],
};

export const deliveryPool = [
  { id: 'DT001', orderNo: '20260608004', address: '东区8栋602', zoneId: 'EAST', itemCount: 1, fee: 5, waitingMinutes: 4 },
  { id: 'DT002', orderNo: '20260607008', address: '西区7栋1202', zoneId: 'WEST', itemCount: 2, fee: 5, waitingMinutes: 10 },
];

export const activeDelivery = {
  id: 'DT003',
  orderNo: '20260606003',
  address: '东区5栋802',
  zoneId: 'EAST',
  status: 'delivering',
  signCode: '836291',
};

export const couriers = [
  { id: 'W001', name: '王芳', phone: '138****8888', roles: ['inbound', 'pick', 'delivery'], status: 'active', holdingCount: 1, todayDelivery: 6, appliedAt: '2026-05-01' },
  { id: 'W002', name: '张师傅', phone: '139****6666', roles: ['delivery'], status: 'active', holdingCount: 2, todayDelivery: 8, appliedAt: '2026-05-10' },
  { id: 'W003', name: '李强', phone: '137****1234', roles: ['delivery'], status: 'pending', holdingCount: 0, todayDelivery: 0, appliedAt: '2026-06-07' },
];

export const inboundRecords = [
  { id: 'IB001', skuName: '西红柿 500g', qty: 20, location: 'B-003', operator: '王芳', time: '2026-06-08 09:15' },
  { id: 'IB002', skuName: '纯牛奶 250ml×24', qty: 15, location: 'B-008', operator: '王芳', time: '2026-06-08 09:02' },
];

export function buildDashboard() {
  const pendingPick = orders.filter((o) => ['paid', 'picking'].includes(o.status)).length;
  const picking = orders.filter((o) => o.status === 'picking').length;
  const packed = orders.filter((o) => o.status === 'packed').length;
  const delivering = orders.filter((o) => ['dispatching', 'delivering'].includes(o.status)).length;
  return {
    todayGmv: 1286.5,
    todayOrders: 18,
    pendingPick,
    picking,
    pendingDelivery: packed || 3,
    delivering: delivering || 1,
    avgFulfillMinutes: 68,
    todayInbound: 28,
    todayPick: 45,
    todayDelivery: 18,
    todayEarnings: 90,
    holdingCount: 1,
    maxHold: 100,
  };
}
