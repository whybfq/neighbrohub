// 模拟数据 - 在实际项目中替换为真实API调用
// 本文件用于开发阶段的UI展示和测试

import { ORDER_STATUS, USER_ROLE, STORAGE_TYPE, SHELF_LIFE_CATEGORY, TASTE_PERIOD_STATUS } from '../config/constants';

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
  { id: 1, name: '酒水饮料', icon: '🍺', color: '#e6f0ff' },
  { id: 2, name: '方便速食', icon: '🍜', color: '#ffe6e6' },
  { id: 3, name: '粮油调味', icon: '🫗', color: '#f0ffe6' },
  { id: 4, name: '零食坚果', icon: '🥜', color: '#ffe6f0' },
  { id: 5, name: '日用百货', icon: '🧹', color: '#f5e6ff' },
  { id: 6, name: '家居清洁', icon: '🧴', color: '#e6fff0' },
  { id: 7, name: '母婴用品', icon: '🍼', color: '#fff5e6' },
  { id: 8, name: '社区服务', icon: '🔧', color: '#f0f0ff' },
  { id: 9, name: '生鲜果蔬', icon: '🥬', color: '#fff0e6' },
  { id: 10, name: '冷冻食品', icon: '🧊', color: '#e0f0ff' }
];

// ==================== 商品数据 ====================
// 商品模型：
// - storageType: 仓储类型 (cold_chain/normal/dry)
// - shelfLifeCategory: 保质期分类 (long_term/medium_term/short_term)
// - shelfLifeDays: 保质期天数
// - productionDate: 生产日期 (ISO 字符串)
// - tastePeriodStatus: 最佳赏味期状态 (prime/normal/approaching)
// - tastePeriodTip: 最佳赏味期提示文案
// - warehouseZone: 仓库区域编号 (如 "A-032")
export const mockProducts = [
  {
    id: 'P001',
    name: '农夫山泉 饮用天然水 550ml×24瓶 整箱装',
    categoryId: 1,
    coverImage: '💧',
    images: ['💧', '🏔️', '📦'],
    description: '源自八大优质水源地，天然弱碱性水，适合日常饮用。550ml×24瓶整箱装，家庭常备。',
    price: 29.90,
    marketPrice: 39.90,
    stock: 5000,
    sales: 2356,
    tags: ['长保质期', '家庭装', '热卖'],
    rating: 4.9,
    reviews: 568,
    skus: [
      { id: 'SKU001', name: '550ml×24瓶', price: 29.90, stock: 3000 },
      { id: 'SKU002', name: '1.5L×12瓶', price: 36.00, stock: 2000 }
    ],
    deliveryType: 'both',
    isFlashSale: true,
    flashPrice: 24.90,
    // 仓储与赏味信息
    storageType: STORAGE_TYPE.NORMAL,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 730,
    productionDate: '2026-03-15',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '💧 阴凉干燥处存放，建议开封后3天内饮用完毕，口感最佳。',
    warehouseZone: 'A-032'
  },
  {
    id: 'P002',
    name: '青岛啤酒 经典1903 500ml×12听 整箱装',
    categoryId: 1,
    coverImage: '🍺',
    images: ['🍺', '🏭', '📦'],
    description: '百年经典配方，麦芽香气浓郁，泡沫细腻持久。500ml×12听整箱装，聚会必备。',
    price: 59.90,
    marketPrice: 79.90,
    stock: 3000,
    sales: 1892,
    tags: ['长保质期', '爆品推荐', '限时特惠'],
    rating: 4.8,
    reviews: 423,
    skus: [
      { id: 'SKU003', name: '500ml×12听', price: 59.90, stock: 2000 },
      { id: 'SKU004', name: '500ml×24听', price: 108.00, stock: 1000 }
    ],
    deliveryType: 'both',
    isFlashSale: true,
    flashPrice: 49.90,
    storageType: STORAGE_TYPE.NORMAL,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 365,
    productionDate: '2026-04-20',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🍺 5-25°C避光保存，冷藏后饮用风味更佳，建议尽早享用。',
    warehouseZone: 'B-117'
  },
  {
    id: 'P003',
    name: '康师傅 红烧牛肉面 经典桶装 110g×12桶 整箱装',
    categoryId: 2,
    coverImage: '🍜',
    images: ['🍜', '🥩', '📦'],
    description: '经典红烧牛肉口味，浓郁汤底，劲道面条。110g桶装×12桶整箱，加班熬夜好伴侣。',
    price: 45.90,
    marketPrice: 59.90,
    stock: 4000,
    sales: 3156,
    tags: ['长保质期', '方便速食'],
    rating: 4.7,
    reviews: 892,
    skus: [
      { id: 'SKU005', name: '桶装110g×12桶', price: 45.90, stock: 2500 },
      { id: 'SKU006', name: '袋装105g×24袋', price: 42.00, stock: 1500 }
    ],
    deliveryType: 'both',
    isFlashSale: false,
    storageType: STORAGE_TYPE.DRY,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 180,
    productionDate: '2026-05-10',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🍜 干燥通风处存放，避免阳光直射，生产后6个月内风味最佳。',
    warehouseZone: 'C-205'
  },
  {
    id: 'P004',
    name: '百岁山 天然矿泉水 348ml×24瓶 整箱装',
    categoryId: 1,
    coverImage: '💎',
    images: ['💎', '⛰️', '📦'],
    description: '源自罗浮山脉深层矿泉水，富含偏硅酸等矿物质。348ml×24瓶，精致小瓶装。',
    price: 39.90,
    marketPrice: 52.00,
    stock: 4500,
    sales: 1678,
    tags: ['长保质期', '高端矿泉水'],
    rating: 4.9,
    reviews: 345,
    skus: [
      { id: 'SKU007', name: '348ml×24瓶', price: 39.90, stock: 3000 },
      { id: 'SKU008', name: '570ml×24瓶', price: 48.00, stock: 1500 }
    ],
    deliveryType: 'both',
    isFlashSale: false,
    storageType: STORAGE_TYPE.NORMAL,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 730,
    productionDate: '2026-02-28',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '💎 常温避光保存，矿物质水开封后请尽快饮用。',
    warehouseZone: 'A-088'
  },
  {
    id: 'P005',
    name: '统一 老坛酸菜牛肉面 桶装 120g×12桶 整箱装',
    categoryId: 2,
    coverImage: '🥬',
    images: ['🥬', '🍜', '📦'],
    description: '地道老坛酸菜风味，酸爽开胃，搭配浓郁牛肉汤底。120g桶装×12桶整箱。',
    price: 45.90,
    marketPrice: 59.90,
    stock: 3500,
    sales: 2103,
    tags: ['长保质期', '酸爽开胃'],
    rating: 4.6,
    reviews: 678,
    skus: [
      { id: 'SKU009', name: '桶装120g×12桶', price: 45.90, stock: 2000 },
      { id: 'SKU010', name: '袋装118g×24袋', price: 42.00, stock: 1500 }
    ],
    deliveryType: 'both',
    isFlashSale: false,
    storageType: STORAGE_TYPE.DRY,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 180,
    productionDate: '2026-05-15',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🥬 干燥阴凉处保存，酸菜包开封后风味最佳期为前3个月。',
    warehouseZone: 'C-310'
  },
  {
    id: 'P006',
    name: '雪花啤酒 勇闯天涯 500ml×12听 整箱装',
    categoryId: 1,
    coverImage: '🍻',
    images: ['🍻', '🏔️', '📦'],
    description: '清爽口感，麦香纯正，适合日常饮用和聚会分享。500ml×12听整箱装。',
    price: 42.90,
    marketPrice: 55.00,
    stock: 3500,
    sales: 2567,
    tags: ['长保质期', '畅饮装'],
    rating: 4.7,
    reviews: 534,
    skus: [
      { id: 'SKU011', name: '500ml×12听', price: 42.90, stock: 2000 },
      { id: 'SKU012', name: '500ml×24听', price: 79.90, stock: 1500 }
    ],
    deliveryType: 'both',
    isFlashSale: true,
    flashPrice: 35.90,
    storageType: STORAGE_TYPE.NORMAL,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 270,
    productionDate: '2026-05-01',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🍻 5-25°C避光存放，冰镇后口感更佳，建议6个月内饮用。',
    warehouseZone: 'B-201'
  },
  {
    id: 'P007',
    name: '伊利 纯牛奶 250ml×24盒 整箱装',
    categoryId: 10,
    coverImage: '🥛',
    images: ['🥛', '🐄', '📦'],
    description: '甄选优质牧场奶源，超高温灭菌，营养丰富。250ml×24盒整箱，早餐必备。',
    price: 69.90,
    marketPrice: 85.00,
    stock: 2000,
    sales: 1523,
    tags: ['短保质期', '冷链配送'],
    rating: 4.8,
    reviews: 412,
    skus: [
      { id: 'SKU013', name: '250ml×24盒', price: 69.90, stock: 1200 },
      { id: 'SKU014', name: '250ml×12盒', price: 38.00, stock: 800 }
    ],
    deliveryType: 'self_pickup',
    isFlashSale: false,
    storageType: STORAGE_TYPE.COLD_CHAIN,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.SHORT_TERM,
    shelfLifeDays: 180,
    productionDate: '2026-05-25',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🥛 2-6°C冷藏保存，开封后需冷藏并于3天内饮用完毕，奶香最浓郁。',
    warehouseZone: 'D-005'
  },
  {
    id: 'P008',
    name: '怡宝 纯净水 555ml×24瓶 整箱装',
    categoryId: 1,
    coverImage: '💙',
    images: ['💙', '💧', '📦'],
    description: '多重净化工艺，口感纯净甘甜。555ml×24瓶整箱装，办公室/家庭常备。',
    price: 26.90,
    marketPrice: 35.00,
    stock: 6000,
    sales: 4321,
    tags: ['长保质期', '超值装'],
    rating: 4.9,
    reviews: 1023,
    skus: [
      { id: 'SKU015', name: '555ml×24瓶', price: 26.90, stock: 4000 },
      { id: 'SKU016', name: '1.555L×12瓶', price: 32.00, stock: 2000 }
    ],
    deliveryType: 'both',
    isFlashSale: true,
    flashPrice: 21.90,
    storageType: STORAGE_TYPE.NORMAL,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 365,
    productionDate: '2026-04-10',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '💙 常温避光保存，开封后建议尽快饮用，纯净口感不变。',
    warehouseZone: 'A-150'
  },
  {
    id: 'P009',
    name: '康师傅 酸梅汤 500ml×15瓶 整箱装',
    categoryId: 1,
    coverImage: '🫐',
    images: ['🫐', '🧊', '📦'],
    description: '传统配方熬制，酸甜可口，冰镇后更解暑。500ml×15瓶整箱，夏日必备饮品。',
    price: 39.90,
    marketPrice: 52.00,
    stock: 2500,
    sales: 987,
    tags: ['中等保质期', '夏日解暑'],
    rating: 4.6,
    reviews: 234,
    skus: [
      { id: 'SKU017', name: '500ml×15瓶', price: 39.90, stock: 1500 },
      { id: 'SKU018', name: '1L×8瓶', price: 45.00, stock: 1000 }
    ],
    deliveryType: 'both',
    isFlashSale: false,
    storageType: STORAGE_TYPE.NORMAL,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.MEDIUM_TERM,
    shelfLifeDays: 365,
    productionDate: '2026-04-01',
    tastePeriodStatus: TASTE_PERIOD_STATUS.NORMAL,
    tastePeriodTip: '🫐 常温保存，冷藏后饮用口感更佳，开封后请密封冷藏并于2天内饮用完毕。',
    warehouseZone: 'B-089'
  },
  {
    id: 'P010',
    name: '三只松鼠 坚果大礼包 每日坚果 750g/30包',
    categoryId: 4,
    coverImage: '🥜',
    images: ['🥜', '🌰', '📦'],
    description: '精选6种坚果果干科学配比，独立小包锁鲜，每日一包营养均衡。750g/30包。',
    price: 89.90,
    marketPrice: 128.00,
    stock: 1800,
    sales: 2345,
    tags: ['中等保质期', '爆品推荐'],
    rating: 4.8,
    reviews: 789,
    skus: [
      { id: 'SKU019', name: '750g/30包', price: 89.90, stock: 1000 },
      { id: 'SKU020', name: '1.5kg/60包', price: 168.00, stock: 800 }
    ],
    deliveryType: 'both',
    isFlashSale: false,
    storageType: STORAGE_TYPE.DRY,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.MEDIUM_TERM,
    shelfLifeDays: 240,
    productionDate: '2026-05-20',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🥜 阴凉干燥处密封保存，开封后建议7天内食用完毕，坚果酥脆口感最佳。',
    warehouseZone: 'C-150'
  },
  {
    id: 'P011',
    name: '今麦郎 一桶半 红烧牛肉面 145g×12桶 整箱装',
    categoryId: 2,
    coverImage: '🪣',
    images: ['🪣', '🥩', '📦'],
    description: '加量不加价，145g大桶装，面饼增量50%，一碗吃饱。红烧牛肉经典口味。',
    price: 49.90,
    marketPrice: 65.00,
    stock: 3200,
    sales: 1876,
    tags: ['长保质期', '加量装'],
    rating: 4.7,
    reviews: 456,
    skus: [
      { id: 'SKU021', name: '145g×12桶', price: 49.90, stock: 2000 },
      { id: 'SKU022', name: '145g×6桶', price: 28.00, stock: 1200 }
    ],
    deliveryType: 'both',
    isFlashSale: false,
    storageType: STORAGE_TYPE.DRY,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.LONG_TERM,
    shelfLifeDays: 180,
    productionDate: '2026-05-08',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🪣 干燥避光保存，面饼酥脆，建议生产后4个月内食用风味最佳。',
    warehouseZone: 'C-278'
  },
  {
    id: 'P012',
    name: '蒙牛 特仑苏 纯牛奶 250ml×12盒 整箱装',
    categoryId: 10,
    coverImage: '🐄',
    images: ['🐄', '🥛', '📦'],
    description: '来自专属牧场，3.6g优质乳蛋白，口感醇厚丝滑。250ml×12盒，送礼自用皆宜。',
    price: 59.90,
    marketPrice: 75.00,
    stock: 1800,
    sales: 1345,
    tags: ['短保质期', '冷链配送', '高端奶'],
    rating: 4.9,
    reviews: 567,
    skus: [
      { id: 'SKU023', name: '250ml×12盒', price: 59.90, stock: 1000 },
      { id: 'SKU024', name: '250ml×24盒', price: 108.00, stock: 800 }
    ],
    deliveryType: 'self_pickup',
    isFlashSale: false,
    storageType: STORAGE_TYPE.COLD_CHAIN,
    shelfLifeCategory: SHELF_LIFE_CATEGORY.SHORT_TERM,
    shelfLifeDays: 180,
    productionDate: '2026-05-28',
    tastePeriodStatus: TASTE_PERIOD_STATUS.PRIME,
    tastePeriodTip: '🐄 2-6°C冷藏保存，奶香醇厚期为生产后60天内，请尽快享用。',
    warehouseZone: 'D-012'
  }
];

