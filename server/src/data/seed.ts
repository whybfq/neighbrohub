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
  { id: 1, name: '生鲜果蔬', icon: '🥬', color: '#fff0e6' },
  { id: 2, name: '酒水饮料', icon: '🥤', color: '#e6f0ff' },
  { id: 3, name: '粮油调味', icon: '🫗', color: '#f0ffe6' },
  { id: 4, name: '方便速食', icon: '🍜', color: '#ffe6e6' },
  { id: 5, name: '肉蛋水产', icon: '🥩', color: '#ffe8e8' },
  { id: 6, name: '乳品烘焙', icon: '🥛', color: '#f5f8ff' },
  { id: 7, name: '日用清洁', icon: '🧴', color: '#e6fff0' },
  { id: 8, name: '零食坚果', icon: '🥜', color: '#ffe6f0' },
];

export const products = [
  {
    id: 'P001',
    name: '农夫山泉 饮用天然水 550ml×24瓶 整箱装',
    categoryId: 2,
    coverImage: '💧',
    price: 29.9,
    marketPrice: 39.9,
    stock: 5000,
    sales: 2356,
    tags: ['长保质期', '热卖'],
    skus: [{ id: 'SKU001', name: '550ml×24瓶', price: 29.9, stock: 3000 }],
    productIcon: '💧',
    status: 'on',
  },
  {
    id: 'P002',
    name: '西红柿 500g',
    categoryId: 1,
    coverImage: '🍅',
    price: 5.9,
    marketPrice: 7.9,
    stock: 120,
    sales: 890,
    tags: ['生鲜'],
    skus: [{ id: 'SKU009', name: '500g', price: 5.9, stock: 120 }],
    productIcon: '🍅',
    status: 'on',
  },
  {
    id: 'P003',
    name: '乐事薯片 原味 104g',
    categoryId: 8,
    coverImage: '🥔',
    price: 8.5,
    marketPrice: 10.0,
    stock: 800,
    sales: 456,
    tags: [],
    skus: [{ id: 'SKU010', name: '104g', price: 8.5, stock: 800 }],
    productIcon: '🥔',
    status: 'off',
  },
  {
    id: 'P004',
    name: '蒙牛 纯牛奶 250ml×24盒 整箱装',
    categoryId: 6,
    coverImage: '🥛',
    price: 59.9,
    marketPrice: 69.9,
    stock: 800,
    sales: 1203,
    tags: ['热卖'],
    skus: [{ id: 'SKU011', name: '250ml×24盒', price: 59.9, stock: 800 }],
    productIcon: '🥛',
    status: 'on',
  },
];

export const adminProducts = [
  {
    id: 'P001',
    category: '酒水饮料',
    brand: '农夫山泉',
    spec: '550ml×24瓶/箱',
    name: '饮用天然水',
    price: 29.9,
    stock: 5000,
    sales: 2356,
    status: 'on',
    storageZone: 'A-012',
    tempZone: '常温',
  },
  {
    id: 'P002',
    category: '生鲜果蔬',
    brand: '本地直采',
    spec: '500g/份',
    name: '西红柿',
    price: 5.9,
    stock: 120,
    sales: 890,
    status: 'on',
    storageZone: 'B-003',
    tempZone: '冷藏',
  },
  {
    id: 'P003',
    category: '零食坚果',
    brand: '乐事',
    spec: '原味 104g/袋',
    name: '薯片',
    price: 8.5,
    stock: 0,
    sales: 456,
    status: 'off',
    storageZone: 'A-045',
    tempZone: '常温',
  },
  {
    id: 'P004',
    category: '酒水饮料',
    brand: '蒙牛',
    spec: '250ml×24盒/箱',
    name: '纯牛奶',
    price: 59.9,
    stock: 800,
    sales: 1203,
    status: 'on',
    storageZone: 'B-008',
    tempZone: '冷藏',
  },
];

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
    address: '西区3栋301',
    addressShort: '西区3栋301',
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
  { id: 'PT003', orderNo: '20260608003', address: '西区3栋301', zoneId: 'WEST', itemCount: 4, waitingMinutes: 5, status: 'pending' },
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
  { id: 'IB001', category: '生鲜果蔬', brand: '本地直采', spec: '500g/份', skuName: '西红柿', qty: 20, location: 'B-003', operator: '王芳', time: '2026-06-08 09:15' },
  { id: 'IB002', category: '酒水饮料', brand: '蒙牛', spec: '250ml×24盒/箱', skuName: '纯牛奶', qty: 15, location: 'B-008', operator: '王芳', time: '2026-06-08 09:02' },
];

