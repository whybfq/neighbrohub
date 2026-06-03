// 模拟数据 - 在实际项目中替换为真实API调用
// 本文件用于开发阶段的UI展示和测试

import { ORDER_STATUS, USER_ROLE } from '../config/constants';

// ==================== 用户数据 ====================
export const mockUser = {
  id: 'U10001',
  openid: 'oxxxxxxxxxxxxxx',
  nickname: '阳光花园-李明',
  avatar: '😊',
  phone: '138****5678',
  role: USER_ROLE.BUILDING_LEADER,
  community: {
    id: 'C001',
    name: '阳光花园小区',
    address: 'XX市XX区XX路100号'
  },
  building: {
    id: 'B003',
    name: '3栋',
    unit: '2单元'
  },
  distributorCode: 'BL8888',  // 楼长邀请码
  superiorDistributor: {       // 上级团长
    id: 'D001',
    name: '王阿姨',
    community: '阳光花园小区'
  },
  balance: 1280.50,  // 可提现佣金
  totalCommission: 3680.00, // 累计佣金
  createdAt: '2026-01-15'
};

// ==================== 商品分类 ====================
export const mockCategories = [
  { id: 1, name: '生鲜果蔬', icon: '🥬', color: '#fff0e6' },
  { id: 2, name: '肉禽蛋奶', icon: '🥩', color: '#e6f7ff' },
  { id: 3, name: '粮油调味', icon: '🍞', color: '#f0ffe6' },
  { id: 4, name: '零食饮料', icon: '🍪', color: '#ffe6f0' },
  { id: 5, name: '日用百货', icon: '🧹', color: '#f5e6ff' },
  { id: 6, name: '家居清洁', icon: '🧴', color: '#e6fff0' },
  { id: 7, name: '母婴用品', icon: '🍼', color: '#fff5e6' },
  { id: 8, name: '社区服务', icon: '🔧', color: '#f0f0ff' },
  { id: 9, name: '烘焙甜点', icon: '🍰', color: '#ffe6e6' },
  { id: 10, name: '酒水饮料', icon: '🍺', color: '#e6f0ff' }
];

// ==================== 商品数据 ====================
export const mockProducts = [
  {
    id: 'P001',
    name: '有机新鲜蔬菜组合 当日采摘 5斤装',
    categoryId: 1,
    coverImage: '🥬',
    images: ['🥬', '🥒', '🍅', '🥕'],
    description: '精选当季有机蔬菜，由本地农场直供，当日清晨采摘，保证新鲜。',
    price: 29.90,
    marketPrice: 45.00,
    stock: 500,
    sales: 326,
    tags: ['社区自营', '新鲜直达'],
    rating: 4.9,
    reviews: 128,
    skus: [
      { id: 'SKU001', name: '5斤装', price: 29.90, stock: 300 },
      { id: 'SKU002', name: '10斤装', price: 55.00, stock: 200 }
    ],
    deliveryType: 'both',
    isFlashSale: true,
    flashPrice: 19.90
  },
  {
    id: 'P002',
    name: '丹东99草莓 大果 3斤装 新鲜直达',
    categoryId: 1,
    coverImage: '🍓',
    images: ['🍓', '🍓', '🍓'],
    description: '正宗丹东99草莓，果形饱满，甜度高，当日采摘当日达。',
    price: 49.90,
    marketPrice: 69.90,
    stock: 200,
    sales: 1203,
    tags: ['爆品推荐', '限时特惠'],
    rating: 4.8,
    reviews: 356,
    skus: [
      { id: 'SKU003', name: '3斤装', price: 49.90, stock: 150 },
      { id: 'SKU004', name: '5斤装', price: 79.90, stock: 50 }
    ],
    deliveryType: 'both',
    isFlashSale: true,
    flashPrice: 39.90
  },
  {
    id: 'P003',
    name: '土鸡蛋 农家散养 30枚装',
    categoryId: 2,
    coverImage: '🥚',
    images: ['🥚', '🐔'],
    description: '农家散养土鸡蛋，自然放养，无激素无抗生素，蛋黄饱满，营养丰富。',
    price: 35.80,
    marketPrice: 48.00,
    stock: 300,
    sales: 568,
    tags: ['农家直供'],
    rating: 4.7,
    reviews: 89,
    skus: [
      { id: 'SKU005', name: '30枚装', price: 35.80, stock: 200 },
      { id: 'SKU006', name: '60枚装', price: 68.00, stock: 100 }
    ],
    deliveryType: 'both',
    isFlashSale: false
  },
  {
    id: 'P004',
    name: '维达抽纸 3层 整箱24包',
    categoryId: 5,
    coverImage: '🧻',
    images: ['🧻'],
    description: '维达抽纸，3层加厚，柔软亲肤，整箱24包家庭装，经济实惠。',
    price: 45.90,
    marketPrice: 59.90,
    stock: 800,
    sales: 892,
    tags: ['家庭装', '热卖'],
    rating: 4.6,
    reviews: 210,
    skus: [
      { id: 'SKU007', name: '整箱24包', price: 45.90, stock: 500 },
      { id: 'SKU008', name: '半箱12包', price: 25.90, stock: 300 }
    ],
    deliveryType: 'both',
    isFlashSale: false
  },
  {
    id: 'P005',
    name: '新鲜猪肋排 500g 冷链配送',
    categoryId: 2,
    coverImage: '🥩',
    images: ['🥩'],
    description: '精选猪肋排，肉质鲜嫩，冷链配送保证新鲜。适合红烧、炖汤。',
    price: 39.90,
    marketPrice: 52.00,
    stock: 150,
    sales: 445,
    tags: ['冷链直达'],
    rating: 4.8,
    reviews: 67,
    skus: [
      { id: 'SKU009', name: '500g', price: 39.90, stock: 100 },
      { id: 'SKU010', name: '1000g', price: 75.00, stock: 50 }
    ],
    deliveryType: 'self_pickup',
    isFlashSale: false
  },
  {
    id: 'P006',
    name: '东北大米 五常稻花香 10斤装',
    categoryId: 3,
    coverImage: '🍚',
    images: ['🍚', '🌾'],
    description: '正宗五常稻花香大米，颗粒饱满，煮饭香气四溢，口感软糯。',
    price: 68.00,
    marketPrice: 89.00,
    stock: 400,
    sales: 1023,
    tags: ['五常产地', '团长推荐'],
    rating: 4.9,
    reviews: 445,
    skus: [
      { id: 'SKU011', name: '10斤装', price: 68.00, stock: 250 },
      { id: 'SKU012', name: '20斤装', price: 128.00, stock: 150 }
    ],
    deliveryType: 'both',
    isFlashSale: false
  }
];