// ==================== 秒杀活动 ====================
export const mockFlashSales = [
  { productId: 'P001', name: '农夫山泉', icon: '💧', flashPrice: 24.90, originalPrice: 29.90, stock: 200, sold: 380 },
  { productId: 'P002', name: '青岛啤酒', icon: '🍺', flashPrice: 49.90, originalPrice: 59.90, stock: 100, sold: 256 },
  { productId: 'P006', name: '雪花啤酒', icon: '🍻', flashPrice: 35.90, originalPrice: 42.90, stock: 150, sold: 189 },
  { productId: 'P008', name: '怡宝纯净水', icon: '💙', flashPrice: 21.90, originalPrice: 26.90, stock: 300, sold: 420 }
];

// ==================== 购物车 ====================
export const mockCartItems = [
  {
    id: 'C001',
    productId: 'P001',
    skuId: 'SKU001',
    productName: '农夫山泉 饮用天然水',
    productIcon: '💧',
    skuName: '550ml×24瓶',
    price: 29.90,
    quantity: 2,
    stock: 3000,
    checked: true
  },
  {
    id: 'C002',
    productId: 'P002',
    skuId: 'SKU003',
    productName: '青岛啤酒 经典1903',
    productIcon: '🍺',
    skuName: '500ml×12听',
    price: 59.90,
    quantity: 1,
    stock: 2000,
    checked: true
  },
  {
    id: 'C003',
    productId: 'P003',
    skuId: 'SKU005',
    productName: '康师傅 红烧牛肉面',
    productIcon: '🍜',
    skuName: '桶装110g×12桶',
    price: 45.90,
    quantity: 1,
    stock: 2500,
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
      { productId: 'P001', productName: '农夫山泉 饮用天然水', icon: '💧', skuName: '550ml×24瓶', price: 29.90, quantity: 2 }
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
      { productId: 'P002', productName: '青岛啤酒 经典1903', icon: '🍺', skuName: '500ml×12听', price: 59.90, quantity: 1 }
    ],
    totalAmount: 59.90,
    payAmount: 49.90,
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
      { productId: 'P003', productName: '康师傅 红烧牛肉面', icon: '🍜', skuName: '桶装110g×12桶', price: 45.90, quantity: 1 },
      { productId: 'P008', productName: '怡宝纯净水', icon: '💙', skuName: '555ml×24瓶', price: 26.90, quantity: 1 }
    ],
    totalAmount: 72.80,
    payAmount: 57.80,
    discount: 15.00,
    deliveryType: 'self_pickup',
    buildingLeader: { id: 'BL8888', name: '李明' },
    communityLeader: { id: 'D001', name: '王阿姨' },
    commission: { buildingLeader: 3.64, communityLeader: 2.18 },
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