// ==================== 积分商城 ====================
export const POINTS_PER_YUAN = 1;
export const PROPERTY_FEE_POINTS = 30000;

export const pointsInfo = {
  totalPoints: 5680,
  totalEarned: 12800,
  totalSpent: 7120,
  level: '黄金会员',
  levelIcon: '🥇',
};

export const pointsRecords = [
  { id: 'PR001', type: 'earn', amount: 98, description: '购物获得 - 订单 20260604001', orderNo: '20260604001', createdAt: '2026-06-04 09:31' },
  { id: 'PR002', type: 'spend', amount: 1000, description: '兑换家庭保洁服务', serviceType: 'cleaning', createdAt: '2026-06-03 15:20' },
  { id: 'PR003', type: 'earn', amount: 39, description: '购物获得 - 订单 20260603012', orderNo: '20260603012', createdAt: '2026-06-03 14:21' },
  { id: 'PR004', type: 'spend', amount: 1500, description: '兑换空调清洗服务', serviceType: 'ac_cleaning', createdAt: '2026-06-02 10:00' },
  { id: 'PR005', type: 'earn', amount: 113, description: '购物获得 - 订单 20260602005', orderNo: '20260602005', createdAt: '2026-06-02 18:46' },
  { id: 'PR006', type: 'spend', amount: 30000, description: '兑换免物业费（一年）', serviceType: 'property_fee', createdAt: '2026-05-20 09:00' },
];

export const pointsServices = [
  {
    id: 'PS001',
    name: '家庭保洁服务',
    icon: '🧹',
    category: 'cleaning',
    categoryName: '保洁服务',
    pointsPrice: 1000,
    marketPrice: 128,
    stock: 50,
    sales: 328,
    description: '专业保洁人员上门服务，含客厅、卧室、厨房、卫生间全方位清洁，时长约2小时。',
    tags: ['热门', '上门服务'],
  },
  {
    id: 'PS002',
    name: '空调深度清洗',
    icon: '❄️',
    category: 'ac_cleaning',
    categoryName: '空调清洗',
    pointsPrice: 1500,
    marketPrice: 198,
    stock: 40,
    sales: 186,
    description: '挂机/柜机空调深度拆洗，含滤网、蒸发器、风轮清洁与消毒，改善制冷效果与空气质量。',
    tags: ['季节推荐', '上门服务'],
  },
  {
    id: 'PS003',
    name: '上门做饭服务',
    icon: '🍳',
    category: 'cooking',
    categoryName: '做饭服务',
    pointsPrice: 1200,
    marketPrice: 158,
    stock: 30,
    sales: 95,
    description: '社区认证厨师上门，2-3人份家常菜（三菜一汤），含简单收拾厨房，需提前1天预约。',
    tags: ['邻里优选', '上门服务'],
  },
  {
    id: 'PS004',
    name: '物业费抵扣（一年）',
    icon: '🏠',
    category: 'property_fee',
    categoryName: '免物业费',
    pointsPrice: 30000,
    marketPrice: 3600,
    stock: 20,
    sales: 45,
    description: '使用30000积分抵扣一整年物业费，直接抵扣至物业账单，每户每年限兑1次。',
    tags: ['超值', '限量'],
  },
];

export const pointsExchanges = [
  { id: 'EX001', serviceName: '家庭保洁服务', points: 1000, status: 'completed', serviceDate: '2026-06-03', createdAt: '2026-06-03 15:20' },
  { id: 'EX002', serviceName: '空调深度清洗', points: 1500, status: 'completed', serviceDate: '2026-06-02', createdAt: '2026-06-02 10:00' },
  { id: 'EX003', serviceName: '物业费抵扣（一年）', points: 30000, status: 'completed', serviceDate: '2026-05-20', createdAt: '2026-05-20 09:00' },
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