// ==================== 秒杀活动 ====================
export const mockFlashSales = [
  { productId: 'P001', name: '蔬菜组合', icon: '🥬', flashPrice: 19.90, originalPrice: 29.90, stock: 50, sold: 120 },
  { productId: 'P002', name: '丹东草莓', icon: '🍓', flashPrice: 39.90, originalPrice: 49.90, stock: 30, sold: 89 },
  { productId: 'P005', name: '猪肋排', icon: '🥩', flashPrice: 29.90, originalPrice: 39.90, stock: 20, sold: 67 },
  { productId: 'P006', name: '五常大米', icon: '🍚', flashPrice: 55.00, originalPrice: 68.00, stock: 40, sold: 156 }
];

// ==================== 购物车 ====================
export const mockCartItems = [
  {
    id: 'C001',
    productId: 'P001',
    skuId: 'SKU001',
    productName: '有机新鲜蔬菜组合',
    productIcon: '🥬',
    skuName: '5斤装',
    price: 29.90,
    quantity: 2,
    stock: 300,
    checked: true
  },
  {
    id: 'C002',
    productId: 'P002',
    skuId: 'SKU003',
    productName: '丹东99草莓',
    productIcon: '🍓',
    skuName: '3斤装',
    price: 49.90,
    quantity: 1,
    stock: 150,
    checked: true
  },
  {
    id: 'C003',
    productId: 'P004',
    skuId: 'SKU007',
    productName: '维达抽纸',
    productIcon: '🧻',
    skuName: '整箱24包',
    price: 45.90,
    quantity: 1,
    stock: 500,
    checked: false
  }
];

// ==================== 订单数据 ====================
export const mockOrders = [
  {
    id: 'O001',
    orderNo: 'LX20260604001',
    status: ORDER_STATUS.DELIVERING,
    items: [
      { productId: 'P001', productName: '有机蔬菜组合', icon: '🥬', skuName: '5斤装', price: 29.90, quantity: 2 }
    ],
    totalAmount: 59.80,
    payAmount: 49.80,
    discount: 10.00,
    deliveryType: 'self_pickup',
    buildingLeader: { id: 'BL8888', name: '李明' },
    communityLeader: { id: 'D001', name: '王阿姨' },
    commission: { buildingLeader: 2.99, communityLeader: 1.79 },
    pickupAddress: '阳光花园小区3栋2单元 团长自提点',
    createdAt: '2026-06-04 09:30',
    paidAt: '2026-06-04 09:31'
  },
  {
    id: 'O002',
    orderNo: 'LX20260603012',
    status: ORDER_STATUS.COMPLETED,
    items: [
      { productId: 'P002', productName: '丹东99草莓', icon: '🍓', skuName: '3斤装', price: 49.90, quantity: 1 }
    ],
    totalAmount: 49.90,
    payAmount: 39.90,
    discount: 10.00,
    deliveryType: 'door_delivery',
    buildingLeader: { id: 'BL8888', name: '李明' },
    communityLeader: { id: 'D001', name: '王阿姨' },
    commission: { buildingLeader: 2.50, communityLeader: 1.50 },
    pickupAddress: '阳光花园小区3栋2单元 1501室',
    createdAt: '2026-06-03 14:20',
    paidAt: '2026-06-03 14:21',
    completedAt: '2026-06-03 17:30'
  },
  {
    id: 'O003',
    orderNo: 'LX20260602005',
    status: ORDER_STATUS.COMPLETED,
    items: [
      { productId: 'P006', productName: '五常大米', icon: '🍚', skuName: '10斤装', price: 68.00, quantity: 1 },
      { productId: 'P004', productName: '维达抽纸', icon: '🧻', skuName: '整箱24包', price: 45.90, quantity: 1 }
    ],
    totalAmount: 113.90,
    payAmount: 98.90,
    discount: 15.00,
    deliveryType: 'self_pickup',
    buildingLeader: { id: 'BL8888', name: '李明' },
    communityLeader: { id: 'D001', name: '王阿姨' },
    commission: { buildingLeader: 5.70, communityLeader: 3.42 },
    pickupAddress: '阳光花园小区3栋2单元 团长自提点',
    createdAt: '2026-06-02 18:45',
    paidAt: '2026-06-02 18:46',
    completedAt: '2026-06-03 10:00'
  }
];