// ==================== 积分系统 ====================
export const mockPointsInfo = {
  totalPoints: 5680,
  totalEarned: 12800,
  totalSpent: 7120,
  level: '黄金会员',
  levelIcon: '🥇'
};

// 积分流水记录
export const mockPointsRecords = [
  { id: 'PR001', type: 'earn', amount: 98, description: '购物获得 - 订单 LX20260604001', orderNo: 'LX20260604001', createdAt: '2026-06-04 09:31' },
  { id: 'PR002', type: 'spend', amount: 1000, description: '兑换保洁服务（1次）', serviceType: 'cleaning', createdAt: '2026-06-03 15:20' },
  { id: 'PR003', type: 'earn', amount: 39, description: '购物获得 - 订单 LX20260603012', orderNo: 'LX20260603012', createdAt: '2026-06-03 14:21' },
  { id: 'PR004', type: 'spend', amount: 800, description: '兑换洗车服务（1次）', serviceType: 'car_wash', createdAt: '2026-06-02 10:00' },
  { id: 'PR005', type: 'earn', amount: 113, description: '购物获得 - 订单 LX20260602005', orderNo: 'LX20260602005', createdAt: '2026-06-02 18:46' },
  { id: 'PR006', type: 'earn', amount: 55, description: '购物获得 - 订单 LX20260528003', orderNo: 'LX20260528003', createdAt: '2026-05-28 12:30' },
  { id: 'PR007', type: 'spend', amount: 30000, description: '兑换免物业费（一年）', serviceType: 'property_fee', createdAt: '2026-05-20 09:00' },
  { id: 'PR008', type: 'earn', amount: 128, description: '购物获得 - 订单 LX20260515007', orderNo: 'LX20260515007', createdAt: '2026-05-15 16:45' },
  { id: 'PR009', type: 'earn', amount: 75, description: '购物获得 - 订单 LX20260510002', orderNo: 'LX20260510002', createdAt: '2026-05-10 11:20' },
  { id: 'PR010', type: 'spend', amount: 2000, description: '兑换保洁服务（2次）', serviceType: 'cleaning', createdAt: '2026-05-05 14:30' }
];

// 可兑换的积分服务
export const mockPointsServices = [
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
    images: ['🧹', '🏠', '✨'],
    tags: ['热门', '品质保证'],
    deliveryType: 'door_delivery'
  },
  {
    id: 'PS002',
    name: '精致洗车服务',
    icon: '🚗',
    category: 'car_wash',
    categoryName: '洗车服务',
    pointsPrice: 800,
    marketPrice: 68,
    stock: 100,
    sales: 156,
    description: '小区内上门精洗，含车身清洗、内饰吸尘、轮胎护理、玻璃清洁。',
    images: ['🚗', '💦', '✨'],
    tags: ['便捷', '上门服务'],
    deliveryType: 'self_pickup'
  },
  {
    id: 'PS003',
    name: '物业费抵扣（一年）',
    icon: '🏠',
    category: 'property_fee',
    categoryName: '免物业费',
    pointsPrice: 30000,
    marketPrice: 3600,
    stock: 20,
    sales: 45,
    description: '使用30000积分抵扣一整年物业费，超值兑换，直接抵扣至物业账单。',
    images: ['🏠', '📋', '✅'],
    tags: ['超值', '限量'],
    deliveryType: 'self_pickup'
  },
  {
    id: 'PS004',
    name: '深度保洁服务（含厨房）',
    icon: '🧼',
    category: 'cleaning',
    categoryName: '保洁服务',
    pointsPrice: 2000,
    marketPrice: 258,
    stock: 30,
    sales: 89,
    description: '深度保洁，含厨房油烟机清洗、卫生间除垢、全屋地板打蜡，时长约4小时。',
    images: ['🧼', '🏠', '✨'],
    tags: ['深度清洁'],
    deliveryType: 'door_delivery'
  },

];

// 积分兑换记录
export const mockExchangeRecords = [
  { id: 'EX001', serviceName: '家庭保洁服务', points: 1000, status: 'completed', serviceDate: '2026-06-03', createdAt: '2026-06-03 15:20' },
  { id: 'EX002', serviceName: '精致洗车服务', points: 800, status: 'completed', serviceDate: '2026-06-02', createdAt: '2026-06-02 10:00' },
  { id: 'EX003', serviceName: '免物业费（一年）', points: 30000, status: 'completed', serviceDate: '2026-05-20', createdAt: '2026-05-20 09:00' }
];