// ==================== 社区与楼栋 ====================
export const mockCommunity = {
  id: 'C001',
  name: '阳光花园小区',
  address: 'XX市XX区XX路100号',
  buildings: [
    { id: 'B001', name: '1栋', units: ['1单元', '2单元', '3单元'] },
    { id: 'B002', name: '2栋', units: ['1单元', '2单元'] },
    { id: 'B003', name: '3栋', units: ['1单元', '2单元', '3单元'] },
    { id: 'B004', name: '5栋', units: ['1单元', '2单元'] },
    { id: 'B005', name: '6栋', units: ['1单元', '2单元', '3单元'] }
  ]
};

// ==================== 楼长分销数据 ====================
export const mockDistributionData = {
  inviteCode: 'BL8888',
  inviteQRCode: 'https://cdn.linshe.com/qr/bl8888.png',
  totalMembers: 38,          // 下级用户数
  todayMembers: 2,           // 今日新增
  totalOrders: 156,          // 累计订单
  todayOrders: 5,            // 今日订单
  totalCommission: 3680.00,  // 累计佣金
  availableCommission: 1280.50, // 可提现佣金
  pendingCommission: 450.00, // 待结算佣金
  monthlyCommission: 820.00, // 本月佣金
  rank: 3,                   // 小区排名
  commissionRecords: [
    { id: 'CR001', orderNo: 'LX20260604001', amount: 2.99, type: 'order_commission', status: 'pending', createdAt: '2026-06-04' },
    { id: 'CR002', orderNo: 'LX20260603012', amount: 2.50, type: 'order_commission', status: 'settled', createdAt: '2026-06-03' },
    { id: 'CR003', orderNo: 'LX20260602005', amount: 5.70, type: 'order_commission', status: 'settled', createdAt: '2026-06-02' },
    { id: 'CR004', orderNo: '-', amount: 500.00, type: 'withdraw', status: 'completed', createdAt: '2026-05-28' }
  ],
  subMembers: [
    { id: 'U10002', nickname: '张先生', avatar: '👨', building: '3栋1单元', orderCount: 12, joinDate: '2026-05-01' },
    { id: 'U10003', nickname: '李女士', avatar: '👩', building: '3栋2单元', orderCount: 8, joinDate: '2026-05-15' },
    { id: 'U10004', nickname: '王大爷', avatar: '👴', building: '3栋3单元', orderCount: 5, joinDate: '2026-06-01' }
  ]
};

// ==================== 优惠券 ====================
export const mockCoupons = [
  { id: 'CP001', name: '新用户专享', type: 'discount', value: 10, minAmount: 39, startTime: '2026-06-01', endTime: '2026-06-30', status: 'available' },
  { id: 'CP002', name: '满减优惠', type: 'discount', value: 5, minAmount: 59, startTime: '2026-06-01', endTime: '2026-06-30', status: 'available' },
  { id: 'CP003', name: '618大促', type: 'discount', value: 15, minAmount: 99, startTime: '2026-06-15', endTime: '2026-06-20', status: 'available' }
];

// ==================== Banner ====================
export const mockBanners = [
  { id: 1, title: '社区618年中大促', bgColor: 'linear-gradient(135deg, #ff6b6b, #ff8e53)', icon: '🎉' },
  { id: 2, title: '新人专享福利', bgColor: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '🎁' },
  { id: 3, title: '团长推荐好物', bgColor: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: '⭐' }
];

// ==================== 地址 ====================
export const mockAddresses = [
  { id: 'A001', name: '李明', phone: '138****5678', address: '阳光花园小区3栋2单元1501室', isDefault: true },
  { id: 'A002', name: '李明', phone: '138****5678', address: '阳光花园小区3栋2单元 团长自提点', isDefault: false }
];
